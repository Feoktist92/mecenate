import { InfiniteData, QueryClient } from '@tanstack/react-query';

import type {
  CommentDto,
  CommentsResponseDto,
  PostDetailResponseDto,
  PostDto,
  PostsResponseDto,
} from '@/entities/post/types';

export const TEST_POST_ID = 'post_42';

export const createTestPost = (overrides: Partial<PostDto> = {}): PostDto => ({
  id: TEST_POST_ID,
  author: {
    id: 'author_1',
    username: 'author',
    displayName: 'Author',
    avatarUrl: null,
  },
  title: 'Post title',
  body: 'Body',
  preview: 'Preview',
  coverUrl: 'https://example.com/cover.jpg',
  likesCount: 10,
  commentsCount: 3,
  isLiked: false,
  tier: 'free',
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

export const createTestPostDetail = (
  postOverrides: Partial<PostDto> = {}
): PostDetailResponseDto => ({
  ok: true,
  data: {
    post: createTestPost(postOverrides),
  },
});

export const createTestComment = (
  id: string,
  overrides: Partial<CommentDto> = {}
): CommentDto => ({
  id,
  postId: TEST_POST_ID,
  author: {
    id: 'author_2',
    username: 'reader',
    displayName: 'Reader',
    avatarUrl: null,
  },
  text: `Comment ${id}`,
  createdAt: '2026-01-01T00:10:00.000Z',
  ...overrides,
});

export const createTestFeedCache = (
  posts: PostDto[] = [createTestPost()]
): InfiniteData<PostsResponseDto, string | null> => ({
  pages: [
    {
      ok: true,
      data: {
        posts,
        nextCursor: null,
        hasMore: false,
      },
    },
  ],
  pageParams: [null],
});

export const createTestCommentsCache = (
  comments: CommentDto[]
): InfiniteData<CommentsResponseDto, string | null> => ({
  pages: [
    {
      ok: true,
      data: {
        comments,
        nextCursor: null,
        hasMore: false,
      },
    },
  ],
  pageParams: [null],
});

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

export const createDeferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, resolve, reject };
};
