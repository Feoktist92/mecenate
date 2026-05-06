import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import { colors, radius, typography } from '@/shared/theme/tokens';

type UiItemTabProps = Omit<PressableProps, 'style'> & {
  label: string;
  active?: boolean;
  disabled?: boolean;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const UiItemTab = ({
  label,
  active = false,
  disabled = false,
  compact = false,
  style,
  ...props
}: UiItemTabProps) => (
  <Pressable
    disabled={disabled}
    style={[
      styles.base,
      compact ? styles.compact : styles.regular,
      active && styles.active,
      disabled && styles.disabled,
      style,
    ]}
    {...props}
  >
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.84}
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
    paddingHorizontal: 10,
  },
  regular: {
    height: 38,
  },
  compact: {
    height: 30,
    paddingHorizontal: 8,
  },
  active: {
    backgroundColor: colors.accent,
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    textAlign: 'center',
  },
  labelActive: {
    ...typography.bodyBold,
    color: colors.paidText,
  },
  labelInactive: {
    ...typography.body,
    color: colors.textSecondary,
  },
  labelDisabled: {
    color: colors.textMuted,
  },
});
