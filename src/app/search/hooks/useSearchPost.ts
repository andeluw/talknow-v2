import { useInfiniteQuery } from '@tanstack/react-query';

import api from '@/lib/api';

import { PaginatedApiResponse } from '@/types/api';
import { Post } from '@/types/entities/post';

export default function useSearchPost({
  searchQuery,
}: {
  searchQuery: string;
}) {
  const {
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isError,
    refetch: refetchPosts,
  } = useInfiniteQuery({
    queryKey: ['posts', 'search', searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<PaginatedApiResponse<Post[]>>('/post', {
        params: {
          page: pageParam,
          per_page: 10,
          search: searchQuery,
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
