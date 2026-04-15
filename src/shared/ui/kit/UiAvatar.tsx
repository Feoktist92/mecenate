import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { getAvatarInitial } from '@/shared/lib/avatar';
import { colors, radius, typography } from '@/shared/theme/tokens';

type UiAvatarProps = {
  imageUri: string | null;
  displayName: string;
  size?: number;
  testIDPrefix?: string;
};

export const UiAvatar = ({
  imageUri,
  displayName,
  size = 40,
  testIDPrefix = 'avatar',
}: UiAvatarProps) => {
  const [imageFailed, setImageFailed] = React.useState(false);

  React.useEffect(() => {
    setImageFailed(false);
  }, [imageUri]);

  const hasImage = Boolean(imageUri) && !imageFailed;
  const avatarSizeStyle = {
    width: size,
    height: size,
    borderRadius: radius.pill,
  };

  if (hasImage) {
    return (
      <Image
        source={{ uri: imageUri ?? '' }}
        style={[styles.avatarBase, avatarSizeStyle]}
        onError={() => setImageFailed(true)}
        testID={`${testIDPrefix}-image`}
      />
    );
  }

  return (
    <View
      style={[styles.avatarBase, avatarSizeStyle, styles.avatarFallback]}
      testID={`${testIDPrefix}-fallback`}
    >
      <Text style={styles.avatarFallbackText}>{getAvatarInitial(displayName)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarBase: {
    backgroundColor: colors.borderSubtle,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
});
