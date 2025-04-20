import { useInfiniteQuery } from '@tanstack/react-query';

import api from '@/lib/api';

import { PaginatedApiResponse } from '@/types/api';
import { Post } from '@/types/entities/post';

export default function useGetAllPost() {
  const {
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isError,
    refetch: refetchPosts,
  } = useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<PaginatedApiResponse<Post[]>>('/post', {
        params: {
          page: pageParam,
          per_page: 10,
        },
      });

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
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
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
