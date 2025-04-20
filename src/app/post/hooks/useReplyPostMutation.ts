import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { z } from 'zod';

import api from '@/lib/api';

import { postSchema } from '@/validations/post';

import { ApiError, ApiResponse } from '@/types/api';
import { Post } from '@/types/entities/post';

export const useReplyPostMutation = () => {
  const router = useRouter();
  const { mutate, isPending } = useMutation<
    ApiResponse<Post>,
    AxiosError<ApiError>,
    z.infer<typeof postSchema>
  >({
    mutationFn: async (data: z.infer<typeof postSchema>) => {
      const res = await api.post<ApiResponse<Post>>('/post', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Sent! Your reply has been posted.');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.response?.data.error || 'Something went wrong.');
    },
  });

  return { mutate, isPending };
};
