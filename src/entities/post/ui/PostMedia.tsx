import React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';

import { colors } from '@/shared/theme/tokens';

import { PostPaidOverlay } from './PostPaidOverlay';

type PostMediaProps = {
  coverUrl: string;
  isLocked?: boolean;
  onError?: () => void;
};

export const PostMedia = ({
  coverUrl,
  isLocked = false,
  onError,
}: PostMediaProps) => {
  const [coverLoaded, setCoverLoaded] = React.useState(false);

  React.useEffect(() => {
    setCoverLoaded(false);
  }, [coverUrl, isLocked]);

  return (
    <View style={styles.mediaWrapper}>
      <Image
        source={{ uri: coverUrl }}
        style={styles.cover}
        testID='post-cover'
        blurRadius={isLocked && Platform.OS === 'android' ? 40 : 0}
        onLoad={() => setCoverLoaded(true)}
        onError={onError}
      />
      {isLocked ? (
        <PostPaidOverlay enableBlur={coverLoaded && Platform.OS === 'ios'} />
      ) : null}
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
