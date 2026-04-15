import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/shared/theme/tokens';
import { UiAvatar } from '@/shared/ui/kit/UiAvatar';

type UiCommentProps = {
  authorName: string;
  text: string;
  avatarUrl?: string | null;
  likesCount?: number;
};

export const UiComment = ({
  authorName,
  text,
  avatarUrl = null,
  likesCount = 0,
}: UiCommentProps) => (
  <View style={styles.root}>
    <View style={styles.left}>
      <UiAvatar imageUri={avatarUrl} displayName={authorName} size={28} />
      <View>
        <Text style={styles.author}>{authorName}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
    <View style={styles.likes}>
      <Ionicons name="heart-outline" size={14} color={colors.textSecondary} />
      <Text style={styles.likesText}>{likesCount}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  author: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  text: {
    ...typography.body,
    color: colors.textSecondary,
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likesText: {
    ...typography.badge,
    color: colors.textSecondary,
  },
});
