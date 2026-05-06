import React from 'react';
import {
  FlatList,
  Keyboard,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import type { CommentDto, PostDto } from '@/entities/post/types';
import { colors, spacing } from '@/shared/theme/tokens';

import { PostDetailHeader } from '../detail/PostDetailHeader';
import { PostCommentItem } from './PostCommentItem';
import {
  PostCommentsEmptyState,
  PostCommentsFooter,
} from './PostCommentsListState';

type PostDetailCommentsListProps = {
  comments: CommentDto[];
  post: PostDto;
  listBottomPadding: number;
  likeAnimatedStyle: StyleProp<ViewStyle>;
  isCommentsPending: boolean;
  isCommentsError: boolean;
  isFetchingNextPage: boolean;
  onCommentsEndReached: () => void;
  onLikePress: () => void;
  onRetryComments: () => void;
};

export const PostDetailCommentsList = ({
  comments,
  post,
  listBottomPadding,
  likeAnimatedStyle,
  isCommentsPending,
  isCommentsError,
  isFetchingNextPage,
  onCommentsEndReached,
  onLikePress,
  onRetryComments,
}: PostDetailCommentsListProps) => (
  <FlatList<CommentDto>
    data={comments}
    keyExtractor={(comment) => comment.id}
    keyboardShouldPersistTaps='handled'
    keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
    contentInsetAdjustmentBehavior='never'
    onScrollBeginDrag={Keyboard.dismiss}
    contentContainerStyle={[
      styles.content,
      { paddingBottom: listBottomPadding },
    ]}
    style={styles.root}
    renderItem={({ item }) => <PostCommentItem comment={item} />}
    onEndReached={onCommentsEndReached}
    onEndReachedThreshold={0.35}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
    ListHeaderComponent={
      <PostDetailHeader
        post={post}
        likeAnimatedStyle={likeAnimatedStyle}
        onLikePress={onLikePress}
      />
    }
    ListFooterComponent={
      <PostCommentsFooter
        isFetchingNextPage={isFetchingNextPage}
        isError={isCommentsError}
        onRetry={onRetryComments}
      />
    }
    ListEmptyComponent={
      <PostCommentsEmptyState isPending={isCommentsPending} />
    }
  />
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  content: {
    paddingBottom: spacing.sm,
  },
  separator: {
    height: spacing.md,
  },
});
