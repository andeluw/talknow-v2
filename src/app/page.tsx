import { Metadata } from 'next';

import Homepage from '@/app/(homepage)/containers/Homepage';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Homepage',
};

export default function Home() {
  return <Homepage />;
}
