import { Metadata } from 'next';

import LoginPage from '@/app/(auth)/login/containers/LoginPage';

export const metadata: Metadata = {
  title: 'Login',
  description:
    'Log in to TalkNow and connect instantly. Access your TalkNow account to continue chatting, sharing, and staying connected with your circle.',
  keywords: [
    'Login',
    'Sign in',
    'TalkNow login',
    'Chat login',
    'Social app login',
    'Account access',
    'Login page',
  ],
};

export default function Login() {
  return <LoginPage />;
}
