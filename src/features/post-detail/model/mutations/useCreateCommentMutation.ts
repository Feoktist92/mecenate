import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createPostComment } from '@/features/post-detail/api/createPostComment';

import { prependCommentToCommentsCache } from '../cache/commentsCache';
import type { PostCommentsInfiniteData } from '@/features/post-detail/types/cache';
import { postDetailKeys } from '../query/queryKeys';
import { invalidatePostCounters } from './postDetailInvalidation';

export const useCreateCommentMutation = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => createPostComment({ postId, text }),
    onSuccess: (response) => {
      queryClient.setQueryData<PostCommentsInfiniteData>(
        postDetailKeys.comments(postId),
        (current) =>
          prependCommentToCommentsCache(current, response.data.comment)
      );

      invalidatePostCounters(queryClient, postId);
    },
  });
};
