import { Metadata } from 'next';

import PostDetailPage from '@/app/post/[id]/containers/PostDetailPage';

export const metadata: Metadata = {
  title: 'Post Detail',
  description: 'Post detail page',
};

export default function Page() {
  return <PostDetailPage />;
}
