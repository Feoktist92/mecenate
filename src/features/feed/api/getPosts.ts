import { PostsResponseDto, PostTier } from '@/entities/post/types';
import { apiGet } from '@/shared/api/client';

type GetPostsParams = {
  limit?: number;
  cursor?: string | null;
  tier?: PostTier;
  simulateError?: boolean;
};

export const getPosts = async ({
  limit = 10,
  cursor = null,
  tier,
  simulateError,
}: GetPostsParams): Promise<PostsResponseDto> =>
  apiGet<PostsResponseDto>('/posts', {
    limit,
    cursor,
    tier,
    simulate_error: simulateError,
  });

