import { Metadata } from 'next';
import { Suspense } from 'react';

import Loading from '@/components/Loading';

import Homepage from '@/app/(homepage)/containers/Homepage';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Homepage',
};

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <Homepage />
    </Suspense>
  );
}
