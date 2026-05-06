import { useRouter } from 'expo-router';
import { useLocalObservable } from 'mobx-react-lite';
import React from 'react';

import { PostTier } from '@/entities/post/types';
import { createFeedUiStore } from '@/features/feed/model/store/feedUiStore';
import {
  FEED_FILTER_ALL,
  FeedFilter,
  useFeedInfiniteQuery,
} from '@/features/feed/model/query/useFeedInfiniteQuery';

const toTierFilter = (value: FeedFilter): PostTier | undefined =>
  value === FEED_FILTER_ALL ? undefined : value;

type FeedScreenState = 'loading' | 'error' | 'empty' | 'content';

const getFeedScreenState = ({
  hasPosts,
  isPending,
  isFetching,
  isError,
}: {
  hasPosts: boolean;
  isPending: boolean;
  isFetching: boolean;
  isError: boolean;
}): FeedScreenState => {
  if (!hasPosts && (isPending || isFetching)) {
    return 'loading';
  }

  if (!hasPosts && isError) {
    return 'error';
  }

  if (!hasPosts && !isError && !isPending && !isFetching) {
    return 'empty';
  }

  return 'content';
};

export const useFeedScreen = () => {
  const router = useRouter();
  const store = useLocalObservable(createFeedUiStore);
  const isMountedRef = React.useRef(true);
  const [isUserRefreshing, setIsUserRefreshing] = React.useState(false);
  const [activeFilter, setActiveFilter] =
    React.useState<FeedFilter>(FEED_FILTER_ALL);
  const selectedTier = toTierFilter(activeFilter);
  const {
    posts,
    isPending,
    isFetching,
    isError,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    fetchNextPage,
    refetch,
  } = useFeedInfiniteQuery(selectedTier);

  const hasPosts = posts.length > 0;
  const canLoadNextPage =
    Boolean(hasNextPage) && !isFetching && !isRefetching && !isFetchingNextPage;

  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleRefresh = React.useCallback(() => {
    setIsUserRefreshing(true);

    void Promise.resolve(refetch()).finally(() => {
      if (isMountedRef.current) {
        setIsUserRefreshing(false);
      }
    });
  }, [refetch]);

  const handleEndReached = React.useCallback(() => {
    if (!canLoadNextPage) {
      return;
    }

    void fetchNextPage();
  }, [canLoadNextPage, fetchNextPage]);

  const handlePostPress = React.useCallback(
    (postId: string) => {
      router.push(`/post/${postId}`);
    },
    [router]
  );

  return {
    activeFilter,
    posts,
    screenState: getFeedScreenState({
      hasPosts,
      isPending,
      isFetching,
      isError,
    }),
    store,
    isFetchingNextPage,
    isRefreshing: isUserRefreshing,
    setActiveFilter,
    handleEndReached,
    handlePostPress,
    handleRefresh,
  };
};
