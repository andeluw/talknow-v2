import { useInfiniteQuery } from '@tanstack/react-query';

import api from '@/lib/api';

import { PaginatedApiResponse } from '@/types/api';
import { PostWithReplies } from '@/types/entities/post';

export default function useGetDetailPost({ id }: { id: number }) {
  const {
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isError,
    refetch: refetchPosts,
  } = useInfiniteQuery({
    queryKey: ['posts', 'infinite', id],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<PaginatedApiResponse<PostWithReplies>>(
        `/post/${id}`,
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
      return lastPage.meta.page < lastPage.meta.max_page
        ? lastPage.meta.page + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
    // cacheTime: 0,           // (optional) disable caching completely
  });

  return {
    posts: data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isError,
    refetchPosts,
  };
}
