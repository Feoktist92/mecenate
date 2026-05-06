import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const LIKE_PULSE_UP = 1.12;

type UsePostLikeFeedbackParams = {
  toggleLike: () => boolean;
};

export const usePostLikeFeedback = ({
  toggleLike,
}: UsePostLikeFeedbackParams) => {
  const likeScale = useSharedValue(1);

  const likeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const handleLikePress = React.useCallback(() => {
    if (!toggleLike()) {
      return;
    }

    likeScale.value = withSequence(
      withTiming(LIKE_PULSE_UP, { duration: 130 }),
      withTiming(1, { duration: 180 })
    );

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
      () => undefined
    );
  }, [likeScale, toggleLike]);

  return {
    handleLikePress,
    likeAnimatedStyle,
  };
};
