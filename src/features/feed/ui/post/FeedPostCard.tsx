import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet } from 'react-native';

import { PostDto } from '@/entities/post/types';
import { PostActions } from '@/entities/post/ui/PostActions';
import { PostBlock } from '@/entities/post/ui/PostBlock';
import {
  isFeedPostLocked,
  shouldShowFeedPostActions,
} from '@/features/feed/model/selectors/feedPostSelectors';
import type { FeedUiStore } from '@/features/feed/model/store/feedUiStore';
import { spacing } from '@/shared/theme/tokens';
import { UiCard } from '@/shared/ui/kit/UiCard';

import { FeedPostErrorCard } from './FeedPostErrorCard';

type FeedPostCardProps = {
  post: PostDto;
  store: FeedUiStore;
};

export const FeedPostCard = observer(({ post, store }: FeedPostCardProps) => {
  const [coverFailed, setCoverFailed] = React.useState(false);
  const isLocked = isFeedPostLocked(post);
  const showActions = shouldShowFeedPostActions(post);

  if (coverFailed) {
    return (
      <FeedPostErrorCard
        authorName={post.author.displayName}
        avatarUrl={post.author.avatarUrl}
        onRetry={() => setCoverFailed(false)}
      />
    );
  }

  return (
    <UiCard style={styles.card}>
      <PostBlock
        post={post}
        contentMode={{
          type: 'preview',
          isExpanded: store.isExpanded(post.id),
          onToggleExpand: () => store.toggleExpanded(post.id),
        }}
        isContentLocked={isLocked}
        onCoverError={() => setCoverFailed(true)}
        actions={
          showActions ? (
            <PostActions
              likesCount={post.likesCount}
              commentsCount={post.commentsCount}
              isLiked={post.isLiked}
            />
          ) : null
        }
      />
    </UiCard>
  );
});

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.md,
  },
});
