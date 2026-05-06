import { InfiniteData, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react-native';
import React, { type PropsWithChildren } from 'react';

import {
  CommentsResponseDto,
  PostDetailResponseDto,
  PostsResponseDto,
} from '@/entities/post/types';
import { FEED_QUERY_KEY } from '@/features/feed/model/query/useFeedInfiniteQuery';
import {
  clearPostLikeInteractionGuards,
  markPostLikeInteraction,
} from '@/features/post-detail/model/cache/postLikeCache';
import {
  createTestComment,
  createTestCommentsCache,
  createTestFeedCache,
  createTestPostDetail,
  createTestQueryClient,
  TEST_POST_ID,
} from '@/features/post-detail/model/testing/postDetailTestFactories';

import { postDetailKeys } from '../query/queryKeys';
import {
  applyPostDetailRealtimeEvent,
  buildPostDetailWsUrl,
  parsePostDetailRealtimeEvent,
  POST_DETAIL_WS_RECONNECT_DELAY_MS,
  usePostDetailRealtime,
} from './usePostDetailRealtime';

class MockWebSocket {
  static instances: MockWebSocket[] = [];

  readonly url: string;
  onmessage: ((message: { data: string }) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;
  close = jest.fn();

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }
}

describe('usePostDetailRealtime helpers', () => {
  afterEach(() => {
    clearPostLikeInteractionGuards();
    jest.restoreAllMocks();
  });

  it('builds websocket URL from https API base URL', () => {
    expect(
      buildPostDetailWsUrl('https://k8s.mectest.ru/test-app', 'token_123')
    ).toBe('wss://k8s.mectest.ru/test-app/ws?token=token_123');
  });

  it('parses supported realtime events and ignores unknown payloads', () => {
    expect(parsePostDetailRealtimeEvent({ type: 'ping' })).toEqual({
      type: 'ping',
    });

    expect(
      parsePostDetailRealtimeEvent({
        type: 'like_updated',
        postId: TEST_POST_ID,
        likesCount: 15,
      })
    ).toEqual({
      type: 'like_updated',
      postId: TEST_POST_ID,
      likesCount: 15,
    });

    expect(
      parsePostDetailRealtimeEvent({
        type: 'comment_added',
        postId: TEST_POST_ID,
        comment: createTestComment('comment_1'),
      })
    ).toEqual({
      type: 'comment_added',
      postId: TEST_POST_ID,
      comment: createTestComment('comment_1'),
    });

    expect(parsePostDetailRealtimeEvent({ type: 'unknown' })).toBeNull();
    expect(parsePostDetailRealtimeEvent('bad-json')).toBeNull();
  });

  it('applies like_updated event to detail and feed caches', () => {
    const queryClient = createTestQueryClient();

    queryClient.setQueryData(
      postDetailKeys.detail(TEST_POST_ID),
      createTestPostDetail()
    );
    queryClient.setQueryData([FEED_QUERY_KEY, 'all'], createTestFeedCache());

    applyPostDetailRealtimeEvent(queryClient, TEST_POST_ID, {
      type: 'like_updated',
      postId: TEST_POST_ID,
      likesCount: 33,
    });

    const detail = queryClient.getQueryData<PostDetailResponseDto>(
      postDetailKeys.detail(TEST_POST_ID)
    );
    const feed = queryClient.getQueryData<
      InfiniteData<PostsResponseDto, string | null>
    >([FEED_QUERY_KEY, 'all']);

    expect(detail?.data.post.likesCount).toBe(33);
    expect(feed?.pages[0].data.posts[0].likesCount).toBe(33);
  });

  it('suppresses only one count-only like_updated event after a local like interaction', () => {
    const queryClient = createTestQueryClient();

    queryClient.setQueryData(
      postDetailKeys.detail(TEST_POST_ID),
      createTestPostDetail()
    );
    queryClient.setQueryData([FEED_QUERY_KEY, 'all'], createTestFeedCache());

    markPostLikeInteraction(TEST_POST_ID);

    applyPostDetailRealtimeEvent(queryClient, TEST_POST_ID, {
      type: 'like_updated',
      postId: TEST_POST_ID,
      likesCount: 33,
    });

    let detail = queryClient.getQueryData<PostDetailResponseDto>(
      postDetailKeys.detail(TEST_POST_ID)
    );
    let feed = queryClient.getQueryData<
      InfiniteData<PostsResponseDto, string | null>
    >([FEED_QUERY_KEY, 'all']);

    expect(detail?.data.post.likesCount).toBe(10);
    expect(feed?.pages[0].data.posts[0].likesCount).toBe(10);

    applyPostDetailRealtimeEvent(queryClient, TEST_POST_ID, {
      type: 'like_updated',
      postId: TEST_POST_ID,
      likesCount: 33,
    });

    detail = queryClient.getQueryData<PostDetailResponseDto>(
      postDetailKeys.detail(TEST_POST_ID)
    );
    feed = queryClient.getQueryData<
      InfiniteData<PostsResponseDto, string | null>
    >([FEED_QUERY_KEY, 'all']);

    expect(detail?.data.post.likesCount).toBe(33);
    expect(feed?.pages[0].data.posts[0].likesCount).toBe(33);
  });

  it('prepends unique comment and invalidates stale counters for comment_added', () => {
    const queryClient = createTestQueryClient();
    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

    queryClient.setQueryData(
      postDetailKeys.detail(TEST_POST_ID),
      createTestPostDetail()
    );
    queryClient.setQueryData([FEED_QUERY_KEY, 'all'], createTestFeedCache());
    queryClient.setQueryData(
      postDetailKeys.comments(TEST_POST_ID),
      createTestCommentsCache([createTestComment('comment_1')])
    );

    applyPostDetailRealtimeEvent(queryClient, TEST_POST_ID, {
      type: 'comment_added',
      postId: TEST_POST_ID,
      comment: createTestComment('comment_2'),
    });

    const detail = queryClient.getQueryData<PostDetailResponseDto>(
      postDetailKeys.detail(TEST_POST_ID)
    );
    const comments = queryClient.getQueryData<
      InfiniteData<CommentsResponseDto, string | null>
    >(postDetailKeys.comments(TEST_POST_ID));

    expect(
      comments?.pages[0].data.comments.map((comment) => comment.id)
    ).toEqual(['comment_2', 'comment_1']);
    expect(detail?.data.post.commentsCount).toBe(3);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: postDetailKeys.detail(TEST_POST_ID),
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: [FEED_QUERY_KEY],
    });
  });

  it('does not duplicate known comments on repeated comment_added event', () => {
    const queryClient = createTestQueryClient();
    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

    queryClient.setQueryData(
      postDetailKeys.detail(TEST_POST_ID),
      createTestPostDetail()
    );
    queryClient.setQueryData([FEED_QUERY_KEY, 'all'], createTestFeedCache());
    queryClient.setQueryData(
      postDetailKeys.comments(TEST_POST_ID),
      createTestCommentsCache([createTestComment('comment_1')])
    );

    applyPostDetailRealtimeEvent(queryClient, TEST_POST_ID, {
      type: 'comment_added',
      postId: TEST_POST_ID,
      comment: createTestComment('comment_1'),
    });

    const detail = queryClient.getQueryData<PostDetailResponseDto>(
      postDetailKeys.detail(TEST_POST_ID)
    );
    const feed = queryClient.getQueryData<
      InfiniteData<PostsResponseDto, string | null>
    >([FEED_QUERY_KEY, 'all']);
    const comments = queryClient.getQueryData<
      InfiniteData<CommentsResponseDto, string | null>
    >(postDetailKeys.comments(TEST_POST_ID));

    expect(
      comments?.pages[0].data.comments.map((comment) => comment.id)
    ).toEqual(['comment_1']);
    expect(detail?.data.post.commentsCount).toBe(3);
    expect(feed?.pages[0].data.posts[0].commentsCount).toBe(3);
    expect(invalidateQueries).not.toHaveBeenCalled();
  });
});

describe('usePostDetailRealtime socket lifecycle', () => {
  const originalWebSocket = globalThis.WebSocket;

  beforeEach(() => {
    jest.useFakeTimers();
    MockWebSocket.instances = [];
    globalThis.WebSocket = MockWebSocket as unknown as typeof WebSocket;
  });

  afterEach(() => {
    jest.useRealTimers();
    globalThis.WebSocket = originalWebSocket;
  });

  it('reconnects after socket close and stops reconnecting after unmount', () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: PropsWithChildren) =>
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
      );

    const { unmount } = renderHook(() => usePostDetailRealtime(TEST_POST_ID), {
      wrapper,
    });

    expect(MockWebSocket.instances).toHaveLength(1);

    act(() => {
      MockWebSocket.instances[0].onclose?.();
    });
    act(() => {
      jest.advanceTimersByTime(POST_DETAIL_WS_RECONNECT_DELAY_MS - 1);
    });

    expect(MockWebSocket.instances).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(MockWebSocket.instances).toHaveLength(2);

    const reconnectedSocket = MockWebSocket.instances[1];

    unmount();
    act(() => {
      reconnectedSocket.onclose?.();
      jest.advanceTimersByTime(POST_DETAIL_WS_RECONNECT_DELAY_MS);
    });

    expect(reconnectedSocket.close).toHaveBeenCalledTimes(1);
    expect(MockWebSocket.instances).toHaveLength(2);
  });
});
