import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

import api from '@/lib/api';

import { ApiError, ApiResponse, PaginatedApiResponse } from '@/types/api';
import { Post, PostWithReplies } from '@/types/entities/post';

export const useDeletePostMutation = ({
  parent_id,
  username,
}: {
  parent_id: number | null;
  username: string | null;
}) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    AxiosResponse<ApiResponse<null>>,
    AxiosError<ApiError>,
    { post_id: number }
  >({
    mutationFn: async ({ post_id }) => {
      return await api.delete<ApiResponse<null>>(`/post/${post_id}`);
    },
    onSuccess: (_response, variables) => {
      const { post_id } = variables;
      toast.success('Post deleted.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(['posts'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: PaginatedApiResponse<Post[]>) => ({
            ...page,
            data: page.data.filter((post: Post) => post.id !== post_id),
          })),
        };
      });

      queryClient.setQueryData(
        ['posts', 'detail', parent_id],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages
              .map((page: PaginatedApiResponse<PostWithReplies>) => {
                if (page.data.id === post_id) {
                  return null;
                }

                const filteredReplies = page.data.replies?.filter(
                  (reply: Post) => reply.id !== post_id
                );

                return {
                  ...page,
                  data: {
                    ...page.data,
                    replies: filteredReplies,
                  },
                };
              })
              .filter(Boolean),
          };
        }
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(['posts', 'detail', post_id], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages
            .map((page: PaginatedApiResponse<PostWithReplies>) => {
              if (page.data.id === post_id) {
                return null;
              }

              const filteredReplies = page.data.replies?.filter(
                (reply: Post) => reply.id !== post_id
              );

              return {
                ...page,
                data: {
                  ...page.data,
                  replies: filteredReplies,
                },
              };
            })
            .filter(Boolean),
        };
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(['posts', 'user', username], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: PaginatedApiResponse<Post[]>) => ({
            ...page,
            data: page.data.filter((post: Post) => post.id !== post_id),
          })),
        };
      });
    },
    onError: (error) => {
      toast.error(error.response?.data.error || 'Something went wrong.');
    },
    onSettled: (_response, _error, variables) => {
      const post_id = variables?.post_id ?? 0;
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({
        queryKey: ['posts', 'detail', parent_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['posts', 'detail', post_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['posts', 'user', username],
      });
    },
  });

  return { mutate, isPending };
};
