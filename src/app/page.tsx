import { Metadata } from 'next';
import { Suspense } from 'react';

import Loading from '@/components/Loading';

import Homepage from '@/app/(homepage)/containers/Homepage';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Welcome to TalkNow! Share your thoughts, ideas, and updates with the world. Stay connected and engaged with real-time posts from your circle.',
  keywords: [
    'TalkNow',
    'Posts',
    'Social feed',
    'Share thoughts',
    'Real-time updates',
    'Social media',
    'Connect',
    'Trending posts',
  ],
};

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <Homepage />
    </Suspense>
  );
}
