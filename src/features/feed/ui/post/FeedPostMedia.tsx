import React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';

import { colors } from '@/shared/theme/tokens';

import { PaidOverlay } from './PaidOverlay';

type FeedPostMediaProps = {
  variant: 'free' | 'paid';
  coverUrl: string;
  onError: () => void;
};

export const FeedPostMedia = ({ variant, coverUrl, onError }: FeedPostMediaProps) => {
  const [coverLoaded, setCoverLoaded] = React.useState(false);

  React.useEffect(() => {
    setCoverLoaded(false);
  }, [coverUrl, variant]);

  const isPaid = variant === 'paid';

  return (
    <View style={styles.mediaWrapper}>
      <Image
        source={{ uri: coverUrl }}
        style={styles.cover}
        testID="post-cover"
        blurRadius={isPaid && Platform.OS === 'android' ? 40 : 0}
        onLoad={() => setCoverLoaded(true)}
        onError={onError}
      />
      {isPaid ? <PaidOverlay enableBlur={coverLoaded && Platform.OS === 'ios'} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mediaWrapper: {
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
    backgroundColor: colors.borderSubtle,
    position: 'relative',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
});
