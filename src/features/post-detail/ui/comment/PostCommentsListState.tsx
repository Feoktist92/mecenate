import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/shared/theme/tokens';
import { UiButton } from '@/shared/ui/kit/UiButton';

type PostCommentsFooterProps = {
  isFetchingNextPage: boolean;
  isError: boolean;
  onRetry: () => void;
};

export const PostCommentsFooter = ({
  isFetchingNextPage,
  isError,
  onRetry,
}: PostCommentsFooterProps) => (
  <View style={styles.footer}>
    {isFetchingNextPage ? (
      <ActivityIndicator size='small' color={colors.accent} />
    ) : null}
    {isError ? (
      <UiButton
        label='Повторить комментарии'
        size='sm'
        style={styles.retryButton}
        onPress={onRetry}
      />
    ) : null}
  </View>
);

type PostCommentsEmptyStateProps = {
  isPending: boolean;
};

export const PostCommentsEmptyState = ({
  isPending,
}: PostCommentsEmptyStateProps) => {
  if (isPending) {
    return (
      <View style={styles.footer}>
        <ActivityIndicator size='small' color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>Комментариев пока нет</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButton: {
    marginTop: spacing.sm,
    alignSelf: 'center',
  },
  empty: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
