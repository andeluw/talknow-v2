import { Metadata } from 'next';

import RegisterPage from '@/app/(auth)/register/containers/RegisterPage';

export const metadata: Metadata = {
  title: 'Register',
};

export default function Register() {
  return <RegisterPage />;
}
