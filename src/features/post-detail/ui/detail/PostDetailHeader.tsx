import React from 'react';
import { StyleProp, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import type { PostDto } from '@/entities/post/types';
import { PostActions } from '@/entities/post/ui/PostActions';
import { PostBlock } from '@/entities/post/ui/PostBlock';
import { spacing } from '@/shared/theme/tokens';

import { PostCommentsHeader } from '../comment/PostCommentsHeader';

type PostDetailHeaderProps = {
  post: PostDto;
  likeAnimatedStyle: StyleProp<ViewStyle>;
  onLikePress: () => void;
};

export const PostDetailHeader = ({
  post,
  likeAnimatedStyle,
  onLikePress,
}: PostDetailHeaderProps) => (
  <PostBlock
    post={post}
    contentMode={{ type: 'full' }}
    bodyTone='secondary'
    mediaContentGap={spacing.md}
    style={styles.root}
    actions={
      <PostActions
        likesCount={post.likesCount}
        commentsCount={post.commentsCount}
        isLiked={post.isLiked}
        onLikePress={onLikePress}
        renderLikeContent={(likePill) => (
          <Animated.View style={likeAnimatedStyle}>{likePill}</Animated.View>
        )}
      />
    }
    footer={<PostCommentsHeader commentsCount={post.commentsCount} />}
  />
);

const styles = StyleSheet.create({
  root: {
    paddingTop: spacing.md,
  },
});
