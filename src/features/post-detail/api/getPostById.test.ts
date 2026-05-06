import type {
  CommentDto,
  CommentsResponseDto,
  CreateCommentResponseDto,
  PostDetailResponseDto,
} from '@/entities/post/types';
import {
  createTestComment,
  createTestPost,
  TEST_POST_ID,
} from '@/features/post-detail/model/testing/postDetailTestFactories';

describe('getPostById contracts', () => {
  const post = createTestPost({
    id: TEST_POST_ID,
    body: 'Full body',
  });
  const comment: CommentDto = createTestComment('comment_1', {
    text: 'Great post',
    createdAt: '2026-01-01T00:05:00.000Z',
  });

  it('supports detail response shape', () => {
    const detailResponse: PostDetailResponseDto = {
      ok: true,
      data: {
        post,
      },
    };

    expect(detailResponse.data.post.id).toBe(TEST_POST_ID);
  });

  it('supports comment DTO optional fields', () => {
    const likedComment: CommentDto = {
      ...comment,
      likesCount: 12,
      isLiked: true,
    };

    expect(comment.likesCount).toBeUndefined();
    expect(likedComment.isLiked).toBe(true);
  });

  it('supports comments response shape', () => {
    const commentsResponse: CommentsResponseDto = {
      ok: true,
      data: {
        comments: [comment],
        nextCursor: null,
        hasMore: false,
      },
    };

    expect(commentsResponse.data.comments).toHaveLength(1);
    expect(commentsResponse.data.nextCursor).toBeNull();
    expect(commentsResponse.data.hasMore).toBe(false);
  });

  it('supports create comment response shape', () => {
    const createCommentResponse: CreateCommentResponseDto = {
      ok: true,
      data: {
        comment: {
          ...comment,
          likesCount: 0,
          isLiked: false,
        },
      },
    };

    expect(createCommentResponse.data.comment.id).toBe('comment_1');
    expect(createCommentResponse.data.comment.likesCount).toBe(0);
  });
});
