import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius } from '@/shared/theme/tokens';

type UiSkeletonBlockProps = {
  style?: StyleProp<ViewStyle>;
};

export const UiSkeletonBlock = ({ style }: UiSkeletonBlockProps) => (
  <View style={[styles.root, style]} />
);

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.skeleton,
    borderRadius: radius.pill,
  },
});
