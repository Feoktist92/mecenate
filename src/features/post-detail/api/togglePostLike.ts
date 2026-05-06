import { TogglePostLikeResponseDto } from '@/entities/post/types';
import { apiPost } from '@/shared/api/client';

export const togglePostLike = async (
  postId: string
): Promise<TogglePostLikeResponseDto> =>
  apiPost<TogglePostLikeResponseDto>(
    `/posts/${encodeURIComponent(postId)}/like`
  );
