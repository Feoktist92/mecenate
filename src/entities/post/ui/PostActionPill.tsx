import React from 'react';

import { UiActionPill } from '@/shared/ui/kit/UiActionPill';

type PostActionPillProps = {
  type: 'like' | 'comment';
  count: number;
  active?: boolean;
};

export const PostActionPill = ({
  type,
  count,
  active = false,
}: PostActionPillProps) => <UiActionPill type={type} count={count} active={active} />;
