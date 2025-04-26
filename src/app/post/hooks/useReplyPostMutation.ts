import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { z } from 'zod';

import api from '@/lib/api';

import { postSchema } from '@/validations/post';

import { ApiError, ApiResponse, PaginatedApiResponse } from '@/types/api';
import { Post, PostWithReplies } from '@/types/entities/post';

export const useReplyPostMutation = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    ApiResponse<Post>,
    AxiosError<ApiError>,
    z.infer<typeof postSchema>
  >({
    mutationFn: async (data: z.infer<typeof postSchema>) => {
      const res = await api.post<ApiResponse<Post>>('/post', data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Sent! Your reply has been posted.');
      queryClient.setQueryData(
        ['posts', 'detail', data.data.parent_id],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map(
              (page: PaginatedApiResponse<PostWithReplies>, index: number) =>
                index === 0
                  ? {
                      ...page,
                      data: {
                        ...page.data,
                        replies: [
                          { ...data.data, replies: [] },
                          ...(page.data.replies?.filter(
                            (reply: Post) => !reply.is_deleted
                          ) ?? []),
                        ],
                      },
                    }
                  : page
            ),
          };
        }
      );
    },
    onError: (error) => {
      toast.error(error.response?.data.error || 'Something went wrong.');
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['posts', 'detail', data?.data.parent_id],
      });
    },
  });

  return { mutate, isPending };
};
