import type { CommentDto } from '@/entities/post/types';

import type { PostCommentsInfiniteData } from '@/features/post-detail/types/cache';

export const prependCommentToCommentsCache = (
  current: PostCommentsInfiniteData | undefined,
  comment: CommentDto
): PostCommentsInfiniteData | undefined => {
  if (!current) {
    return current;
  }

  if (current.pages.length === 0) {
    return {
      ...current,
      pages: [
        {
          ok: true,
          data: {
            comments: [comment],
            nextCursor: null,
            hasMore: false,
          },
        },
      ],
      pageParams: current.pageParams.length > 0 ? current.pageParams : [null],
    };
  }

  const [firstPage, ...restPages] = current.pages;

  return {
    ...current,
    pages: [
      {
        ...firstPage,
        data: {
          ...firstPage.data,
          comments: [comment, ...firstPage.data.comments],
        },
      },
      ...restPages,
    ],
  };
};
