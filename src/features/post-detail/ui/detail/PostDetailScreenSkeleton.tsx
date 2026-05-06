import React from 'react';
import { StyleSheet, View } from 'react-native';

import { PostSkeletonCard } from '@/entities/post/ui/PostSkeletonCard';
import { colors, spacing } from '@/shared/theme/tokens';
import { UiCard } from '@/shared/ui/kit/UiCard';
import { UiSkeletonBlock } from '@/shared/ui/kit/UiSkeletonBlock';

const COMMENT_SKELETON_ITEMS = [0, 1, 2];

export const PostDetailScreenSkeleton = () => (
  <View style={styles.container}>
    <PostSkeletonCard />

    <UiCard style={styles.commentsCard}>
      <View style={styles.commentsHeader}>
        <UiSkeletonBlock style={styles.commentsCount} />
        <UiSkeletonBlock style={styles.sortLink} />
      </View>

      {COMMENT_SKELETON_ITEMS.map((item) => (
        <View key={item} style={styles.commentRow}>
          <UiSkeletonBlock style={styles.commentAvatar} />
          <View style={styles.commentBody}>
            <UiSkeletonBlock style={styles.commentAuthor} />
            <UiSkeletonBlock style={styles.commentText} />
          </View>
        </View>
      ))}
    </UiCard>

    <UiCard style={styles.composerCard}>
      <UiSkeletonBlock style={styles.composerInput} />
      <UiSkeletonBlock style={styles.composerButton} />
    </UiCard>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  commentsCard: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentsCount: {
    width: 128,
    height: 32,
  },
  sortLink: {
    width: 112,
    height: 26,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  commentAvatar: {
    width: 42,
    height: 42,
    borderRadius: 9999,
  },
  commentBody: {
    flex: 1,
    gap: spacing.sm,
    paddingTop: 2,
  },
  commentAuthor: {
    width: 140,
    height: 22,
  },
  commentText: {
    width: '78%',
    height: 20,
  },
  composerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  composerInput: {
    flex: 1,
    height: 44,
  },
  composerButton: {
    width: 44,
    height: 44,
    borderRadius: 9999,
  },
});
