import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors, spacing, typography } from '@/shared/theme/tokens';
import { UiAvatar } from '@/shared/ui/kit/UiAvatar';

type PostHeaderProps = {
  authorName: string;
  avatarUrl: string | null;
  style?: StyleProp<ViewStyle>;
};

export const PostHeader = ({
  authorName,
  avatarUrl,
  style,
}: PostHeaderProps) => (
  <View style={[styles.row, style]}>
    <UiAvatar imageUri={avatarUrl} displayName={authorName} />
    <Text style={styles.authorName}>{authorName}</Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  authorName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
});
