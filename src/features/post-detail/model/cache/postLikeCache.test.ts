import {
  applyPostLikeStateToPostDetail,
  clearPostLikeInteractionGuards,
  consumePostLikeInteractionGuard,
  getOptimisticPostLikeState,
  isPostLikeInteractionGuarded,
  markPostLikeInteraction,
} from './postLikeCache';
import {
  createTestPostDetail,
  TEST_POST_ID,
} from '../testing/postDetailTestFactories';

describe('postLikeCache helpers', () => {
  afterEach(() => {
    clearPostLikeInteractionGuards();
    jest.restoreAllMocks();
  });

  it('computes optimistic count from the interaction base state', () => {
    expect(
      getOptimisticPostLikeState({ isLiked: false, likesCount: 10 }, true)
    ).toEqual({
      isLiked: true,
      likesCount: 11,
    });
    expect(
      getOptimisticPostLikeState({ isLiked: false, likesCount: 10 }, false)
    ).toEqual({
      isLiked: false,
      likesCount: 10,
    });
    expect(
      getOptimisticPostLikeState({ isLiked: true, likesCount: 10 }, false)
    ).toEqual({
      isLiked: false,
      likesCount: 9,
    });
    expect(
      getOptimisticPostLikeState({ isLiked: true, likesCount: 0 }, false)
    ).toEqual({
      isLiked: false,
      likesCount: 0,
    });
  });

  it('applies a resolved like state to post detail cache', () => {
    const updated = applyPostLikeStateToPostDetail(createTestPostDetail(), {
      isLiked: true,
      likesCount: 42,
    });

    expect(updated?.data.post.isLiked).toBe(true);
    expect(updated?.data.post.likesCount).toBe(42);
  });

  it('consumes one realtime guard per local like interaction', () => {
    markPostLikeInteraction(TEST_POST_ID);
    markPostLikeInteraction(TEST_POST_ID);

    expect(isPostLikeInteractionGuarded(TEST_POST_ID)).toBe(true);
    expect(consumePostLikeInteractionGuard(TEST_POST_ID)).toBe(true);
    expect(isPostLikeInteractionGuarded(TEST_POST_ID)).toBe(true);
    expect(consumePostLikeInteractionGuard(TEST_POST_ID)).toBe(true);
    expect(isPostLikeInteractionGuarded(TEST_POST_ID)).toBe(false);
    expect(consumePostLikeInteractionGuard(TEST_POST_ID)).toBe(false);
  });
});
