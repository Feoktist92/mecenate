import type { PostDto } from '@/entities/post/types';

import { getPostText } from './postText';

const createPost = (overrides: Partial<PostDto> = {}): PostDto => ({
  id: 'post_1',
  title: 'Пост',
  preview: 'Превью',
  body: 'Полный текст',
  coverUrl: 'https://example.com/cover.jpg',
  likesCount: 0,
  commentsCount: 0,
  isLiked: false,
  tier: 'free',
  createdAt: '2026-05-01T00:00:00.000Z',
  author: {
    id: 'author_1',
    username: 'author',
    displayName: 'Автор',
    avatarUrl: null,
  },
  ...overrides,
});

describe('getPostText', () => {
  it('returns preview in preview mode with body fallback', () => {
    expect(getPostText(createPost(), 'preview')).toBe('Превью');
    expect(getPostText(createPost({ preview: '' }), 'preview')).toBe(
      'Полный текст'
    );
  });

  it('returns body in full mode with preview fallback', () => {
    expect(getPostText(createPost(), 'full')).toBe('Полный текст');
    expect(getPostText(createPost({ body: '' }), 'full')).toBe('Превью');
  });
});
