import { Metadata } from 'next';

import PostDetailPage from '@/app/post/[id]/containers/PostDetailPage';

export const metadata: Metadata = {
  title: 'Post Details',
  description:
    'Explore detailed posts on TalkNow. Read, share your thoughts, and engage with the community on exciting discussions.',
  keywords: [
    'Post details',
    'TalkNow post',
    'View post',
    'Social app posts',
    'Text-based posts',
    'Post engagement',
    'Online discussions',
  ],
};

export default function Page() {
  return <PostDetailPage />;
}
