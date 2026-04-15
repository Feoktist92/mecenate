import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/shared/theme/tokens';

type UiActionPillProps = {
  type: 'like' | 'comment';
  count: number;
  active?: boolean;
};

export const UiActionPill = ({ type, count, active = false }: UiActionPillProps) => {
  const isLike = type === 'like';
  const iconName = isLike ? (active ? 'heart' : 'heart-outline') : 'chatbubble-outline';
  const iconColor = active ? colors.likeActiveText : colors.textSecondary;
  const backgroundColor = active ? colors.likeActiveBackground : colors.actionSurface;

  return (
    <View style={[styles.root, { backgroundColor }]}>
      <Ionicons size={15} name={iconName} color={iconColor} />
      <Text style={[styles.count, { color: iconColor }]}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    paddingLeft: 6,
  },
  count: {
    ...typography.badge,
  },
});
