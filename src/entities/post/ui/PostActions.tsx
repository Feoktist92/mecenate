import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { spacing } from '@/shared/theme/tokens';

import { PostActionPill } from './PostActionPill';

type PostActionsProps = {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  style?: StyleProp<ViewStyle>;
  onLikePress?: () => void;
  renderLikeContent?: (likePill: React.ReactElement) => React.ReactNode;
};

export const PostActions = ({
  likesCount,
  commentsCount,
  isLiked,
  style,
  onLikePress,
  renderLikeContent,
}: PostActionsProps) => {
  const likePill = (
    <PostActionPill type='like' count={likesCount} active={isLiked} />
  );
  const likeContent = renderLikeContent
    ? renderLikeContent(likePill)
    : likePill;
  const likeAction = onLikePress ? (
    <Pressable onPress={onLikePress} style={styles.likePressable}>
      {likeContent}
    </Pressable>
  ) : (
    likeContent
  );

  return (
    <View style={[styles.root, style]}>
      {likeAction}
      <PostActionPill type='comment' count={commentsCount} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  likePressable: {
    borderRadius: 9999,
  },
});
