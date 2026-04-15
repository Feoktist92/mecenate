import React from 'react';
import { PressableProps, StyleProp, ViewStyle } from 'react-native';

import { UiButton } from '@/shared/ui/kit/UiButton';

type UiPrimaryButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
};

export const UiPrimaryButton = ({
  label,
  size = 'md',
  style,
  ...props
}: UiPrimaryButtonProps) => <UiButton label={label} size={size} style={style} {...props} />;
