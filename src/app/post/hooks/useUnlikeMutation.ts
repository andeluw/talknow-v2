import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

import api from '@/lib/api';
import { getFromLocalStorage } from '@/lib/helper';

import { ApiError, ApiResponse } from '@/types/api';

export const useUnlikePostMutation = ({
  setLiked,
  username,
  setTotalLikes,
}: {
  setLiked: React.Dispatch<React.SetStateAction<boolean>>;
  username: string | null;
  setTotalLikes?: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { mutate, isPending } = useMutation<
    AxiosResponse<ApiResponse<null>>,
    AxiosError<ApiError>,
    { post_id: number }
  >({
    mutationFn: async ({ post_id }) => {
      return await api.delete<ApiResponse<null>>(`/likes/${post_id}`);
    },
    onSuccess: (_, variables) => {
      // toast.success('Post unliked.');
      setLiked(false);
      if (setTotalLikes) {
        setTotalLikes((prev) => prev - 1);
      }

      if (username === null) {
        toast.error('User is not logged in.');
        return;
      }
      const postId = variables.post_id;

      let likedPosts: { username: string; postIds: number[] }[] = [];

      try {
        likedPosts = JSON.parse(getFromLocalStorage('likedPosts') || '[]');
      } catch {
        likedPosts = [];
      }

      const userEntry = likedPosts.find((entry) => entry.username === username);

      if (userEntry) {
        const index = userEntry.postIds.indexOf(postId);
        if (index !== -1) {
          userEntry.postIds.splice(index, 1);
        }

        if (userEntry.postIds.length === 0) {
          likedPosts = likedPosts.filter(
            (entry) => entry.username !== username
          );
        }
      }

      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    },
    onError: (error) => {
      toast.error(error.response?.data.error || 'Something went wrong.');
    },
  });

  return { mutate, isPending };
};
