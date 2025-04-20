import { Metadata } from 'next';

import SearchPage from '@/app/search/containers/SearchPage';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search page',
};

export default function Page() {
  return <SearchPage />;
}
