import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/shared/theme/tokens';
import { UiAvatar } from '@/shared/ui/kit/UiAvatar';
import { UiCard } from '@/shared/ui/kit/UiCard';
import { UiErrorIcon } from '@/shared/ui/kit/UiErrorIcon';
import { UiPrimaryButton } from '@/shared/ui/kit/UiPrimaryButton';

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
    <View style={styles.authorRow}>
      <UiAvatar imageUri={avatarUrl} displayName={authorName} size={40} />
      <Text style={styles.authorName}>{authorName}</Text>
    </View>

    <View style={styles.centerContent}>
      <UiErrorIcon style={styles.sticker} />
      <Text style={styles.message}>Не удалось загрузить публикацию</Text>
    </View>

    <UiPrimaryButton
      size="sm"
      label="Повторить"
      onPress={onRetry}
      testID="post-error-retry-button"
    />
  </UiCard>
);

const styles = StyleSheet.create({
  card: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  authorName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  sticker: {
    width: 112,
    height: 112,
  },
  message: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
