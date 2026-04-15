import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import { colors, radius, typography } from '@/shared/theme/tokens';

type UiButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  loading?: boolean;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
};

export const UiButton = ({
  label,
  loading = false,
  disabled = false,
  size = 'md',
  style,
  ...props
}: UiButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      style={[
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors.paidText} />
      ) : (
        <Text style={[styles.label, isDisabled && styles.labelDisabled]}>{label}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  sm: {
    height: 38,
  },
  md: {
    height: 42,
  },
  disabled: {
    backgroundColor: '#B8A9EE',
  },
  label: {
    ...typography.bodyBold,
    color: colors.paidText,
  },
  labelDisabled: {
    color: '#F2EDFF',
  },
});
