import { QueryClient, useQueryClient } from '@tanstack/react-query';
import React from 'react';

import { CommentDto, PostDetailResponseDto } from '@/entities/post/types';
import { FEED_QUERY_KEY } from '@/features/feed/model/query/useFeedInfiniteQuery';
import { prependCommentToCommentsCache } from '@/features/post-detail/model/cache/commentsCache';
import { updatePostInFeedCache } from '@/features/post-detail/model/cache/feedCache';
import { consumePostLikeInteractionGuard } from '@/features/post-detail/model/cache/postLikeCache';
import type {
  FeedInfiniteData,
  PostCommentsInfiniteData,
} from '@/features/post-detail/types/cache';
import { invalidatePostCounters } from '@/features/post-detail/model/mutations/postDetailInvalidation';
import { postDetailKeys } from '@/features/post-detail/model/query/queryKeys';
import { env } from '@/shared/config/env';

type RealtimeLikeUpdatedEvent = {
  type: 'like_updated';
  postId: string;
  likesCount: number;
};

type RealtimeCommentAddedEvent = {
  type: 'comment_added';
  postId: string;
  comment: CommentDto;
};

type PostDetailRealtimeEvent =
  | RealtimeLikeUpdatedEvent
  | RealtimeCommentAddedEvent
  | { type: 'ping' };

export const POST_DETAIL_WS_RECONNECT_DELAY_MS = 1000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getEventType = (payload: Record<string, unknown>): string | null => {
  if (typeof payload.type === 'string') {
    return payload.type;
  }

  if (typeof payload.event === 'string') {
    return payload.event;
  }

  return null;
};

const getEventData = (
  payload: Record<string, unknown>
): Record<string, unknown> => (isRecord(payload.data) ? payload.data : payload);

const readString = (value: unknown): string | null =>
  typeof value === 'string' ? value : null;

const readNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

export const buildPostDetailWsUrl = (
  apiBaseUrl: string,
  token: string
): string => {
  const httpUrl = new URL(apiBaseUrl);

  httpUrl.protocol = httpUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  httpUrl.pathname = `${httpUrl.pathname.replace(/\/+$/, '')}/ws`;
  httpUrl.search = '';
  httpUrl.hash = '';
  httpUrl.searchParams.set('token', token);

  return httpUrl.toString();
};

export const parsePostDetailRealtimeEvent = (
  payload: unknown
): PostDetailRealtimeEvent | null => {
  if (!isRecord(payload)) {
    return null;
  }

  const type = getEventType(payload);

  if (!type) {
    return null;
  }

  if (type === 'ping') {
    return { type: 'ping' };
  }

  const data = getEventData(payload);

  if (type === 'like_updated') {
    const postId = readString(data.postId);
    const likesCount = readNumber(data.likesCount);

    if (!postId || likesCount === null) {
      return null;
    }

    return {
      type,
      postId,
      likesCount,
    };
  }

  if (type === 'comment_added') {
    const postId = readString(data.postId);
    const comment = isRecord(data.comment)
      ? (data.comment as CommentDto)
      : null;

    if (!postId || !comment || typeof comment.id !== 'string') {
      return null;
    }

    return {
      type,
      postId,
      comment,
    };
  }

  return null;
};

const applyLikeUpdatedToPostDetailCache = (
  current: PostDetailResponseDto | undefined,
  likesCount: number
): PostDetailResponseDto | undefined => {
  if (!current) {
    return current;
  }

  return {
    ...current,
    data: {
      ...current.data,
      post: {
        ...current.data.post,
        likesCount,
      },
    },
  };
};

const applyLikeUpdatedToFeedCache = (
  current: FeedInfiniteData | undefined,
  postId: string,
  likesCount: number
): FeedInfiniteData | undefined => {
  return updatePostInFeedCache(current, postId, (post) => ({
    ...post,
    likesCount,
  }));
};

const hasCommentInCommentsCache = (
  current: PostCommentsInfiniteData | undefined,
  commentId: string
): boolean => {
  if (!current) {
    return false;
  }

  return current.pages.some((page) =>
    page.data.comments.some((comment) => comment.id === commentId)
  );
};

const prependUniqueCommentToCommentsCache = (
  current: PostCommentsInfiniteData | undefined,
  comment: CommentDto
): PostCommentsInfiniteData | undefined => {
  if (!current || hasCommentInCommentsCache(current, comment.id)) {
    return current;
  }

  return prependCommentToCommentsCache(current, comment);
};

export const applyPostDetailRealtimeEvent = (
  queryClient: QueryClient,
  currentPostId: string,
  event: PostDetailRealtimeEvent
) => {
  if (event.type === 'ping' || event.postId !== currentPostId) {
    return;
  }

  if (event.type === 'like_updated') {
    if (consumePostLikeInteractionGuard(currentPostId)) {
      return;
    }

    queryClient.setQueryData<PostDetailResponseDto>(
      postDetailKeys.detail(currentPostId),
      (current) => applyLikeUpdatedToPostDetailCache(current, event.likesCount)
    );

    queryClient.setQueriesData<FeedInfiniteData>(
      { queryKey: [FEED_QUERY_KEY] },
      (current) =>
        applyLikeUpdatedToFeedCache(current, currentPostId, event.likesCount)
    );

    return;
  }

  const commentsCacheKey = postDetailKeys.comments(currentPostId);
  const currentComments =
    queryClient.getQueryData<PostCommentsInfiniteData>(commentsCacheKey);
  const alreadyKnownComment = hasCommentInCommentsCache(
    currentComments,
    event.comment.id
  );

  queryClient.setQueryData<PostCommentsInfiniteData>(
    commentsCacheKey,
    (current) => prependUniqueCommentToCommentsCache(current, event.comment)
  );

  if (alreadyKnownComment) {
    return;
  }

  invalidatePostCounters(queryClient, currentPostId);
};

export const usePostDetailRealtime = (postId: string) => {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!postId) {
      return;
    }

    let isDisposed = false;
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const clearReconnectTimer = () => {
      if (!reconnectTimer) {
        return;
      }

      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    };

    const scheduleReconnect = () => {
      if (isDisposed || reconnectTimer) {
        return;
      }

      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connect();
      }, POST_DETAIL_WS_RECONNECT_DELAY_MS);
    };

    const connect = () => {
      if (isDisposed) {
        return;
      }

      const currentSocket = new WebSocket(
        buildPostDetailWsUrl(env.API_BASE_URL, env.API_TOKEN)
      );

      socket = currentSocket;

      currentSocket.onmessage = (message) => {
        try {
          const payload = JSON.parse(message.data);
          const event = parsePostDetailRealtimeEvent(payload);

          if (!event) {
            return;
          }

          applyPostDetailRealtimeEvent(queryClient, postId, event);
        } catch {
          // Ignore malformed WS messages.
        }
      };

      currentSocket.onclose = scheduleReconnect;
      currentSocket.onerror = () => {
        scheduleReconnect();
        currentSocket.close();
      };
    };

    connect();

    return () => {
      isDisposed = true;
      clearReconnectTimer();

      if (socket) {
        socket.onmessage = null;
        socket.onclose = null;
        socket.onerror = null;
        socket.close();
      }
    };
  }, [postId, queryClient]);
};
