import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius } from '@/shared/theme/tokens';

type UiCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const UiCard = ({ children, style }: UiCardProps) => (
  <View style={[styles.root, style]}>{children}</View>
);

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
});
