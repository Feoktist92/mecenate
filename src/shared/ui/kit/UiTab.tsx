import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/shared/theme/tokens';
import { UiItemTab } from '@/shared/ui/kit/UiItemTab';

type UiTabItem = {
  key: string;
  label: string;
  disabled?: boolean;
};

type UiTabProps = {
  items: UiTabItem[];
  value: string;
  onChange?: (key: string) => void;
};

export const UiTab = ({ items, value, onChange }: UiTabProps) => (
  <View style={styles.root}>
    {items.map((item) => (
      <View key={item.key} style={styles.itemWrap}>
        <UiItemTab
          label={item.label}
          active={item.key === value}
          disabled={item.disabled}
          onPress={() => onChange?.(item.key)}
        />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.actionSurface,
    padding: 2,
    gap: spacing.xs,
  },
  itemWrap: {
    flex: 1,
  },
});
