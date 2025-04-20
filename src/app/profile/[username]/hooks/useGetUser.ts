import { useQuery } from '@tanstack/react-query';

import api from '@/lib/api';

import { ApiResponse } from '@/types/api';
import { User } from '@/types/entities/user';

export default function useGetUser({ username }: { username: string }) {
  const {
    data,
    isLoading,
    isError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ['user', username],
    queryFn: async () => {
      const res = await api.get<ApiResponse<User>>(`/user/${username}`);
      return res.data.data;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return {
    fetchedUser: data,
    isLoading,
    isError,
    refetchUser,
  };
}
