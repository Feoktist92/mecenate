import React from 'react';

import type { CommentDto } from '@/entities/post/types';
import { UiComment } from '@/shared/ui/kit/UiComment';

type PostCommentItemProps = {
  comment: CommentDto;
};

export const PostCommentItem = ({ comment }: PostCommentItemProps) => (
  <UiComment
    authorName={comment.author.displayName}
    avatarUrl={comment.author.avatarUrl}
    text={comment.text}
    likesCount={comment.likesCount ?? 0}
  />
);
