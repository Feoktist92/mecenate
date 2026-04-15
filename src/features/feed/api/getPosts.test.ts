import { getPosts } from './getPosts';

describe('getPosts', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('requests posts with query params and bearer token', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        data: {
          posts: [],
          nextCursor: null,
          hasMore: false,
        },
      }),
    } as Response);

    await getPosts({ limit: 10, cursor: 'post_10' });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    const [requestUrl, requestInit] = (global.fetch as jest.Mock).mock.calls[0];
    const url = new URL(String(requestUrl));
    const headers = requestInit?.headers as Record<string, string>;

    expect(url.searchParams.get('limit')).toBe('10');
    expect(url.searchParams.get('cursor')).toBe('post_10');
    expect(headers.Authorization).toMatch(/^Bearer /);
  });

  it('throws when API returns non-2xx response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({
        ok: false,
        error: { code: 'INTERNAL', message: 'Boom' },
      }),
    } as Response);

    await expect(getPosts({ limit: 10 })).rejects.toThrow('Boom');
  });
});

