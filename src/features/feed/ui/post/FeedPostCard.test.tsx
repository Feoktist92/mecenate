import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Platform } from 'react-native';

import { createFeedUiStore } from '@/features/feed/model/feedUiStore';
import { FeedErrorState } from '@/features/feed/ui/list/FeedErrorState';
import { FeedPostCard } from '@/features/feed/ui/post/FeedPostCard';

describe('Feed UI', () => {
  it('renders preview text for free post', () => {
    const store = createFeedUiStore();

    const post = {
      id: 'post_free',
      author: {
        id: 'author_1',
        username: 'lesha_krid',
        displayName: 'Леша Крид',
        avatarUrl: 'https://k8s.mectest.ru/test-app/mock/avatar-author-1.jpg',
      },
      title: 'Подготовка к лету',
      preview: 'Когда вы начинаете бегать по утрам...',
      body: 'Когда вы начинаете бегать по утрам...',
      coverUrl: 'https://k8s.mectest.ru/test-app/mock/cover-post-1.jpg',
      likesCount: 12,
      commentsCount: 19,
      isLiked: false,
      tier: 'free' as const,
      createdAt: '2026-04-14T10:00:00.000Z',
    };

    const { getByText, queryByText } = render(<FeedPostCard post={post} store={store} />);

    expect(getByText('Подготовка к лету')).toBeTruthy();
    expect(getByText('Когда вы начинаете бегать по утрам...')).toBeTruthy();
    expect(queryByText('Контент скрыт пользователем.')).toBeNull();
  });

  it('renders paid placeholder for paid post', () => {
    const store = createFeedUiStore();

    const post = {
      id: 'post_paid',
      author: {
        id: 'author_2',
        username: 'petr',
        displayName: 'Петр Федько',
        avatarUrl: 'https://k8s.mectest.ru/test-app/mock/avatar-author-2.jpg',
      },
      title: 'Эксклюзив',
      preview: '',
      body: '',
      coverUrl: 'https://k8s.mectest.ru/test-app/mock/cover-post-2.jpg',
      likesCount: 99,
      commentsCount: 7,
      isLiked: false,
      tier: 'paid' as const,
      createdAt: '2026-04-14T10:00:00.000Z',
    };

    const { getByText, queryByText, getByTestId } = render(<FeedPostCard post={post} store={store} />);

    expect(getByText('Контент скрыт пользователем.')).toBeTruthy();
    expect(getByText('Доступ откроется после доната')).toBeTruthy();
    expect(getByText('Отправить донат')).toBeTruthy();
    expect(getByTestId('paid-blur')).toBeTruthy();
    expect(getByTestId('post-cover').props.blurRadius).toBe(Platform.OS === 'android' ? 40 : 0);
    expect(queryByText('Эксклюзив')).toBeNull();
    expect(queryByText('Когда вы начинаете бегать по утрам...')).toBeNull();
  });

  it('renders error state and calls retry handler', () => {
    const onRetry = jest.fn();
    const { getByText } = render(<FeedErrorState onRetry={onRetry} />);

    fireEvent.press(getByText('Повторить'));

    expect(getByText('Не удалось загрузить публикации')).toBeTruthy();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders avatar fallback when avatarUrl is null', () => {
    const store = createFeedUiStore();

    const post = {
      id: 'post_no_avatar',
      author: {
        id: 'author_3',
        username: 'anya',
        displayName: 'Аня Кодерова',
        avatarUrl: null,
      },
      title: 'Без аватара',
      preview: 'Превью',
      body: 'Текст',
      coverUrl: 'https://k8s.mectest.ru/test-app/mock/cover-post-3.jpg',
      likesCount: 1,
      commentsCount: 2,
      isLiked: false,
      tier: 'free' as const,
      createdAt: '2026-04-14T10:00:00.000Z',
    };

    const { getByText } = render(<FeedPostCard post={post} store={store} />);

    expect(getByText('А')).toBeTruthy();
  });

  it('renders image avatar when avatarUrl is provided', () => {
    const store = createFeedUiStore();

    const post = {
      id: 'post_image_avatar',
      author: {
        id: 'author_4',
        username: 'lesha',
        displayName: 'Леша Крид',
        avatarUrl: 'https://k8s.mectest.ru/test-app/mock/avatar-author-4.jpg',
      },
      title: 'Image avatar',
      preview: 'Превью',
      body: 'Текст',
      coverUrl: 'https://k8s.mectest.ru/test-app/mock/cover-post-4.jpg',
      likesCount: 11,
      commentsCount: 22,
      isLiked: false,
      tier: 'free' as const,
      createdAt: '2026-04-14T10:00:00.000Z',
    };

    const { getByTestId, queryByTestId } = render(<FeedPostCard post={post} store={store} />);

    expect(getByTestId('avatar-image')).toBeTruthy();

    expect(queryByTestId('avatar-fallback')).toBeNull();
  });

  it('shows post error card when cover loading fails and retries', () => {
    const store = createFeedUiStore();

    const post = {
      id: 'post_cover_error',
      author: {
        id: 'author_5',
        username: 'petr',
        displayName: 'Петр Федько',
        avatarUrl: null,
      },
      title: 'Пост с ошибкой',
      preview: 'Превью',
      body: 'Текст',
      coverUrl: 'https://k8s.mectest.ru/test-app/mock/invalid-cover.jpg',
      likesCount: 1,
      commentsCount: 2,
      isLiked: false,
      tier: 'free' as const,
      createdAt: '2026-04-14T10:00:00.000Z',
    };

    const { getByTestId, getByText, queryByText } = render(<FeedPostCard post={post} store={store} />);

    fireEvent(getByTestId('post-cover'), 'error');

    expect(getByText('Не удалось загрузить публикацию')).toBeTruthy();

    fireEvent.press(getByTestId('post-error-retry-button'));

    expect(queryByText('Не удалось загрузить публикацию')).toBeNull();
  });
});
