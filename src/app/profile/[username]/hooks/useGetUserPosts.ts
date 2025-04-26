import { useInfiniteQuery } from '@tanstack/react-query';

import api from '@/lib/api';

import { PaginatedApiResponse } from '@/types/api';
import { Post } from '@/types/entities/post';

export default function useGetUserPosts({ username }: { username: string }) {
  const {
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isLoading,
    error,
    refetch: refetchPosts,
  } = useInfiniteQuery({
    queryKey: ['posts', 'user', username],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<PaginatedApiResponse<Post[]>>(
        `/user/${username}/posts`,
        {
          params: {
            page: pageParam,
            per_page: 10,
          },
        }
      );

      return res.data;
    },
    getNextPageParam: (lastPage) => {
      const nextPage =
        lastPage.meta.page < lastPage.meta.max_page
          ? lastPage.meta.page + 1
          : undefined;
      return nextPage;
    },
    initialPageParam: 1,
  });

  return {
    posts: data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isLoading,
    error,
    refetchPosts,
  };
}
