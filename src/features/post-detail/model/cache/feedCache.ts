import type { PostDto } from '@/entities/post/types';

import type { FeedInfiniteData } from '@/features/post-detail/types/cache';

export const updatePostInFeedCache = (
  current: FeedInfiniteData | undefined,
  postId: string,
  updatePost: (post: PostDto) => PostDto
): FeedInfiniteData | undefined => {
  if (!current) {
    return current;
  }

  let hasChanges = false;

  const pages = current.pages.map((page) => {
    let pageChanged = false;

    const posts = page.data.posts.map((post) => {
      if (post.id !== postId) {
        return post;
      }

      pageChanged = true;
      return updatePost(post);
    });

    if (!pageChanged) {
      return page;
    }

    hasChanges = true;

    return {
      ...page,
      data: {
        ...page.data,
        posts,
      },
    };
  });

  return hasChanges ? { ...current, pages } : current;
};
