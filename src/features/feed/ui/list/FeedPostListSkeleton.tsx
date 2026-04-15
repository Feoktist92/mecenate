import React from 'react';
import { StyleSheet, View } from 'react-native';

import { FeedPostSkeletonCard } from '@/features/feed/ui/post/FeedPostSkeletonCard';
import { spacing } from '@/shared/theme/tokens';

export const FeedPostListSkeleton = () => (
  <View style={styles.content} testID="feed-list-skeleton">
    <FeedPostSkeletonCard />
    <View style={styles.separator} />
    <FeedPostSkeletonCard />
    <View style={styles.separator} />
    <FeedPostSkeletonCard />
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
