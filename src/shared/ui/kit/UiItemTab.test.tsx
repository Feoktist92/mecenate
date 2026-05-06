import { render } from '@testing-library/react-native';
import React from 'react';

import { colors } from '@/shared/theme/tokens';

import { UiItemTab } from './UiItemTab';

describe('UiItemTab', () => {
  it('uses bold text only for the active tab', () => {
    const { getByText } = render(
      <>
        <UiItemTab label='Все' active />
        <UiItemTab label='Бесплатные' />
      </>
    );

    expect(getByText('Все')).toHaveStyle({
      color: colors.paidText,
      fontFamily: 'Manrope_700Bold',
      fontWeight: '700',
    });
    expect(getByText('Бесплатные')).toHaveStyle({
      color: colors.textSecondary,
      fontFamily: 'Manrope_500Medium',
      fontWeight: '500',
    });
  });
});
