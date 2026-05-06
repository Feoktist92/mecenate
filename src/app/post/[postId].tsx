import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PostDetailScreen } from '@/features/post-detail/ui/detail/PostDetailScreen';
import { colors } from '@/shared/theme/tokens';

const resolvePostIdParam = (postId: string | string[] | undefined): string =>
  Array.isArray(postId) ? (postId[0] ?? '') : (postId ?? '');

export default function PostDetailRoute() {
  const { postId } = useLocalSearchParams<{ postId?: string | string[] }>();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <PostDetailScreen postId={resolvePostIdParam(postId)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
});
