import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/shared/theme/tokens';
import { UiPrimaryButton } from '@/shared/ui/kit/UiPrimaryButton';

type PaidOverlayProps = {
  enableBlur: boolean;
};

export const PaidOverlay = ({ enableBlur }: PaidOverlayProps) => (
  <View style={styles.root}>
    {enableBlur ? (
      <BlurView
        intensity={40}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
        testID="paid-blur"
      />
    ) : (
      <View style={StyleSheet.absoluteFill} testID="paid-blur" />
    )}
    <View style={styles.dimLayer} />
    <View style={styles.iconShell}>
      <View style={styles.iconCoin}>
        <Text style={styles.iconCoinText}>$</Text>
      </View>
    </View>
    <View style={styles.messageBox}>
      <Text style={styles.messageLine}>Контент скрыт пользователем.</Text>
      <Text style={styles.messageLine}>Доступ откроется после доната</Text>
    </View>
    <UiPrimaryButton label="Отправить донат" style={styles.button} />
  </View>
);

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  dimLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.paidOverlay,
  },
  iconShell: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  iconCoin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paidText,
  },
  iconCoinText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
  },
  messageBox: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  messageLine: {
    ...typography.bodyBold,
    color: colors.paidText,
    textAlign: 'center',
  },
  button: {
    width: 239,
  },
});
