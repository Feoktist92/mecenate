import {
  flattenFeedPages,
  getNextFeedPageParam,
  type FeedPage,
} from './useFeedInfiniteQuery';

describe('useFeedInfiniteQuery helpers', () => {
  it('returns next cursor when hasMore is true', () => {
    const page: FeedPage = {
      ok: true,
      data: {
        posts: [],
        nextCursor: 'post_20',
        hasMore: true,
      },
    };

    expect(getNextFeedPageParam(page)).toBe('post_20');
  });

  it('returns undefined when hasMore is false', () => {
    const page: FeedPage = {
      ok: true,
      data: {
        posts: [],
        nextCursor: 'post_20',
        hasMore: false,
      },
    };

    expect(getNextFeedPageParam(page)).toBeUndefined();
  });

  it('flattens posts from all pages preserving order', () => {
    const pages: FeedPage[] = [
      {
        ok: true,
        data: {
          posts: [
            { id: 'post_1' } as FeedPage['data']['posts'][number],
            { id: 'post_2' } as FeedPage['data']['posts'][number],
          ],
          nextCursor: 'post_2',
          hasMore: true,
        },
      },
      {
        ok: true,
        data: {
          posts: [{ id: 'post_3' } as FeedPage['data']['posts'][number]],
          nextCursor: null,
          hasMore: false,
        },
      },
    ];

    expect(flattenFeedPages(pages).map((post) => post.id)).toEqual([
      'post_1',
      'post_2',
      'post_3',
    ]);
  });
});

