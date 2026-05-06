export type FeedUiStore = {
  expandedPostIds: Set<string>;
  isExpanded: (postId: string) => boolean;
  toggleExpanded: (postId: string) => void;
};

export const createFeedUiStore = (): FeedUiStore => ({
  expandedPostIds: new Set<string>(),

  isExpanded(postId: string): boolean {
    return this.expandedPostIds.has(postId);
  },

  toggleExpanded(postId: string): void {
    if (this.expandedPostIds.has(postId)) {
      this.expandedPostIds.delete(postId);
      return;
    }

    this.expandedPostIds.add(postId);
  },
});
