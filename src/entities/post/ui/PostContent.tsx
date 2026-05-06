import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  getCollapsedPreview,
  PREVIEW_MAX_LENGTH,
} from '@/entities/post/lib/postPreview';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type PostContentProps = {
  isLocked?: boolean;
  title: string;
  text: string;
  mode: PostContentMode;
  bodyTone?: PostContentBodyTone;
};

type PostContentMode =
  | {
      type: 'preview';
      isExpanded: boolean;
      onToggleExpand: () => void;
    }
  | {
      type: 'full';
    };

type PostContentBodyTone = 'primary' | 'secondary';

export const PostContent = ({
  isLocked = false,
  title,
  text,
  mode,
  bodyTone = 'primary',
}: PostContentProps) => {
  if (isLocked) {
    return (
      <View style={styles.paidSkeletonWrap}>
        <View style={styles.paidSkeletonTitle} />
        <View style={styles.paidSkeletonText} />
      </View>
    );
  }

  const isPreview = mode.type === 'preview';
  const isLongPreview = isPreview && text.length > PREVIEW_MAX_LENGTH;
  const displayText =
    isPreview && !mode.isExpanded ? getCollapsedPreview(text) : text;

  return (
    <>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.previewBlock}>
        <Text
          style={[
            styles.preview,
            bodyTone === 'secondary'
              ? styles.previewSecondary
              : styles.previewPrimary,
          ]}
        >
          {displayText}
        </Text>
        {isLongPreview ? (
          <Pressable
            onPress={mode.onToggleExpand}
            style={styles.showMoreButton}
          >
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
  },
  previewPrimary: {
    color: colors.textPrimary,
  },
  previewSecondary: {
    color: colors.textSecondary,
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
