import React from 'react';
import { Pressable, PressableProps, StyleSheet, Text } from 'react-native';

import { colors, typography } from '@/shared/theme/tokens';

type UiButtonLinkProps = Omit<PressableProps, 'style'> & {
  label: string;
  disabled?: boolean;
};

export const UiButtonLink = ({
  label,
  disabled = false,
  ...props
}: UiButtonLinkProps) => (
  <Pressable disabled={disabled} style={styles.root} {...props}>
    <Text style={[styles.label, disabled ? styles.labelDisabled : styles.labelActive]}>
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  root: {
    minHeight: 28,
    justifyContent: 'center',
  },
  label: {
    ...typography.bodyBold,
  },
  labelActive: {
    color: colors.accent,
  },
  labelDisabled: {
    color: colors.textMuted,
  },
});
