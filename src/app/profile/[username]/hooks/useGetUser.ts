import { useQuery } from '@tanstack/react-query';

import api from '@/lib/api';

import { ApiResponse } from '@/types/api';
import { User } from '@/types/entities/user';

export default function useGetUser({ username }: { username: string }) {
  const {
    data,
    isLoading,
    error,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ['user', username],
    queryFn: async () => {
      const res = await api.get<ApiResponse<User>>(`/user/${username}`);
      return res.data.data;
    },
  });

  return {
    fetchedUser: data,
    isLoading,
    error,
    refetchUser,
  };
}
