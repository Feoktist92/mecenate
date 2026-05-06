import React from 'react';
import { StyleSheet, View } from 'react-native';

import { usePostDetailScreen } from '@/features/post-detail/model/screen/usePostDetailScreen';
import { colors } from '@/shared/theme/tokens';
import { UiStateView } from '@/shared/ui/kit/UiStateView';

import { CommentComposer } from '../comment/CommentComposer';
import { PostDetailCommentsList } from '../comment/PostDetailCommentsList';
import { useCommentComposerLayout } from '../comment/useCommentComposerLayout';
import { PostDetailScreenSkeleton } from './PostDetailScreenSkeleton';
import { usePostLikeFeedback } from './usePostLikeFeedback';

type PostDetailScreenProps = {
  postId: string;
};

export const PostDetailScreen = ({ postId }: PostDetailScreenProps) => {
  const screen = usePostDetailScreen(postId);
  const composerLayout = useCommentComposerLayout();
  const { handleLikePress, likeAnimatedStyle } = usePostLikeFeedback({
    toggleLike: screen.toggleLike,
  });

  if (screen.screenState === 'missing') {
    return <UiStateView title='Публикация не найдена' />;
  }

  if (screen.screenState === 'loading') {
    return <PostDetailScreenSkeleton />;
  }

  if (screen.screenState === 'error' || !screen.post) {
    return (
      <UiStateView
        title='Не удалось загрузить публикацию'
        onRetry={screen.handleRetryDetail}
      />
    );
  }

  return (
    <View style={styles.container}>
      <PostDetailCommentsList
        comments={screen.comments}
        post={screen.post}
        listBottomPadding={composerLayout.listBottomPadding}
        likeAnimatedStyle={likeAnimatedStyle}
        isCommentsPending={screen.isCommentsPending}
        isCommentsError={screen.isCommentsError}
        isFetchingNextPage={screen.isFetchingNextPage}
        onCommentsEndReached={screen.handleCommentsEndReached}
        onLikePress={handleLikePress}
        onRetryComments={screen.handleRetryComments}
      />
      <CommentComposer
        value={screen.commentText}
        editable={screen.isCommentComposerEditable}
        sendDisabled={screen.isCommentSendDisabled}
        bottomOffset={composerLayout.bottomOffset}
        bottomPadding={composerLayout.bottomPadding}
        onChangeText={screen.setCommentText}
        onSend={screen.handleSendCommentPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
});
