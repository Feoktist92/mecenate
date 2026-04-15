import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { PostDto } from '@/entities/post/types';
import { PostActionPill } from '@/entities/post/ui/PostActionPill';
import { PostHeader } from '@/entities/post/ui/PostHeader';
import type { FeedUiStore } from '@/features/feed/model/feedUiStore';
import { spacing } from '@/shared/theme/tokens';
import { UiCard } from '@/shared/ui/kit/UiCard';

import { FeedPostContent } from './FeedPostContent';
import { FeedPostMedia } from './FeedPostMedia';
import { FeedPostErrorCard } from './FeedPostErrorCard';

type FeedPostCardProps = {
  post: PostDto;
  store: FeedUiStore;
};

export const FeedPostCard = observer(({ post, store }: FeedPostCardProps) => {
  const [coverFailed, setCoverFailed] = React.useState(false);
  const variant = post.tier;
  const previewText = post.preview || post.body || '';

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
      <PostHeader authorName={post.author.displayName} avatarUrl={post.author.avatarUrl} />

      <View style={styles.mediaAndTags}>
        <FeedPostMedia variant={variant} coverUrl={post.coverUrl} onError={() => setCoverFailed(true)} />
        <FeedPostContent
          variant={variant}
          title={post.title}
          previewText={previewText}
          isExpanded={store.isExpanded(post.id)}
          onToggleExpand={() => store.toggleExpanded(post.id)}
        />
      </View>

      {variant === 'free' ? (
        <View style={styles.actionsRow}>
          <PostActionPill type="like" count={post.likesCount} active={post.isLiked} />
          <PostActionPill type="comment" count={post.commentsCount} />
        </View>
      ) : null}
    </UiCard>
  );
});

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  mediaAndTags: {
    alignSelf: 'stretch',
    gap: spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
});
