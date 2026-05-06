import { PostDetailResponseDto } from '@/entities/post/types';
import { apiGet } from '@/shared/api/client';

export const getPostById = async (
  postId: string
): Promise<PostDetailResponseDto> =>
  apiGet<PostDetailResponseDto>(`/posts/${encodeURIComponent(postId)}`);
