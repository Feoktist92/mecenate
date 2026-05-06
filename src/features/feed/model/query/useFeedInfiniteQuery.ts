import { useInfiniteQuery } from '@tanstack/react-query';

import { PostDto, PostsResponseDto, PostTier } from '@/entities/post/types';
import { getPosts } from '@/features/feed/api/getPosts';

export type FeedPage = PostsResponseDto;

export const FEED_QUERY_KEY = 'feed-posts';
export const FEED_FILTER_ALL = 'all';

export type FeedFilter = PostTier | typeof FEED_FILTER_ALL;

export const buildFeedQueryKey = (tier: PostTier | undefined) =>
  [FEED_QUERY_KEY, tier ?? FEED_FILTER_ALL] as const;

export const getNextFeedPageParam = (
  lastPage: FeedPage
): string | undefined => {
  if (!lastPage.data.hasMore || !lastPage.data.nextCursor) {
    return undefined;
  }

  return lastPage.data.nextCursor;
};

export const flattenFeedPages = (pages: FeedPage[]): PostDto[] =>
  pages.flatMap((page) => page.data.posts);

export const useFeedInfiniteQuery = (tier?: PostTier) => {
  const query = useInfiniteQuery({
    queryKey: buildFeedQueryKey(tier),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      getPosts({ limit: 10, cursor: pageParam, tier }),
    getNextPageParam: getNextFeedPageParam,
  });

  const posts = query.data ? flattenFeedPages(query.data.pages) : [];

  return {
    ...query,
    posts,
  };
};
