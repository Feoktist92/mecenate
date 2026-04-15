export type PostTier = 'free' | 'paid';

export type AuthorDto = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio?: string;
  subscribersCount?: number;
  isVerified?: boolean;
};

export type PostDto = {
  id: string;
  author: AuthorDto;
  title: string;
  body: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tier: PostTier;
  createdAt: string;
};

export type PostsResponseDto = {
  ok: boolean;
  data: {
    posts: PostDto[];
    nextCursor: string | null;
    hasMore: boolean;
  };
};
