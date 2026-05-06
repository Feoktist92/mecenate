import type { PostDetailResponseDto } from '@/entities/post/types';

export type PostLikeState = {
  isLiked: boolean;
  likesCount: number;
};

const localLikeInteractionGuards = new Map<string, number>();

export const markPostLikeInteraction = (postId: string): void => {
  localLikeInteractionGuards.set(
    postId,
    (localLikeInteractionGuards.get(postId) ?? 0) + 1
  );
};

export const isPostLikeInteractionGuarded = (postId: string): boolean => {
  return (localLikeInteractionGuards.get(postId) ?? 0) > 0;
};

export const consumePostLikeInteractionGuard = (postId: string): boolean => {
  const currentGuardCount = localLikeInteractionGuards.get(postId) ?? 0;

  if (currentGuardCount <= 0) {
    return false;
  }

  if (currentGuardCount === 1) {
    localLikeInteractionGuards.delete(postId);
    return true;
  }

  localLikeInteractionGuards.set(postId, currentGuardCount - 1);
  return true;
};

export const clearPostLikeInteractionGuards = (): void => {
  localLikeInteractionGuards.clear();
};

export const getOptimisticPostLikeState = (
  baseState: PostLikeState,
  desiredIsLiked: boolean
): PostLikeState => {
  const countDelta =
    desiredIsLiked === baseState.isLiked ? 0 : desiredIsLiked ? 1 : -1;

  return {
    isLiked: desiredIsLiked,
    likesCount: Math.max(baseState.likesCount + countDelta, 0),
  };
};

export const applyPostLikeStateToPostDetail = (
  current: PostDetailResponseDto | undefined,
  likeState: PostLikeState
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
        isLiked: likeState.isLiked,
        likesCount: likeState.likesCount,
      },
    },
  };
};
