import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { z } from 'zod';

import api from '@/lib/api';

import { postSchema } from '@/validations/post';

import { ApiError, ApiResponse, PaginatedApiResponse } from '@/types/api';
import { Post } from '@/types/entities/post';

export const useCreatePostMutation = () => {
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
      toast.success('Post created successfully!');

      //#region //*=========== Main ===========
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(['posts'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map(
            (page: PaginatedApiResponse<Post[]>, index: number) =>
              index === 0
                ? {
                    ...page,
                    data: [
                      { ...data.data },
                      ...page.data.filter((post: Post) => !post.is_deleted),
                    ],
                  }
                : page
          ),
        };
      });
      //#endregion  //*======== Main ===========

      //#region //*=========== User Profile ===========
      queryClient.setQueryData(
        ['posts', 'user', data.data.user.username],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map(
              (page: PaginatedApiResponse<Post[]>, index: number) =>
                index === 0
                  ? {
                      ...page,
                      data: [
                        { ...data.data },
                        ...page.data.filter((post: Post) => !post.is_deleted),
                      ],
                    }
                  : page
            ),
          };
        }
      );
      //#endregion  //*======== User Profile ===========
    },
    onError: (error) => {
      toast.error(error.response?.data.error || 'Something went wrong.');
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({
        queryKey: ['posts', 'user', data?.data.user.username],
      });
    },
  });

  return { mutate, isPending };
};
