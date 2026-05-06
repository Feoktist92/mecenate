import type { PostDto } from '@/entities/post/types';

type PostTextMode = 'preview' | 'full';

export const getPostText = (post: PostDto, mode: PostTextMode): string => {
  if (mode === 'full') {
    return post.body || post.preview || '';
  }

  return post.preview || post.body || '';
};
