import React from 'react';

import { UiActionPill } from '@/shared/ui/kit/UiActionPill';

type UiButtonActionProps = {
  type: 'like' | 'comment';
  count: number;
  active?: boolean;
};

export const UiButtonAction = ({
  type,
  count,
  active = false,
}: UiButtonActionProps) => <UiActionPill type={type} count={count} active={active} />;
