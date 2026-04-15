import React from 'react';
import { Pressable, PressableProps, StyleSheet, Text } from 'react-native';

import { colors, radius, typography } from '@/shared/theme/tokens';

type UiItemTabProps = Omit<PressableProps, 'style'> & {
  label: string;
  active?: boolean;
  disabled?: boolean;
  compact?: boolean;
};

export const UiItemTab = ({
  label,
  active = false,
  disabled = false,
  compact = false,
  ...props
}: UiItemTabProps) => (
  <Pressable
    disabled={disabled}
    style={[
      styles.base,
      compact ? styles.compact : styles.regular,
      active ? styles.active : styles.inactive,
      disabled && styles.disabled,
    ]}
    {...props}
  >
    <Text
      style={[
        styles.label,
        active ? styles.labelActive : styles.labelInactive,
        disabled && styles.labelDisabled,
      ]}
    >
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: 16,
  },
  regular: {
    height: 30,
  },
  compact: {
    height: 26,
  },
  active: {
    backgroundColor: colors.accent,
  },
  inactive: {
    backgroundColor: colors.actionSurface,
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    ...typography.badge,
  },
  labelActive: {
    color: colors.paidText,
  },
  labelInactive: {
    color: colors.textSecondary,
  },
  labelDisabled: {
    color: colors.textMuted,
  },
});
