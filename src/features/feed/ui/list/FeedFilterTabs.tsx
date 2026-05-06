import React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  FEED_FILTER_ALL,
  type FeedFilter,
} from '@/features/feed/model/query/useFeedInfiniteQuery';
import { spacing } from '@/shared/theme/tokens';
import { UiTab } from '@/shared/ui/kit/UiTab';

const FEED_TAB_ITEMS = [
  { id: FEED_FILTER_ALL, label: 'Все' },
  { id: 'free', label: 'Бесплатные' },
  { id: 'paid', label: 'Платные' },
] as const;

type FeedFilterTabsProps = {
  value: FeedFilter;
  onChange: (value: FeedFilter) => void;
};

export const FeedFilterTabs = ({ value, onChange }: FeedFilterTabsProps) => (
  <View style={styles.root}>
    <UiTab
      items={FEED_TAB_ITEMS}
      value={value}
      onChange={(nextValue) => onChange(nextValue as FeedFilter)}
    />
  </View>
);

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
});
