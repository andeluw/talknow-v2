import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import api from '@/lib/api';

import { ApiError, ApiResponse } from '@/types/api';
import { User } from '@/types/entities/user';

export const useEditProfileMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    ApiResponse<User>,
    AxiosError<ApiError>,
    { name: string | null; bio: string | null; image: File | null }
  >({
    mutationFn: async (data) => {
      const formData = new FormData();

      if (data.name) formData.append('name', data.name);
      if (data.bio) formData.append('bio', data.bio);
      if (data.image) formData.append('image', data.image);

      const res = await api.patch<ApiResponse<User>>('/user/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Your changes have been saved.');
      setTimeout(() => {
        router.push(`/profile/${data.data.username}`);
      }, 1000);
    },
    onError: (error) => {
      toast.error(error.response?.data.error || 'Something went wrong.');
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['user', data?.data.username],
      });
    },
  });

  return { mutate, isPending };
};
