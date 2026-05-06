import { StyleSheet, View } from 'react-native';

import { useFeedScreen } from '@/features/feed/model/screen/useFeedScreen';
import { colors } from '@/shared/theme/tokens';
import { UiStateView } from '@/shared/ui/kit/UiStateView';

import { FeedFilterTabs } from './FeedFilterTabs';
import { FeedPostList } from './FeedPostList';
import { FeedPostListSkeleton } from './FeedPostListSkeleton';

export const FeedList = () => {
  const {
    activeFilter,
    posts,
    screenState,
    store,
    isFetchingNextPage,
    isRefreshing,
    setActiveFilter,
    handleEndReached,
    handlePostPress,
    handleRefresh,
  } = useFeedScreen();

  return (
    <View style={styles.screen}>
      <FeedFilterTabs value={activeFilter} onChange={setActiveFilter} />

      {screenState === 'loading' ? <FeedPostListSkeleton /> : null}

      {screenState === 'error' ? (
        <UiStateView
          variant='panel'
          title='Не удалось загрузить публикации'
          titleVariant='title'
          showErrorIcon
          onRetry={handleRefresh}
        />
      ) : null}

      {screenState === 'empty' ? (
        <UiStateView
          variant='panel'
          title='По вашему запросу ничего не найдено'
          titleVariant='title'
          retryLabel='Обновить'
          showErrorIcon
          onRetry={handleRefresh}
        />
      ) : null}

      {screenState === 'content' ? (
        <FeedPostList
          posts={posts}
          store={store}
          isRefreshing={isRefreshing}
          isFetchingNextPage={isFetchingNextPage}
          onRefresh={handleRefresh}
          onEndReached={handleEndReached}
          onPostPress={handlePostPress}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
});
