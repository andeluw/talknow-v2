import { Metadata } from 'next';

import RegisterPage from '@/app/(auth)/register/containers/RegisterPage';

export const metadata: Metadata = {
  title: 'Register',
  description:
    'Create your TalkNow account and start connecting instantly. Sign up to chat, share, and stay in touch with your friends and community.',
  keywords: [
    'Register',
    'Sign up',
    'TalkNow register',
    'Create account',
    'Social app registration',
    'Join TalkNow',
    'Account creation',
  ],
};

export default function Register() {
  return <RegisterPage />;
}
