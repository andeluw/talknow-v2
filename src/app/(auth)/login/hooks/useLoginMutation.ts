import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { z } from 'zod';

import api from '@/lib/api';
import { setToken } from '@/lib/cookies';

import useAuthStore from '@/stores/useAuthStore';

import { loginSchema } from '@/validations/login';

import { ApiError, ApiResponse } from '@/types/api';
import { User, WithToken } from '@/types/entities/user';

export const useLoginMutation = () => {
  const login = useAuthStore.useLogin();
  const router = useRouter();

  const { mutate, isPending } = useMutation<
    ApiResponse<WithToken>,
    AxiosError<ApiError>,
    z.infer<typeof loginSchema>
  >({
    mutationFn: async (data: z.infer<typeof loginSchema>) => {
      const res = await api.post<ApiResponse<WithToken>>('/user/login', data);
      const { token } = res.data.data;
      setToken(token);

      const user = await api.get<ApiResponse<User>>('/user/me');
      if (user) login({ ...user.data.data, token: token });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Login successful!');
      router.push('/');
    },
    onError: (error) => {
      toast.error(error.response?.data.error || 'Login failed!');
    },
  });

  return {
    mutate,
    isPending,
  };
};
