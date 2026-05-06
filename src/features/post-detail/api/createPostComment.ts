import { CreateCommentResponseDto } from '@/entities/post/types';
import { apiPost } from '@/shared/api/client';

type CreatePostCommentParams = {
  postId: string;
  text: string;
};

export const createPostComment = async ({
  postId,
  text,
}: CreatePostCommentParams): Promise<CreateCommentResponseDto> =>
  apiPost<CreateCommentResponseDto>(
    `/posts/${encodeURIComponent(postId)}/comments`,
    { text }
  );
