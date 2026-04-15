import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/shared/theme/tokens';
import { UiErrorIcon } from '@/shared/ui/kit/UiErrorIcon';
import { UiPrimaryButton } from '@/shared/ui/kit/UiPrimaryButton';

type FeedErrorStateProps = {
  onRetry: () => void;
  message?: string;
  buttonLabel?: string;
};

export const FeedErrorState = ({
  onRetry,
  message = 'Не удалось загрузить публикации',
  buttonLabel = 'Повторить',
}: FeedErrorStateProps) => (
  <View style={styles.root}>
    <View style={styles.panel}>
      <View style={styles.centerContent}>
        <UiErrorIcon style={styles.sticker} />
        <Text style={styles.message}>{message}</Text>
      </View>
      <UiPrimaryButton size="sm" label={buttonLabel} onPress={onRetry} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  panel: {
    flex: 1,
    marginTop: spacing.md,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.cardBackground,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    justifyContent: 'center',
    gap: spacing.md,
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
