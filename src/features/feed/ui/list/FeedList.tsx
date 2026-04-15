import { useLocalObservable } from "mobx-react-lite";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

import { PostDto } from "@/entities/post/types";
import { createFeedUiStore } from "@/features/feed/model/feedUiStore";
import { useFeedInfiniteQuery } from "@/features/feed/model/useFeedInfiniteQuery";
import { FeedPostCard } from "@/features/feed/ui/post/FeedPostCard";
import { colors, spacing } from "@/shared/theme/tokens";

import { FeedErrorState } from "./FeedErrorState";
import { FeedPostListSkeleton } from "./FeedPostListSkeleton";

const FeedPostListSeparator = () => <View style={styles.separator} />;
const extractPostKey = (item: PostDto) => item.id;

type FeedScreenState = "loading" | "error" | "empty" | "content";

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
    return "loading";
  }

  if (!hasPosts && isError) {
    return "error";
  }

  if (!hasPosts && !isError && !isPending && !isFetching) {
    return "empty";
  }

  return "content";
};

export const FeedList = () => {
  const store = useLocalObservable(createFeedUiStore);
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
  } = useFeedInfiniteQuery();

  const hasPosts = posts.length > 0;
  const canLoadNextPage =
    Boolean(hasNextPage) && !isFetching && !isRefetching && !isFetchingNextPage;
  const isRefreshing = isRefetching && !isFetchingNextPage;

  const handleRefresh = React.useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleEndReached = React.useCallback(() => {
    if (!canLoadNextPage) {
      return;
    }

    void fetchNextPage();
  }, [canLoadNextPage, fetchNextPage]);

  const renderPostItem = React.useCallback(
    ({ item }: { item: PostDto }) => <FeedPostCard post={item} store={store} />,
    [store]
  );

  const screenState = getFeedScreenState({
    hasPosts,
    isPending,
    isFetching,
    isError,
  });

  if (screenState === "loading") {
    return <FeedPostListSkeleton />;
  }

  if (screenState === "error") {
    return <FeedErrorState onRetry={handleRefresh} />;
  }

  if (screenState === "empty") {
    return (
      <FeedErrorState
        onRetry={handleRefresh}
        message="По вашему запросу ничего не найдено"
        buttonLabel="Обновить"
      />
    );
  }

  return (
    <FlatList
      testID="feed-post-list"
      data={posts}
      keyExtractor={extractPostKey}
      renderItem={renderPostItem}
      contentContainerStyle={styles.content}
      style={styles.list}
      ItemSeparatorComponent={FeedPostListSeparator}
      onEndReachedThreshold={0.4}
      onEndReached={handleEndReached}
      removeClippedSubviews
      initialNumToRender={6}
      maxToRenderPerBatch={8}
      windowSize={7}
      updateCellsBatchingPeriod={50}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={colors.accent}
        />
      }
      ListFooterComponent={
        <View style={styles.footer}>
          {isFetchingNextPage ? (
            <ActivityIndicator color={colors.accent} />
          ) : null}
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  content: {
    paddingTop: spacing.sm,
  },
  separator: {
    height: spacing.sm,
  },
  footer: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
