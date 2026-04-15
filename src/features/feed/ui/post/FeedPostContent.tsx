import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  getCollapsedPreview,
  PREVIEW_MAX_LENGTH,
} from '@/entities/post/lib/postPreview';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type FeedPostContentProps = {
  variant: 'free' | 'paid';
  title: string;
  previewText: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
};

export const FeedPostContent = ({
  variant,
  title,
  previewText,
  isExpanded,
  onToggleExpand,
}: FeedPostContentProps) => {
  const isPaid = variant === 'paid';

  if (isPaid) {
    return (
      <View style={styles.paidSkeletonWrap}>
        <View style={styles.paidSkeletonTitle} />
        <View style={styles.paidSkeletonText} />
      </View>
    );
  }

  const isLongPreview = previewText.length > PREVIEW_MAX_LENGTH;
  const displayPreview = isExpanded ? previewText : getCollapsedPreview(previewText);

  return (
    <>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.previewBlock}>
        <Text style={styles.preview}>{displayPreview}</Text>
        {isLongPreview ? (
          <Pressable onPress={onToggleExpand} style={styles.showMoreButton}>
            <Text style={styles.showMore}>Показать еще</Text>
          </Pressable>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.title,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
  },
  previewBlock: {
    gap: spacing.sm,
    minHeight: 40,
    position: 'relative',
    paddingHorizontal: spacing.lg,
  },
  preview: {
    ...typography.body,
    color: colors.textPrimary,
  },
  showMoreButton: {
    alignSelf: 'flex-start',
  },
  showMore: {
    ...typography.body,
    color: colors.accent,
  },
  paidSkeletonWrap: {
    alignSelf: 'stretch',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  paidSkeletonTitle: {
    width: 164,
    height: 26,
    borderRadius: 22,
    backgroundColor: colors.skeleton,
  },
  paidSkeletonText: {
    alignSelf: 'stretch',
    height: 40,
    borderRadius: 22,
    backgroundColor: colors.skeleton,
  },
});
