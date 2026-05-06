import {
  createTestComment,
  createTestPost,
  TEST_POST_ID,
} from '@/features/post-detail/model/testing/postDetailTestFactories';
import { ApiError } from '@/shared/api/client';

import { createPostComment } from './createPostComment';
import { getPostById } from './getPostById';
import { getPostComments } from './getPostComments';
import { togglePostLike } from './togglePostLike';

const mockFetchJson = (payload: unknown, status = 200, ok = true) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    json: async () => payload,
  } as Response);
};

describe('postDetail API clients', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('requests post detail by id', async () => {
    mockFetchJson({
      ok: true,
      data: {
        post: createTestPost({
          body: 'Full body',
        }),
      },
    });

    const response = await getPostById(TEST_POST_ID);

    expect(global.fetch).toHaveBeenCalledTimes(1);

    const [requestUrl, requestInit] = (global.fetch as jest.Mock).mock.calls[0];
    const url = new URL(String(requestUrl));
    const headers = requestInit?.headers as Record<string, string>;

    expect(url.pathname.endsWith(`/posts/${TEST_POST_ID}`)).toBe(true);
    expect(requestInit?.method).toBe('GET');
    expect(headers.Authorization).toMatch(/^Bearer /);
    expect(response.ok).toBe(true);
    expect(response.data.post.id).toBe(TEST_POST_ID);
  });

  it('requests post comments with cursor and limit query params', async () => {
    mockFetchJson({
      ok: true,
      data: {
        comments: [],
        nextCursor: null,
        hasMore: false,
      },
    });

    await getPostComments({
      postId: TEST_POST_ID,
      limit: 25,
      cursor: 'cursor_25',
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    const [requestUrl, requestInit] = (global.fetch as jest.Mock).mock.calls[0];
    const url = new URL(String(requestUrl));

    expect(url.pathname.endsWith(`/posts/${TEST_POST_ID}/comments`)).toBe(true);
    expect(url.searchParams.get('limit')).toBe('25');
    expect(url.searchParams.get('cursor')).toBe('cursor_25');
    expect(requestInit?.method).toBe('GET');
  });

  it('requests create comment via POST with auth header and json body', async () => {
    mockFetchJson(
      {
        ok: true,
        data: {
          comment: createTestComment('comment_1', {
            text: 'New comment',
            createdAt: '2026-01-01T00:05:00.000Z',
          }),
        },
      },
      201
    );

    const response = await createPostComment({
      postId: TEST_POST_ID,
      text: 'New comment',
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    const [requestUrl, requestInit] = (global.fetch as jest.Mock).mock.calls[0];
    const url = new URL(String(requestUrl));
    const headers = requestInit?.headers as Record<string, string>;

    expect(url.pathname.endsWith(`/posts/${TEST_POST_ID}/comments`)).toBe(true);
    expect(requestInit?.method).toBe('POST');
    expect(headers.Authorization).toMatch(/^Bearer /);
    expect(requestInit?.body).toBe(JSON.stringify({ text: 'New comment' }));
    expect(response.ok).toBe(true);
    expect(response.data.comment.id).toBe('comment_1');
  });

  it('requests toggle like via POST with auth header', async () => {
    mockFetchJson({
      ok: true,
      data: {
        isLiked: true,
        likesCount: 11,
      },
    });

    const response = await togglePostLike(TEST_POST_ID);

    expect(global.fetch).toHaveBeenCalledTimes(1);

    const [requestUrl, requestInit] = (global.fetch as jest.Mock).mock.calls[0];
    const url = new URL(String(requestUrl));
    const headers = requestInit?.headers as Record<string, string>;

    expect(url.pathname.endsWith(`/posts/${TEST_POST_ID}/like`)).toBe(true);
    expect(requestInit?.method).toBe('POST');
    expect(headers.Authorization).toMatch(/^Bearer /);
    expect(response.ok).toBe(true);
    expect(response.data.isLiked).toBe(true);
    expect(response.data.likesCount).toBe(11);
  });

  it('throws ApiError with status code and message from payload', async () => {
    mockFetchJson(
      {
        ok: false,
        error: {
          code: 'POST_NOT_FOUND',
          message: 'Post is missing',
        },
      },
      404,
      false
    );

    expect.assertions(5);

    try {
      await getPostById('missing');
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(ApiError);

      const apiError = error as ApiError;
      expect(apiError.name).toBe('ApiError');
      expect(apiError.message).toBe('Post is missing');
      expect(apiError.status).toBe(404);
      expect(apiError.code).toBe('POST_NOT_FOUND');
    }
  });

  it('uses fallback ApiError message when payload error message is absent', async () => {
    mockFetchJson(
      {
        ok: false,
        error: {
          code: 'UNAVAILABLE',
        },
      },
      503,
      false
    );

    await expect(
      createPostComment({ postId: TEST_POST_ID, text: 'Try again' })
    ).rejects.toMatchObject({
      name: 'ApiError',
      message: 'Request failed',
      status: 503,
      code: 'UNAVAILABLE',
    });
  });
});
