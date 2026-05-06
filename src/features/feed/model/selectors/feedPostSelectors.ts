import type { PostDto } from '@/entities/post/types';

export const isFeedPostPressable = (post: PostDto): boolean =>
  post.tier === 'free';

export const isFeedPostLocked = (post: PostDto): boolean =>
  post.tier === 'paid';

export const shouldShowFeedPostActions = (post: PostDto): boolean =>
  post.tier === 'free';
