import { Metadata } from 'next';

import ProfilePage from '@/app/profile/[username]/containers/ProfilePage';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Profile page',
};

export default function Page() {
  return <ProfilePage />;
}
