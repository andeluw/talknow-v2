import { Metadata } from 'next';

import EditProfilePage from '@/app/profile/edit/containers/EditProfilePage';

export const metadata: Metadata = {
  title: 'Edit Profile',
  description: 'Edit your profile information',
  openGraph: {
    title: 'Edit Profile',
    description: 'Edit your profile information',
  },
  twitter: {
    title: 'Edit Profile',
    description: 'Edit your profile information',
  },
};

export default function Page() {
  return <EditProfilePage />;
}
