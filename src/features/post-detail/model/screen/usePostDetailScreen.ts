import React from 'react';

import { useCreateCommentMutation } from '@/features/post-detail/model/mutations/useCreateCommentMutation';
import { usePostCommentsInfiniteQuery } from '@/features/post-detail/model/query/usePostCommentsInfiniteQuery';
import { usePostDetailQuery } from '@/features/post-detail/model/query/usePostDetailQuery';
import { usePostDetailRealtime } from '@/features/post-detail/model/realtime/usePostDetailRealtime';
import { useTogglePostLikeMutation } from '@/features/post-detail/model/mutations/useTogglePostLikeMutation';
import { isCommentSendDisabled } from '@/features/post-detail/model/comment/commentComposerState';

type PostDetailScreenState = 'missing' | 'loading' | 'error' | 'content';

const getPostDetailScreenState = ({
  hasPostId,
  isPending,
  isError,
  hasPost,
}: {
  hasPostId: boolean;
  isPending: boolean;
  isError: boolean;
  hasPost: boolean;
}): PostDetailScreenState => {
  if (!hasPostId) {
    return 'missing';
  }

  if (isPending) {
    return 'loading';
  }

  if (isError || !hasPost) {
    return 'error';
  }

  return 'content';
};

export const usePostDetailScreen = (postId: string) => {
  const detailQuery = usePostDetailQuery(postId);
  const commentsQuery = usePostCommentsInfiniteQuery(postId);
  const toggleLikeMutation = useTogglePostLikeMutation(postId);
  const createCommentMutation = useCreateCommentMutation(postId);
  const [commentText, setCommentText] = React.useState('');

  usePostDetailRealtime(postId);

  const handleSendComment = React.useCallback(async () => {
    const trimmedText = commentText.trim();

    if (!trimmedText || createCommentMutation.isPending) {
      return;
    }

    try {
      await createCommentMutation.mutateAsync(trimmedText);
      setCommentText('');
    } catch {
      // Keep input value on error so user can retry.
    }
  }, [commentText, createCommentMutation]);

  const handleCommentsEndReached = React.useCallback(() => {
    if (
      commentsQuery.hasNextPage &&
      !commentsQuery.isFetchingNextPage &&
      !commentsQuery.isPending
    ) {
      commentsQuery.fetchNextPage();
    }
  }, [commentsQuery]);

  const handleRetryDetail = React.useCallback(() => {
    void detailQuery.refetch();
  }, [detailQuery]);

  const handleRetryComments = React.useCallback(() => {
    void commentsQuery.refetch();
  }, [commentsQuery]);

  const handleSendCommentPress = React.useCallback(() => {
    void handleSendComment();
  }, [handleSendComment]);

  const post = detailQuery.data?.data.post;

  return {
    commentText,
    comments: commentsQuery.comments,
    post,
    screenState: getPostDetailScreenState({
      hasPostId: Boolean(postId),
      isPending: detailQuery.isPending,
      isError: detailQuery.isError,
      hasPost: Boolean(post),
    }),
    isCommentComposerEditable: !createCommentMutation.isPending,
    isCommentSendDisabled: isCommentSendDisabled(
      commentText,
      !createCommentMutation.isPending
    ),
    isCommentsPending: commentsQuery.isPending,
    isCommentsError: commentsQuery.isError,
    isFetchingNextPage: commentsQuery.isFetchingNextPage,
    setCommentText,
    handleCommentsEndReached,
    handleRetryComments,
    handleRetryDetail,
    handleSendComment,
    handleSendCommentPress,
    toggleLike: toggleLikeMutation.toggleLike,
  };
};
