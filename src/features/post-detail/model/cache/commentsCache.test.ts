import type { InfiniteData } from '@tanstack/react-query';

import type { CommentsResponseDto } from '@/entities/post/types';

import { prependCommentToCommentsCache } from './commentsCache';
import { createTestComment } from '../testing/postDetailTestFactories';

describe('commentsCache helpers', () => {
  it('prepends created comment to the first comments page', () => {
    const current: InfiniteData<CommentsResponseDto, string | null> = {
      pages: [
        {
          ok: true,
          data: {
            comments: [
              createTestComment('comment_2', { text: 'Older comment' }),
            ],
            nextCursor: 'comment_2',
            hasMore: true,
          },
        },
        {
          ok: true,
          data: {
            comments: [],
            nextCursor: null,
            hasMore: false,
          },
        },
      ],
      pageParams: [null, 'comment_2'],
    };
    const newComment = createTestComment('comment_3', {
      text: 'Newest comment',
      createdAt: '2026-01-01T00:11:00.000Z',
    });

    const updated = prependCommentToCommentsCache(current, newComment);

    expect(
      updated?.pages[0].data.comments.map((comment) => comment.id)
    ).toEqual(['comment_3', 'comment_2']);
    expect(updated?.pages[1]).toEqual(current.pages[1]);
    expect(updated?.pageParams).toEqual(current.pageParams);
  });

  it('returns undefined comments cache unchanged when current cache is absent', () => {
    const updated = prependCommentToCommentsCache(
      undefined,
      createTestComment('comment_3')
    );

    expect(updated).toBeUndefined();
  });

  it('creates first comments page when cache has no pages yet', () => {
    const updated = prependCommentToCommentsCache(
      {
        pages: [],
        pageParams: [],
      },
      createTestComment('comment_3')
    );

    expect(updated?.pages).toHaveLength(1);
    expect(updated?.pages[0].data.comments[0].id).toBe('comment_3');
    expect(updated?.pages[0].data.nextCursor).toBeNull();
    expect(updated?.pages[0].data.hasMore).toBe(false);
    expect(updated?.pageParams).toEqual([null]);
  });
});
