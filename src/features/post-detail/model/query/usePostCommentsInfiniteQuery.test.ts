import {
  flattenCommentsPages,
  getNextCommentsPageParam,
  type PostCommentsPage,
} from './usePostCommentsInfiniteQuery';

describe('usePostCommentsInfiniteQuery helpers', () => {
  it('returns next cursor when comments page has more data', () => {
    const page: PostCommentsPage = {
      ok: true,
      data: {
        comments: [],
        nextCursor: 'comment_20',
        hasMore: true,
      },
    };

    expect(getNextCommentsPageParam(page)).toBe('comment_20');
  });

  it('returns undefined when comments page has no next cursor', () => {
    const page: PostCommentsPage = {
      ok: true,
      data: {
        comments: [],
        nextCursor: null,
        hasMore: false,
      },
    };

    expect(getNextCommentsPageParam(page)).toBeUndefined();
  });

  it('flattens comments from all pages preserving order', () => {
    const pages: PostCommentsPage[] = [
      {
        ok: true,
        data: {
          comments: [
            { id: 'comment_1' } as PostCommentsPage['data']['comments'][number],
            { id: 'comment_2' } as PostCommentsPage['data']['comments'][number],
          ],
          nextCursor: 'comment_2',
          hasMore: true,
        },
      },
      {
        ok: true,
        data: {
          comments: [
            { id: 'comment_3' } as PostCommentsPage['data']['comments'][number],
          ],
          nextCursor: null,
          hasMore: false,
        },
      },
    ];

    expect(flattenCommentsPages(pages).map((comment) => comment.id)).toEqual([
      'comment_1',
      'comment_2',
      'comment_3',
    ]);
  });

  it('deduplicates comments by id when the same item appears across pages', () => {
    const pages: PostCommentsPage[] = [
      {
        ok: true,
        data: {
          comments: [
            { id: 'comment_1' } as PostCommentsPage['data']['comments'][number],
            { id: 'comment_2' } as PostCommentsPage['data']['comments'][number],
          ],
          nextCursor: 'comment_2',
          hasMore: true,
        },
      },
      {
        ok: true,
        data: {
          comments: [
            { id: 'comment_2' } as PostCommentsPage['data']['comments'][number],
            { id: 'comment_3' } as PostCommentsPage['data']['comments'][number],
          ],
          nextCursor: null,
          hasMore: false,
        },
      },
    ];

    expect(flattenCommentsPages(pages).map((comment) => comment.id)).toEqual([
      'comment_1',
      'comment_2',
      'comment_3',
    ]);
  });
});
