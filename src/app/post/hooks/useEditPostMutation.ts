import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { z } from 'zod';

import api from '@/lib/api';

import { postSchema } from '@/validations/post';

import { ApiError, ApiResponse, PaginatedApiResponse } from '@/types/api';
import { Post, PostWithReplies } from '@/types/entities/post';

export const useEditPostMutation = ({ post_id }: { post_id: number }) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    ApiResponse<Post>,
    AxiosError<ApiError>,
    z.infer<typeof postSchema>
  >({
    mutationFn: async (data: z.infer<typeof postSchema>) => {
      const res = await api.put<ApiResponse<Post>>(`/post/${post_id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Post updated successfully!');

      //#region //*=========== Update in Main ===========
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(['posts'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: PaginatedApiResponse<Post[]>) => ({
            ...page,
            data: page.data.map((post: Post) =>
              post.id === post_id ? { ...post, text: data.data.text } : post
            ),
          })),
        };
      });
      //#endregion  //*======== Update in Main ===========

      //#region //*=========== Update in Detail Parent ID ===========
      queryClient.setQueryData(
        ['posts', 'detail', data.data.parent_id],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map(
              (page: PaginatedApiResponse<PostWithReplies>) => ({
                ...page,
                data:
                  page.data.id === data.data.id
                    ? { ...page.data, text: data.data.text }
                    : {
                        ...page.data,
                        replies: page.data.replies?.map((reply: Post) =>
                          reply.id === data.data.id
                            ? { ...reply, text: data.data.text }
                            : reply
                        ),
                      },
              })
            ),
          };
        }
      );
      //#endregion  //*======== Update in Detail Parent ID ===========

      //#region //*=========== Update in Detail ID ===========
      queryClient.setQueryData(
        ['posts', 'detail', data.data.id],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map(
              (page: PaginatedApiResponse<PostWithReplies>) => ({
                ...page,
                data:
                  page.data.id === data.data.id
                    ? { ...page.data, text: data.data.text }
                    : {
                        ...page.data,
                        replies: page.data.replies?.map((reply: Post) =>
                          reply.id === data.data.id
                            ? { ...reply, text: data.data.text }
                            : reply
                        ),
                      },
              })
            ),
          };
        }
      );
      //#endregion  //*======== Update in Detail ID ===========

      //#region //*=========== Update in User ===========
      queryClient.setQueryData(
        ['posts', 'user', data.data.user.username],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: PaginatedApiResponse<Post[]>) => ({
              ...page,
              data: page.data.map((post: Post) =>
                post.id === post_id ? { ...post, text: data.data.text } : post
              ),
            })),
          };
        }
      );
      //#endregion  //*======== Update in User ===========
    },
    onError: (error) => {
      toast.error(error.response?.data.error || 'Something went wrong.');
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({
        queryKey: ['posts', 'detail', data?.data.parent_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['posts', 'detail', data?.data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['posts', 'user', data?.data.user.username],
      });
    },
  });

  return { mutate, isPending };
};
