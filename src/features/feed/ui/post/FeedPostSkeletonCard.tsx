import React from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/shared/theme/tokens';
import { UiCard } from '@/shared/ui/kit/UiCard';
import { UiSkeletonBlock } from '@/shared/ui/kit/UiSkeletonBlock';

export const FeedPostSkeletonCard = () => (
  <UiCard style={styles.card}>
    <View style={styles.header}>
      <UiSkeletonBlock style={styles.avatar} />
      <UiSkeletonBlock style={styles.authorName} />
    </View>

    <UiSkeletonBlock style={styles.cover} />

    <View style={styles.body}>
      <UiSkeletonBlock style={styles.title} />
      <UiSkeletonBlock style={styles.previewLine} />
      <UiSkeletonBlock style={styles.previewLineShort} />
    </View>

    <View style={styles.actions}>
      <UiSkeletonBlock style={styles.actionPill} />
      <UiSkeletonBlock style={styles.actionPill} />
    </View>
  </UiCard>
);

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 9999,
  },
  authorName: {
    width: 118,
    height: 20,
  },
  cover: {
    alignSelf: 'stretch',
    aspectRatio: 1,
    borderRadius: 0,
  },
  body: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  title: {
    width: 164,
    height: 26,
  },
  previewLine: {
    alignSelf: 'stretch',
    height: 20,
  },
  previewLineShort: {
    width: '70%',
    height: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  actionPill: {
    width: 56,
    height: 30,
  },
});
