import { useInfiniteQuery } from '@tanstack/react-query';

import { CommentDto, CommentsResponseDto } from '@/entities/post/types';
import { getPostComments } from '@/features/post-detail/api/getPostComments';

import { postDetailKeys } from './queryKeys';

export type PostCommentsPage = CommentsResponseDto;

export const getNextCommentsPageParam = (
  lastPage: PostCommentsPage
): string | undefined => {
  if (!lastPage.data.hasMore || !lastPage.data.nextCursor) {
    return undefined;
  }

  return lastPage.data.nextCursor;
};

export const flattenCommentsPages = (
  pages: PostCommentsPage[]
): CommentDto[] => {
  const seenCommentIds = new Set<string>();
  const comments: CommentDto[] = [];

  pages.forEach((page) => {
    page.data.comments.forEach((comment) => {
      if (seenCommentIds.has(comment.id)) {
        return;
      }

      seenCommentIds.add(comment.id);
      comments.push(comment);
    });
  });

  return comments;
};

export const usePostCommentsInfiniteQuery = (postId: string) => {
  const query = useInfiniteQuery({
    queryKey: postDetailKeys.comments(postId),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      getPostComments({
        postId,
        limit: 20,
        cursor: pageParam,
      }),
    getNextPageParam: getNextCommentsPageParam,
    enabled: Boolean(postId),
  });

  const comments = query.data ? flattenCommentsPages(query.data.pages) : [];

  return {
    ...query,
    comments,
  };
};
