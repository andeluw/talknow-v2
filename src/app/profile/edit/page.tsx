import { Metadata } from 'next';
import { Suspense } from 'react';

import Loading from '@/components/Loading';

import EditProfilePage from '@/app/profile/edit/containers/EditProfilePage';

export const metadata: Metadata = {
  title: 'Edit Profile',
  description:
    'Update your personal information, bio, and profile photo on TalkNow. Make your profile reflect who you are and connect with others more easily.',
  keywords: [
    'Edit profile',
    'Update profile',
    'TalkNow profile',
    'Change profile photo',
    'Edit bio',
    'Social app profile',
    'User profile edit',
  ],
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <EditProfilePage />
    </Suspense>
  );
}
