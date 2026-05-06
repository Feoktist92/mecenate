import type { QueryClient } from '@tanstack/react-query';

import { FEED_QUERY_KEY } from '@/features/feed/model/query/useFeedInfiniteQuery';

import { postDetailKeys } from '../query/queryKeys';

export const invalidatePostCounters = (
  queryClient: QueryClient,
  postId: string
): void => {
  void queryClient.invalidateQueries({
    queryKey: postDetailKeys.detail(postId),
  });
  void queryClient.invalidateQueries({ queryKey: [FEED_QUERY_KEY] });
};
