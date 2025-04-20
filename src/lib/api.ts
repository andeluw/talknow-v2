import axios, { AxiosError } from 'axios';
import { GetServerSidePropsContext } from 'next';
import Cookies from 'universal-cookie';

import { getToken } from '@/lib/cookies';

import { JWT_TOKEN_KEY } from '@/constant/common';

import { UninterceptedApiError } from '@/types/api';

const isServer = () => {
  return typeof window === 'undefined';
};

let context = <GetServerSidePropsContext>{};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

api.defaults.withCredentials = false;

api.interceptors.request.use(function (config) {
  if (config.headers) {
    let token: string | undefined;

    if (isServer()) {
      if (!context) {
        throw new Error(
          'Api Context not found. You must call `setApiContext(context)` before calling api on server-side'
        );
      }

      const cookies = new Cookies(context.req?.headers.cookie);
      token = cookies.get(JWT_TOKEN_KEY);
    } else {
      token = getToken();
    }
    config.headers.Authorization = token ? `Bearer ${token}` : '';
  }

  return config;
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  (error: AxiosError<UninterceptedApiError>) => {
    if (error.response?.data.message) {
      return Promise.reject({
        ...error,
        response: {
          ...error.response,
          data: {
            ...error.response.data,
            message:
              typeof error.response.data.message === 'string'
                ? error.response.data.message
                : Object.values(error.response.data.message)[0][0],
          },
        },
      });
    }
    return Promise.reject(error);
  }
);

export const setApiContext = (_context: GetServerSidePropsContext) => {
  context = _context;
  return;
};

export default api;
