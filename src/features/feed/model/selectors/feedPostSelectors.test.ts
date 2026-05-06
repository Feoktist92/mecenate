import type { PostDto } from '@/entities/post/types';

import {
  isFeedPostLocked,
  isFeedPostPressable,
  shouldShowFeedPostActions,
} from './feedPostSelectors';

const createPost = (tier: PostDto['tier']): PostDto => ({
  id: 'post_1',
  title: 'Пост',
  preview: 'Превью',
  body: 'Тело',
  coverUrl: 'https://example.com/cover.jpg',
  likesCount: 0,
  commentsCount: 0,
  isLiked: false,
  tier,
  createdAt: '2026-05-01T00:00:00.000Z',
  author: {
    id: 'author_1',
    username: 'author',
    displayName: 'Автор',
    avatarUrl: null,
  },
});

describe('feedPostSelectors', () => {
  it('treats free post as pressable and action-enabled', () => {
    const post = createPost('free');

    expect(isFeedPostPressable(post)).toBe(true);
    expect(shouldShowFeedPostActions(post)).toBe(true);
    expect(isFeedPostLocked(post)).toBe(false);
  });

  it('treats paid post as non-pressable and locked', () => {
    const post = createPost('paid');

    expect(isFeedPostPressable(post)).toBe(false);
    expect(shouldShowFeedPostActions(post)).toBe(false);
    expect(isFeedPostLocked(post)).toBe(true);
  });
});
