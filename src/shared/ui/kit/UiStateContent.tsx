import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { colors, spacing, typography } from '@/shared/theme/tokens';
import { UiButton } from '@/shared/ui/kit/UiButton';
import { UiErrorIcon } from '@/shared/ui/kit/UiErrorIcon';

type UiStateContentTitleVariant = 'bodyBold' | 'title';

type UiStateContentProps = {
  title?: string;
  isLoading?: boolean;
  showErrorIcon?: boolean;
  retryLabel?: string;
  titleVariant?: UiStateContentTitleVariant;
  buttonTestID?: string;
  style?: StyleProp<ViewStyle>;
  onRetry?: () => void;
};

export const UiStateContent = ({
  title,
  isLoading = false,
  showErrorIcon = false,
  retryLabel = 'Повторить',
  titleVariant = 'bodyBold',
  buttonTestID,
  style,
  onRetry,
}: UiStateContentProps) => (
  <View style={[styles.root, style]}>
    <View style={styles.messageGroup}>
      {isLoading ? (
        <ActivityIndicator size='small' color={colors.accent} />
      ) : null}
      {showErrorIcon ? <UiErrorIcon style={styles.icon} /> : null}
      {title ? (
        <Text
          style={[
            styles.title,
            titleVariant === 'title' ? styles.titleLarge : styles.titleDefault,
          ]}
        >
          {title}
        </Text>
      ) : null}
    </View>
    {onRetry ? (
      <UiButton
        label={retryLabel}
        size='sm'
        testID={buttonTestID}
        onPress={onRetry}
      />
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  messageGroup: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  icon: {
    width: 112,
    height: 112,
  },
  title: {
    color: colors.textPrimary,
    textAlign: 'center',
  },
  titleDefault: {
    ...typography.bodyBold,
  },
  titleLarge: {
    ...typography.title,
  },
});
