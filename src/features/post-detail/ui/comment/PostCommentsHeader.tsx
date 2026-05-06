import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { spacing, typography, colors } from '@/shared/theme/tokens';

const formatCommentsTitle = (count: number): string => {
  const absoluteCount = Math.abs(count);
  const mod10 = absoluteCount % 10;
  const mod100 = absoluteCount % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} комментарий`;
  }

  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
    return `${count} комментария`;
  }

  return `${count} комментариев`;
};

type PostCommentsHeaderProps = {
  commentsCount: number;
};

export const PostCommentsHeader = ({
  commentsCount,
}: PostCommentsHeaderProps) => (
  <View style={styles.root}>
    <Text style={styles.title}>{formatCommentsTitle(commentsCount)}</Text>
    <Text style={styles.sortLabel}>Сначала новые</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  sortLabel: {
    ...typography.badge,
    color: colors.accent,
  },
});
