import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { z } from 'zod';

import api from '@/lib/api';

import { registerSchema } from '@/validations/register';

import { ApiError, ApiResponse } from '@/types/api';
import { User } from '@/types/entities/user';

export const useRegisterMutation = () => {
  const router = useRouter();
  const { mutate, isPending } = useMutation<
    ApiResponse<User>,
    AxiosError<ApiError>,
    z.infer<typeof registerSchema>
  >({
    mutationFn: async (data: z.infer<typeof registerSchema>) => {
      const res = await api.post<ApiResponse<User>>('/user/register', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Registration successful!');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.response?.data.error || 'Registration failed!');
    },
  });

  return { mutate, isPending };
};
