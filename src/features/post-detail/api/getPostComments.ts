import { CommentsResponseDto } from '@/entities/post/types';
import { apiGet } from '@/shared/api/client';

type GetPostCommentsParams = {
  postId: string;
  limit?: number;
  cursor?: string | null;
};

export const getPostComments = async ({
  postId,
  limit = 20,
  cursor = null,
}: GetPostCommentsParams): Promise<CommentsResponseDto> =>
  apiGet<CommentsResponseDto>(`/posts/${encodeURIComponent(postId)}/comments`, {
    limit,
    cursor,
  });
