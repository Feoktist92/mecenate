export type PostTier = 'free' | 'paid';

type AuthorDto = {
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

export type PostDetailResponseDto = {
  ok: boolean;
  data: {
    post: PostDto;
  };
};

export type TogglePostLikeResponseDto = {
  ok: boolean;
  data: {
    isLiked: boolean;
    likesCount: number;
  };
};

export type CommentDto = {
  id: string;
  postId: string;
  author: AuthorDto;
  text: string;
  createdAt: string;
  likesCount?: number;
  isLiked?: boolean;
};

export type CommentsResponseDto = {
  ok: boolean;
  data: {
    comments: CommentDto[];
    nextCursor: string | null;
    hasMore: boolean;
  };
};

export type CreateCommentResponseDto = {
  ok: boolean;
  data: {
    comment: CommentDto;
  };
};
