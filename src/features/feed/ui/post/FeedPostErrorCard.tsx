import React from 'react';
import { StyleSheet } from 'react-native';

import { PostHeader } from '@/entities/post/ui/PostHeader';
import { spacing } from '@/shared/theme/tokens';
import { UiCard } from '@/shared/ui/kit/UiCard';
import { UiStateContent } from '@/shared/ui/kit/UiStateContent';

type FeedPostErrorCardProps = {
  authorName: string;
  avatarUrl: string | null;
  onRetry: () => void;
};

export const FeedPostErrorCard = ({
  authorName,
  avatarUrl,
  onRetry,
}: FeedPostErrorCardProps) => (
  <UiCard style={styles.card}>
    <PostHeader
      authorName={authorName}
      avatarUrl={avatarUrl}
      style={styles.authorRow}
    />
    <UiStateContent
      title='Не удалось загрузить публикацию'
      titleVariant='title'
      showErrorIcon
      buttonTestID='post-error-retry-button'
      onRetry={onRetry}
    />
  </UiCard>
);

const styles = StyleSheet.create({
  card: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  authorRow: {
    paddingHorizontal: spacing.lg,
  },
});
