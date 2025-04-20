import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import api from '@/lib/api';

import { ApiError, ApiResponse } from '@/types/api';

export const useDeletePostMutation = () => {
  const router = useRouter();
  const { mutate, isPending } = useMutation<
    AxiosResponse<ApiResponse<null>>,
    AxiosError<ApiError>,
    { post_id: number }
  >({
    mutationFn: async ({ post_id }) => {
      return await api.delete<ApiResponse<null>>(`/post/${post_id}`);
    },
    onSuccess: () => {
      toast.success('Post deleted.');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.response?.data.error || 'Something went wrong.');
    },
  });

  return { mutate, isPending };
};
