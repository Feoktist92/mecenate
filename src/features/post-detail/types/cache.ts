import type { InfiniteData } from '@tanstack/react-query';

import type {
  CommentsResponseDto,
  PostsResponseDto,
} from '@/entities/post/types';

export type PostCommentsInfiniteData = InfiniteData<
  CommentsResponseDto,
  string | null
>;

export type FeedInfiniteData = InfiniteData<PostsResponseDto, string | null>;
