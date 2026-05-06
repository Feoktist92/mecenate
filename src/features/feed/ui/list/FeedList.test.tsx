import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { PostDto } from '@/entities/post/types';
import { useFeedInfiniteQuery } from '@/features/feed/model/query/useFeedInfiniteQuery';

import { FeedList } from './FeedList';

jest.mock('@/features/feed/model/query/useFeedInfiniteQuery', () => ({
  useFeedInfiniteQuery: jest.fn(),
}));

const mockedPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockedPush,
  }),
}));

const mockedUseFeedInfiniteQuery = useFeedInfiniteQuery as jest.MockedFunction<
  typeof useFeedInfiniteQuery
>;
const originalConsoleError = console.error;

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

const createDeferred = () => {
  let resolve!: () => void;
  const promise = new Promise<void>((promiseResolve) => {
    resolve = promiseResolve;
  });

  return { promise, resolve };
};

const createPost = (overrides: Partial<PostDto> = {}): PostDto => ({
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
  ...overrides,
});

describe('FeedList', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes(
          'Each child in a list should have a unique "key" prop.'
        )
      ) {
        return;
      }

      originalConsoleError(...(args as Parameters<typeof console.error>));
    });
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows skeleton while initial loading is in progress', () => {
    mockedUseFeedInfiniteQuery.mockReturnValue({
      ...createBaseQueryState(),
      isPending: true,
      isFetching: true,
    } as unknown as ReturnType<typeof useFeedInfiniteQuery>);

    const { getByTestId } = render(<FeedList />);

    expect(getByTestId('feed-list-skeleton')).toBeTruthy();
  });

  it('shows error state when request fails and posts are empty', () => {
    mockedUseFeedInfiniteQuery.mockReturnValue({
      ...createBaseQueryState(),
      isError: true,
    } as unknown as ReturnType<typeof useFeedInfiniteQuery>);

    const { getByText } = render(<FeedList />);

    expect(getByText('Не удалось загрузить публикации')).toBeTruthy();
    expect(getByText('Повторить')).toBeTruthy();
  });

  it('renders feed list when posts are loaded', () => {
    mockedUseFeedInfiniteQuery.mockReturnValue({
      ...createBaseQueryState(),
      posts: [createPost()],
    } as unknown as ReturnType<typeof useFeedInfiniteQuery>);

    const { getByTestId } = render(<FeedList />);

    expect(getByTestId('feed-post-list')).toBeTruthy();
  });

  it('shows empty state when posts array is empty after successful loading', () => {
    mockedUseFeedInfiniteQuery.mockReturnValue({
      ...createBaseQueryState(),
      isPending: false,
      isFetching: false,
      isError: false,
    } as unknown as ReturnType<typeof useFeedInfiniteQuery>);

    const { getByText } = render(<FeedList />);

    expect(getByText('По вашему запросу ничего не найдено')).toBeTruthy();
    expect(getByText('Обновить')).toBeTruthy();
  });

  it('calls refetch on pull-to-refresh', async () => {
    const refetch = jest.fn(() => Promise.resolve());

    mockedUseFeedInfiniteQuery.mockReturnValue({
      ...createBaseQueryState(),
      posts: [createPost()],
      refetch,
    } as unknown as ReturnType<typeof useFeedInfiniteQuery>);

    const { getByTestId } = render(<FeedList />);
    const list = getByTestId('feed-post-list');

    await act(async () => {
      list.props.refreshControl.props.onRefresh();
      await Promise.resolve();
    });

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('does not show pull-to-refresh spinner during background refetch', () => {
    mockedUseFeedInfiniteQuery.mockReturnValue({
      ...createBaseQueryState(),
      posts: [createPost()],
      isRefetching: true,
    } as unknown as ReturnType<typeof useFeedInfiniteQuery>);

    const { getByTestId } = render(<FeedList />);
    const list = getByTestId('feed-post-list');

    expect(list.props.refreshControl.props.refreshing).toBe(false);
  });

  it('shows pull-to-refresh spinner only while user refresh is pending', async () => {
    const deferred = createDeferred();
    const refetch = jest.fn(() => deferred.promise);

    mockedUseFeedInfiniteQuery.mockReturnValue({
      ...createBaseQueryState(),
      posts: [createPost()],
      refetch,
    } as unknown as ReturnType<typeof useFeedInfiniteQuery>);

    const { getByTestId } = render(<FeedList />);

    expect(
      getByTestId('feed-post-list').props.refreshControl.props.refreshing
    ).toBe(false);

    act(() => {
      getByTestId('feed-post-list').props.refreshControl.props.onRefresh();
    });

    expect(
      getByTestId('feed-post-list').props.refreshControl.props.refreshing
    ).toBe(true);

    await act(async () => {
      deferred.resolve();
      await deferred.promise;
    });

    expect(
      getByTestId('feed-post-list').props.refreshControl.props.refreshing
    ).toBe(false);
  });

  it('calls fetchNextPage when end reached and pagination is available', () => {
    const fetchNextPage = jest.fn();

    mockedUseFeedInfiniteQuery.mockReturnValue({
      ...createBaseQueryState(),
      posts: [createPost()],
      hasNextPage: true,
      fetchNextPage,
    } as unknown as ReturnType<typeof useFeedInfiniteQuery>);

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
    } as unknown as ReturnType<typeof useFeedInfiniteQuery>);

    const { getByTestId } = render(<FeedList />);
    const list = getByTestId('feed-post-list');

    act(() => {
      list.props.onEndReached();
    });

    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it('switches tier filter and refetches with selected tier query key', () => {
    mockedUseFeedInfiniteQuery.mockReturnValue({
      ...createBaseQueryState(),
      posts: [createPost()],
    } as unknown as ReturnType<typeof useFeedInfiniteQuery>);

    const { getByText } = render(<FeedList />);

    expect(mockedUseFeedInfiniteQuery).toHaveBeenLastCalledWith(undefined);

    fireEvent.press(getByText('Платные'));

    expect(mockedUseFeedInfiniteQuery).toHaveBeenLastCalledWith('paid');
  });

  it('navigates to post detail when free post card is tapped', () => {
    mockedUseFeedInfiniteQuery.mockReturnValue({
      ...createBaseQueryState(),
      posts: [createPost()],
    } as unknown as ReturnType<typeof useFeedInfiniteQuery>);

    const { getByText } = render(<FeedList />);

    fireEvent.press(getByText('Пост'));

    expect(mockedPush).toHaveBeenCalledWith('/post/post_1');
  });

  it('does not navigate when paid post card is tapped', () => {
    mockedUseFeedInfiniteQuery.mockReturnValue({
      ...createBaseQueryState(),
      posts: [
        createPost({
          id: 'post_paid',
          tier: 'paid',
          title: 'Платный пост',
          preview: '',
          body: '',
        }),
      ],
    } as unknown as ReturnType<typeof useFeedInfiniteQuery>);

    const { getByText } = render(<FeedList />);

    fireEvent.press(getByText('Контент скрыт пользователем.'));

    expect(mockedPush).not.toHaveBeenCalled();
  });
});
