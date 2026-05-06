import React from 'react';
import { StyleSheet, View } from 'react-native';

import { PostSkeletonCard } from '@/entities/post/ui/PostSkeletonCard';
import { spacing } from '@/shared/theme/tokens';

export const FeedPostListSkeleton = () => (
  <View style={styles.content} testID='feed-list-skeleton'>
    <PostSkeletonCard />
    <View style={styles.separator} />
    <PostSkeletonCard />
    <View style={styles.separator} />
    <PostSkeletonCard />
  </View>
);

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  separator: {
    height: spacing.sm,
  },
});
