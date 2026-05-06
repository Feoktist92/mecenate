export const postDetailKeys = {
  detail: (postId: string) => ['post-detail', postId] as const,
  comments: (postId: string) => ['post-comments', postId] as const,
  likeMutation: (postId: string) => ['post-like', postId] as const,
};
