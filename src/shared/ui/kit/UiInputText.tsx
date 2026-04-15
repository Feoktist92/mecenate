import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { colors, radius, typography } from '@/shared/theme/tokens';

type UiInputTextProps = TextInputProps & {
  variant?: 'filled' | 'outline';
};

export const UiInputText = ({
  variant = 'filled',
  editable = true,
  style,
  ...props
}: UiInputTextProps) => (
  <View
    style={[
      styles.root,
      variant === 'filled' ? styles.filled : styles.outline,
      !editable && styles.disabled,
    ]}
  >
    <TextInput
      editable={editable}
      style={[styles.input, style]}
      placeholderTextColor={colors.textMuted}
      {...props}
    />
  </View>
);

const styles = StyleSheet.create({
  root: {
    borderRadius: radius.pill,
    height: 38,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  filled: {
    backgroundColor: colors.inputSurface,
    borderWidth: 1,
    borderColor: colors.inputSurface,
  },
  outline: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  disabled: {
    opacity: 0.5,
  },
  input: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
});
