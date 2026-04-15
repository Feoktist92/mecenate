import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, PressableProps, StyleSheet } from 'react-native';

import { colors, radius } from '@/shared/theme/tokens';

type UiIconButtonProps = Omit<PressableProps, 'style'> & {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  disabled?: boolean;
};

export const UiIconButton = ({
  iconName,
  disabled = false,
  ...props
}: UiIconButtonProps) => (
  <Pressable
    disabled={disabled}
    style={[styles.root, disabled && styles.disabled]}
    {...props}
  >
    <Ionicons
      name={iconName}
      size={18}
      color={disabled ? colors.textMuted : colors.accent}
    />
  </Pressable>
);

const styles = StyleSheet.create({
  root: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  disabled: {
    opacity: 0.6,
  },
});
