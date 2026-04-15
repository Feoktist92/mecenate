import { act, render } from '@testing-library/react-native';
import React from 'react';

import { PostDto } from '@/entities/post/types';
import { useFeedInfiniteQuery } from '@/features/feed/model/useFeedInfiniteQuery';

import { FeedList } from './FeedList';

jest.mock('@/features/feed/model/useFeedInfiniteQuery', () => ({
  useFeedInfiniteQuery: jest.fn(),
}));

const mockedUseFeedInfiniteQuery = useFeedInfiniteQuery as jest.MockedFunction<
  typeof useFeedInfiniteQuery
>;

const createBaseQueryState = () => ({
  posts: [] as PostDto[],
  isPending: false,
  isFetching: false,
  isError: false,
  hasNextPage: false,
  isFetchingNextPage: false,
  isRefetching: false,
  fetchNextPage: jest.fn(),
  refetch: jest.fn(),
});

const createPost = (): PostDto => ({
  id: 'post_1',
  title: 'Пост',
  preview: 'Превью',
  body: 'Тело',
  coverUrl: 'https://example.com/cover.jpg',
  likesCount: 1,
  commentsCount: 2,
  isLiked: false,
  tier: 'free',
  createdAt: '2026-04-14T10:00:00.000Z',
  author: {
    id: 'author_1',
    username: 'author',
    displayName: 'Автор',
    avatarUrl: null,
  },
});

describe('FeedList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows skeleton while initial loading is in progress', () => {
    mockedUseFeedInfiniteQuery.mockReturnValue({
      ...createBaseQueryState(),
      isPending: true,
      isFetching: true,
    } as ReturnType<typeof useFeedInfiniteQuery>);

    const { getByTestId } = render(<FeedList />);

    expect(getByTestId('feed-list-skeleton')).toBeTruthy();
  });

  it('shows error state when request fails and posts are empty', () => {
    mockedUseFeedInfiniteQuery.mockReturnValue({
      ...createBaseQueryState(),
      isError: true,
    } as ReturnType<typeof useFeedInfiniteQuery>);

    const { getByText } = render(<FeedList />);

    expect(getByText('Не удалось загрузить публикации')).toBeTruthy();
    expect(getByText('Повторить')).toBeTruthy();
  });

  it('renders feed list when posts are loaded', () => {
    mockedUseFeedInfiniteQuery.mockReturnValue({
      ...createBaseQueryState(),
      posts: [createPost()],
    } as ReturnType<typeof useFeedInfiniteQuery>);

    const { getByTestId } = render(<FeedList />);

    expect(getByTestId('feed-post-list')).toBeTruthy();
  });

  it('shows empty state when posts array is empty after successful loading', () => {
    mockedUseFeedInfiniteQuery.mockReturnValue({
      ...createBaseQueryState(),
      isPending: false,
      isFetching: false,
      isError: false,
    } as ReturnType<typeof useFeedInfiniteQuery>);

    const { getByText } = render(<FeedList />);

    expect(getByText('По вашему запросу ничего не найдено')).toBeTruthy();
    expect(getByText('Обновить')).toBeTruthy();
  });

  it('calls refetch on pull-to-refresh', () => {
    const refetch = jest.fn();

    mockedUseFeedInfiniteQuery.mockReturnValue({
      ...createBaseQueryState(),
      posts: [createPost()],
      refetch,
    } as ReturnType<typeof useFeedInfiniteQuery>);

    const { getByTestId } = render(<FeedList />);
    const list = getByTestId('feed-post-list');

    act(() => {
      list.props.refreshControl.props.onRefresh();
    });

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('calls fetchNextPage when end reached and pagination is available', () => {
    const fetchNextPage = jest.fn();

    mockedUseFeedInfiniteQuery.mockReturnValue({
      ...createBaseQueryState(),
      posts: [createPost()],
      hasNextPage: true,
      fetchNextPage,
    } as ReturnType<typeof useFeedInfiniteQuery>);

    const { getByTestId } = render(<FeedList />);
    const list = getByTestId('feed-post-list');

    act(() => {
      list.props.onEndReached();
    });

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('does not call fetchNextPage while refetch is in progress', () => {
    const fetchNextPage = jest.fn();

    mockedUseFeedInfiniteQuery.mockReturnValue({
      ...createBaseQueryState(),
      posts: [createPost()],
      hasNextPage: true,
      isRefetching: true,
      fetchNextPage,
    } as ReturnType<typeof useFeedInfiniteQuery>);

    const { getByTestId } = render(<FeedList />);
    const list = getByTestId('feed-post-list');

    act(() => {
      list.props.onEndReached();
    });

    expect(fetchNextPage).not.toHaveBeenCalled();
  });
});
