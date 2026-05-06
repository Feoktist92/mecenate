import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { PostDetailResponseDto } from '@/entities/post/types';
import { FEED_QUERY_KEY } from '@/features/feed/model/query/useFeedInfiniteQuery';
import { togglePostLike } from '@/features/post-detail/api/togglePostLike';

import {
  applyPostLikeStateToPostDetail,
  getOptimisticPostLikeState,
  markPostLikeInteraction,
  type PostLikeState,
} from '../cache/postLikeCache';
import { postDetailKeys } from '../query/queryKeys';

export const useTogglePostLikeMutation = (postId: string) => {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const desiredIsLikedRef = React.useRef<boolean | null>(null);
  const requestRunningRef = React.useRef(false);
  const serverStateRef = React.useRef<PostLikeState | null>(null);
  const visualBaseStateRef = React.useRef<PostLikeState | null>(null);
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const getCurrentPostLikeState =
    React.useCallback((): PostLikeState | null => {
      const detail = queryClient.getQueryData<PostDetailResponseDto>(
        postDetailKeys.detail(postId)
      );
      const post = detail?.data.post;

      return post
        ? {
            isLiked: post.isLiked,
            likesCount: post.likesCount,
          }
        : null;
    }, [postId, queryClient]);

  const applyVisibleState = React.useCallback(
    (likeState: PostLikeState) => {
      queryClient.setQueryData<PostDetailResponseDto>(
        postDetailKeys.detail(postId),
        (current) => applyPostLikeStateToPostDetail(current, likeState)
      );
    },
    [postId, queryClient]
  );

  const applyDesiredVisibleState = React.useCallback(() => {
    const visualBaseState = visualBaseStateRef.current;
    const desiredIsLiked = desiredIsLikedRef.current;

    if (!visualBaseState || desiredIsLiked === null) {
      return;
    }

    applyVisibleState(
      getOptimisticPostLikeState(visualBaseState, desiredIsLiked)
    );
  }, [applyVisibleState]);

  const runRequestLoop = React.useCallback(async () => {
    if (requestRunningRef.current) {
      return;
    }

    requestRunningRef.current = true;

    if (mountedRef.current) {
      setIsPending(true);
      setIsError(false);
      setError(null);
      setIsSuccess(false);
    }

    try {
      while (mountedRef.current) {
        const desiredIsLiked = desiredIsLikedRef.current;
        const serverState = serverStateRef.current;

        if (
          desiredIsLiked === null ||
          !serverState ||
          desiredIsLiked === serverState.isLiked
        ) {
          break;
        }

        const response = await togglePostLike(postId);
        const nextServerState = response.data;

        serverStateRef.current = nextServerState;
        markPostLikeInteraction(postId);

        if (desiredIsLikedRef.current === nextServerState.isLiked) {
          desiredIsLikedRef.current = null;
          visualBaseStateRef.current = null;
          break;
        }

        applyDesiredVisibleState();
      }

      if (mountedRef.current) {
        setIsSuccess(true);
      }
    } catch (caughtError) {
      const serverState = serverStateRef.current;

      desiredIsLikedRef.current = null;
      visualBaseStateRef.current = null;

      if (serverState) {
        applyVisibleState(serverState);
      }

      if (mountedRef.current) {
        setIsError(true);
        setError(caughtError);
      }
    } finally {
      requestRunningRef.current = false;

      if (mountedRef.current) {
        setIsPending(false);
      }

      void queryClient.invalidateQueries({ queryKey: [FEED_QUERY_KEY] });
    }
  }, [applyDesiredVisibleState, applyVisibleState, postId, queryClient]);

  const toggleLike = React.useCallback(() => {
    const currentLikeState = getCurrentPostLikeState();

    if (!currentLikeState) {
      return false;
    }

    void queryClient.cancelQueries({ queryKey: postDetailKeys.detail(postId) });

    if (desiredIsLikedRef.current === null) {
      serverStateRef.current = currentLikeState;
      visualBaseStateRef.current = currentLikeState;
      desiredIsLikedRef.current = !currentLikeState.isLiked;
    } else {
      desiredIsLikedRef.current = !desiredIsLikedRef.current;
    }

    markPostLikeInteraction(postId);
    applyDesiredVisibleState();
    void runRequestLoop();

    return true;
  }, [
    applyDesiredVisibleState,
    getCurrentPostLikeState,
    postId,
    queryClient,
    runRequestLoop,
  ]);

  return {
    error,
    isError,
    isPending,
    isSuccess,
    toggleLike,
  };
};
