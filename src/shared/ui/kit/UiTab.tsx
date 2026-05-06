import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { colors, radius, spacing } from '@/shared/theme/tokens';
import { UiItemTab } from '@/shared/ui/kit/UiItemTab';

type UiTabItem = {
  id: string;
  label: string;
  disabled?: boolean;
};

type UiTabProps = {
  items: readonly UiTabItem[];
  value: string;
  onChange?: (id: string) => void;
};

export const UiTab = ({ items, value, onChange }: UiTabProps) => {
  const { width } = useWindowDimensions();
  const isNarrowScreen = width <= 360;

  return (
    <View style={styles.root}>
      {React.Children.toArray(
        items.map((item, index) => (
          <UiItemTab
            key={item.id}
            label={item.label}
            active={item.id === value}
            disabled={item.disabled}
            compact={isNarrowScreen}
            onPress={() => onChange?.(item.id)}
            style={[styles.item, index < items.length - 1 && styles.itemGap]}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.cardBackground,
    padding: 2,
  },
  item: {
    flex: 1,
  },
  itemGap: {
    marginRight: spacing.xs,
  },
});
