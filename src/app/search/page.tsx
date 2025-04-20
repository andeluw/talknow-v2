import { Metadata } from 'next';
import { Suspense } from 'react';

import Loading from '@/components/Loading';

import SearchPage from '@/app/search/containers/SearchPage';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search page',
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchPage />
    </Suspense>
  );
}
