import { Metadata } from 'next';

import SearchPage from '@/app/search/containers/SearchPage';

export const metadata: Metadata = {
  title: 'Search',
  description:
    'Search and discover posts, users, and content on TalkNow. Find what matters most to you and connect with others in your community.',
  keywords: [
    'Search',
    'Find posts',
    'Find users',
    'TalkNow search',
    'Social app search',
    'Content discovery',
    'Search page',
  ],
};

export default function Page() {
  return <SearchPage />;
}
