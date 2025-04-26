import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

import api from '@/lib/api';

import { ApiError, ApiResponse } from '@/types/api';

export const useLikePostMutation = ({
  username,
}: {
  username: string | null;
}) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    AxiosResponse<ApiResponse<null>>,
    AxiosError<ApiError>,
    { post_id: number }
  >({
    mutationFn: async ({ post_id }) => {
      return await api.put<ApiResponse<null>>(`/likes/${post_id}`);
    },
    onSuccess: (_, variables) => {
      // toast.success('Post liked!');
      if (username === null) {
        toast.error('User is not logged in.');
        return;
      }

      const postId = variables.post_id;

      let likedPosts: { username: string; postIds: number[] }[] = [];

      try {
        likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      } catch {
        likedPosts = [];
      }

      let userEntry = likedPosts.find((entry) => entry.username === username);

      if (!userEntry) {
        userEntry = { username, postIds: [] };
        likedPosts.push(userEntry);
      }

      const index = userEntry.postIds.indexOf(postId);
      if (index === -1) {
        userEntry.postIds.push(postId);
      } else {
        userEntry.postIds.splice(index, 1);
      }

      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    },
    onError: (error) => {
      toast.error(error.response?.data.error || 'Something went wrong.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return { mutate, isPending };
};
