import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import type { PostDto } from '@/entities/post/types';
import { getPostText } from '@/entities/post/lib/postText';
import { spacing } from '@/shared/theme/tokens';

import { PostContent } from './PostContent';
import { PostHeader } from './PostHeader';
import { PostMedia } from './PostMedia';

type PostBlockContentMode =
  | {
      type: 'preview';
      isExpanded: boolean;
      onToggleExpand: () => void;
    }
  | {
      type: 'full';
    };

type PostBlockProps = {
  post: PostDto;
  contentMode: PostBlockContentMode;
  bodyTone?: 'primary' | 'secondary';
  isContentLocked?: boolean;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  mediaContentGap?: number;
  style?: StyleProp<ViewStyle>;
  onCoverError?: () => void;
};

export const PostBlock = ({
  post,
  contentMode,
  bodyTone = 'primary',
  isContentLocked = false,
  actions,
  footer,
  mediaContentGap = spacing.sm,
  style,
  onCoverError,
}: PostBlockProps) => {
  const text = getPostText(post, contentMode.type);

  return (
    <View style={[styles.root, style]}>
      <PostHeader
        authorName={post.author.displayName}
        avatarUrl={post.author.avatarUrl}
      />
      <View style={[styles.mediaAndContent, { gap: mediaContentGap }]}>
        <PostMedia
          coverUrl={post.coverUrl}
          isLocked={isContentLocked}
          onError={onCoverError}
        />
        <PostContent
          title={post.title}
          text={text}
          mode={contentMode}
          bodyTone={bodyTone}
          isLocked={isContentLocked}
        />
      </View>
      {actions}
      {footer}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    gap: spacing.md,
  },
  mediaAndContent: {
    alignSelf: 'stretch',
  },
});
