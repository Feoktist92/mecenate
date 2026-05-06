import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  type ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import type { PostDto } from '@/entities/post/types';
import { isFeedPostPressable } from '@/features/feed/model/selectors/feedPostSelectors';
import type { FeedUiStore } from '@/features/feed/model/store/feedUiStore';
import { FeedPostCard } from '@/features/feed/ui/post/FeedPostCard';
import { colors, spacing } from '@/shared/theme/tokens';

const FeedPostListSeparator = () => <View style={styles.separator} />;
const extractPostKey = (item: PostDto) => item.id;

type FeedPostListItemProps = {
  post: PostDto;
  store: FeedUiStore;
  onPostPress: (postId: string) => void;
};

const FeedPostListItem = ({
  post,
  store,
  onPostPress,
}: FeedPostListItemProps) => {
  if (!isFeedPostPressable(post)) {
    return <FeedPostCard post={post} store={store} />;
  }

  return (
    <Pressable onPress={() => onPostPress(post.id)}>
      <FeedPostCard post={post} store={store} />
    </Pressable>
  );
};

type FeedPostListProps = {
  posts: PostDto[];
  store: FeedUiStore;
  isRefreshing: boolean;
  isFetchingNextPage: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  onPostPress: (postId: string) => void;
};

export const FeedPostList = ({
  posts,
  store,
  isRefreshing,
  isFetchingNextPage,
  onRefresh,
  onEndReached,
  onPostPress,
}: FeedPostListProps) => {
  const renderPostItem = React.useCallback<ListRenderItem<PostDto>>(
    ({ item }) => (
      <FeedPostListItem post={item} store={store} onPostPress={onPostPress} />
    ),
    [onPostPress, store]
  );

  return (
    <FlatList
      testID='feed-post-list'
      data={posts}
      keyExtractor={extractPostKey}
      renderItem={renderPostItem}
      contentContainerStyle={styles.content}
      style={styles.root}
      ItemSeparatorComponent={FeedPostListSeparator}
      onEndReachedThreshold={0.4}
      onEndReached={onEndReached}
      removeClippedSubviews
      initialNumToRender={6}
      maxToRenderPerBatch={8}
      windowSize={7}
      updateCellsBatchingPeriod={50}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
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
  root: {
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
