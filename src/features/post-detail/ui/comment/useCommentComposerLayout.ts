import React from 'react';
import { Keyboard, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/shared/theme/tokens';

const COMMENT_COMPOSER_BASE_HEIGHT = 56;

export const useCommentComposerLayout = () => {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  React.useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillChangeFrame' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      if (Platform.OS === 'android') {
        const imeTop = event.endCoordinates?.screenY;

        if (typeof imeTop === 'number') {
          setKeyboardHeight(Math.max(windowHeight - imeTop, 0));
          return;
        }
      }

      setKeyboardHeight(Math.max(event.endCoordinates.height, 0));
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [windowHeight]);

  const bottomPadding = Math.max(insets.bottom, spacing.sm);
  const bottomOffset = Math.max(keyboardHeight - insets.bottom, 0);
  const listBottomPadding =
    COMMENT_COMPOSER_BASE_HEIGHT + bottomPadding + spacing.sm;

  return {
    bottomOffset,
    bottomPadding,
    listBottomPadding,
  };
};
