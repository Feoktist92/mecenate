import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/shared/theme/tokens';
import { UiStateContent } from '@/shared/ui/kit/UiStateContent';

type UiStateViewProps = React.ComponentProps<typeof UiStateContent> & {
  variant?: 'plain' | 'panel';
};

export const UiStateView = ({
  variant = 'plain',
  ...contentProps
}: UiStateViewProps) => {
  if (variant === 'panel') {
    return (
      <View style={styles.root}>
        <View style={styles.panel}>
          <UiStateContent {...contentProps} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.plainRoot}>
      <UiStateContent {...contentProps} />
    </View>
  );
};

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
  },
  plainRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.screenBackground,
    paddingHorizontal: spacing.lg,
  },
});
