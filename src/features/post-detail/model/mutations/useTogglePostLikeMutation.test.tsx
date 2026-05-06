import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import React, { PropsWithChildren } from 'react';

import type {
  PostDetailResponseDto,
  TogglePostLikeResponseDto,
} from '@/entities/post/types';
import { togglePostLike } from '@/features/post-detail/api/togglePostLike';

import { clearPostLikeInteractionGuards } from '../cache/postLikeCache';
import { postDetailKeys } from '../query/queryKeys';
import {
  createDeferred,
  createTestPostDetail,
  createTestQueryClient,
  TEST_POST_ID,
} from '../testing/postDetailTestFactories';
import { useTogglePostLikeMutation } from './useTogglePostLikeMutation';

jest.mock('@/features/post-detail/api/togglePostLike', () => ({
  togglePostLike: jest.fn(),
}));

const mockedTogglePostLike = togglePostLike as jest.MockedFunction<
  typeof togglePostLike
>;

describe('useTogglePostLikeMutation', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    clearPostLikeInteractionGuards();
  });

  it('updates the visible state on every rapid tap while sending one request at a time', async () => {
    const queryClient = createTestQueryClient();
    const firstRequest = createDeferred<TogglePostLikeResponseDto>();
    const secondRequest = createDeferred<TogglePostLikeResponseDto>();

    mockedTogglePostLike
      .mockReturnValueOnce(firstRequest.promise)
      .mockReturnValueOnce(secondRequest.promise);
    queryClient.setQueryData(
      postDetailKeys.detail(TEST_POST_ID),
      createTestPostDetail()
    );

    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result, unmount } = renderHook(
      () => useTogglePostLikeMutation(TEST_POST_ID),
      {
        wrapper,
      }
    );

    act(() => {
      expect(result.current.toggleLike()).toBe(true);
      expect(result.current.toggleLike()).toBe(true);
    });

    expect(mockedTogglePostLike).toHaveBeenCalledTimes(1);

    let detail = queryClient.getQueryData<PostDetailResponseDto>(
      postDetailKeys.detail(TEST_POST_ID)
    );

    expect(detail?.data.post.isLiked).toBe(false);
    expect(detail?.data.post.likesCount).toBe(10);

    await act(async () => {
      firstRequest.resolve({
        ok: true,
        data: {
          isLiked: true,
          likesCount: 11,
        },
      });
      await firstRequest.promise;
    });

    await waitFor(() => {
      expect(mockedTogglePostLike).toHaveBeenCalledTimes(2);
    });

    detail = queryClient.getQueryData<PostDetailResponseDto>(
      postDetailKeys.detail(TEST_POST_ID)
    );

    expect(detail?.data.post.isLiked).toBe(false);
    expect(detail?.data.post.likesCount).toBe(10);

    await act(async () => {
      secondRequest.resolve({
        ok: true,
        data: {
          isLiked: false,
          likesCount: 10,
        },
      });
      await secondRequest.promise;
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    unmount();
    queryClient.clear();
  });

  it('does not send another request when rapid taps end at the first server state', async () => {
    const queryClient = createTestQueryClient();
    const request = createDeferred<TogglePostLikeResponseDto>();

    mockedTogglePostLike.mockReturnValueOnce(request.promise);
    queryClient.setQueryData(
      postDetailKeys.detail(TEST_POST_ID),
      createTestPostDetail()
    );

    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result, unmount } = renderHook(
      () => useTogglePostLikeMutation(TEST_POST_ID),
      {
        wrapper,
      }
    );

    act(() => {
      expect(result.current.toggleLike()).toBe(true);
      expect(result.current.toggleLike()).toBe(true);
      expect(result.current.toggleLike()).toBe(true);
    });

    expect(mockedTogglePostLike).toHaveBeenCalledTimes(1);

    const detail = queryClient.getQueryData<PostDetailResponseDto>(
      postDetailKeys.detail(TEST_POST_ID)
    );

    expect(detail?.data.post.isLiked).toBe(true);
    expect(detail?.data.post.likesCount).toBe(11);

    await act(async () => {
      request.resolve({
        ok: true,
        data: {
          isLiked: true,
          likesCount: 11,
        },
      });
      await request.promise;
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
    expect(mockedTogglePostLike).toHaveBeenCalledTimes(1);

    unmount();
    queryClient.clear();
  });
});
