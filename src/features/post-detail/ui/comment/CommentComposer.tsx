import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/shared/theme/tokens';
import { UiIconButton } from '@/shared/ui/kit/UiIconButton';
import { UiInputText } from '@/shared/ui/kit/UiInputText';

type CommentComposerProps = {
  value: string;
  editable: boolean;
  sendDisabled: boolean;
  bottomOffset: number;
  bottomPadding: number;
  onChangeText: (value: string) => void;
  onSend: () => void;
};

export const CommentComposer = ({
  value,
  editable,
  sendDisabled,
  bottomOffset,
  bottomPadding,
  onChangeText,
  onSend,
}: CommentComposerProps) => (
  <View
    style={[
      styles.root,
      {
        bottom: bottomOffset,
        paddingBottom: bottomPadding,
      },
    ]}
  >
    <View style={styles.input}>
      <UiInputText
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        variant='outline'
        placeholder='Ваш комментарий'
        returnKeyType='send'
        onSubmitEditing={onSend}
      />
    </View>
    <UiIconButton iconName='send' disabled={sendDisabled} onPress={onSend} />
  </View>
);

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    backgroundColor: colors.cardBackground,
  },
  input: {
    flex: 1,
  },
});
