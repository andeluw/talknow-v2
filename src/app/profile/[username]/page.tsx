import { Metadata } from 'next';

import ProfilePage from '@/app/profile/[username]/containers/ProfilePage';

export const metadata: Metadata = {
  title: 'Profile',
  description:
    'View and edit your TalkNow profile. Share your thoughts, explore your posts, and engage with your community on TalkNow.',
  keywords: [
    'Profile',
    'TalkNow profile',
    'User profile',
    'Edit profile',
    'View profile',
    'Social app profile',
    'Personal profile',
  ],
};

export default function Page() {
  return <ProfilePage />;
}
