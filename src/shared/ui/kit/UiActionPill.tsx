import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/shared/theme/tokens';

type UiActionPillProps = {
  type: 'like' | 'comment';
  count: number;
  active?: boolean;
};

export const UiActionPill = ({
  type,
  count,
  active = false,
}: UiActionPillProps) => {
  const isLike = type === 'like';
  const iconName = isLike
    ? active
      ? 'heart'
      : 'heart-outline'
    : 'chatbubble-outline';
  const iconColor = active ? colors.likeActiveText : colors.textSecondary;
  const backgroundColor = active
    ? colors.likeActiveBackground
    : colors.actionSurface;

  return (
    <View style={[styles.root, { backgroundColor }]}>
      <View style={styles.iconSlot}>
        <Ionicons size={16} name={iconName} color={iconColor} />
      </View>
      <Text style={[styles.count, { color: iconColor }]}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    minWidth: 63,
    minHeight: 36,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  iconSlot: {
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    ...typography.badgeBold,
  },
});
