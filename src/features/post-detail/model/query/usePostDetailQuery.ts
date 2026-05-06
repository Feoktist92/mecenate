import { useQuery } from '@tanstack/react-query';

import { getPostById } from '@/features/post-detail/api/getPostById';

import { postDetailKeys } from './queryKeys';

export const usePostDetailQuery = (postId: string) =>
  useQuery({
    queryKey: postDetailKeys.detail(postId),
    queryFn: () => getPostById(postId),
    enabled: Boolean(postId),
  });
