import React from "react";
import { useInfiniteQuery } from '@tanstack/react-query';

import { PostDto, PostsResponseDto } from '@/entities/post/types';
import { getPosts } from '@/features/feed/api/getPosts';

export type FeedPage = PostsResponseDto;

export const FEED_QUERY_KEY = ['feed-posts'] as const;

export const getNextFeedPageParam = (lastPage: FeedPage): string | undefined => {
  if (!lastPage.data.hasMore || !lastPage.data.nextCursor) {
    return undefined;
  }

  return lastPage.data.nextCursor;
};

export const flattenFeedPages = (pages: FeedPage[]): PostDto[] =>
  pages.flatMap((page) => page.data.posts);

export const useFeedInfiniteQuery = () => {
  const query = useInfiniteQuery({
    queryKey: FEED_QUERY_KEY,
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) => getPosts({ limit: 10, cursor: pageParam }),
    getNextPageParam: getNextFeedPageParam,
  });

  const posts = query.data ? flattenFeedPages(query.data.pages) : [];

  return {
    ...query,
    posts,
  };
};
