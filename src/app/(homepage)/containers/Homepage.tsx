'use client';
import { Loader } from 'lucide-react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Button from '@/components/buttons/Button';
import withAuth from '@/components/hoc/withAuth';
import Typography from '@/components/Typography';

import useAuthStore from '@/stores/useAuthStore';

import useGetAllPost from '@/app/(homepage)/hooks/useGetAllPost';
import CreatePostModal from '@/app/post/components/CreatePostModal';
import PostItem from '@/app/post/components/PostItem';
import ProfileImage from '@/app/profile/components/ProfileImage';
import MainLayout from '@/layouts/MainLayout';

export default withAuth(Homepage, 'public');
function Homepage() {
  const user = useAuthStore.useUser();
  const {
    posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetchPosts,
  } = useGetAllPost();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <MainLayout>
      {user && (
        <CreatePostModal>
          <div className='flex items-center gap-3 w-full rounded-t-xl border-[1.5px] border-b-0 border-surface-muted bg-surface-alt py-5 px-5 md:px-8'>
            <div className='flex items-center gap-6 w-full'>
              <ProfileImage path={user.image_url} />
              <Typography variant='p' className='text-muted-foreground'>
                What's on your mind?
              </Typography>
            </div>
            <Button variant='light' size='base'>
              Post
            </Button>
          </div>
        </CreatePostModal>
      )}

      {isLoading && !posts
        ? [...Array(3)].map((_, idx) => <PostItem key={idx} isLoading={true} />)
        : posts?.pages
            .flatMap((page) => page.data)
            .map(
              (post) =>
                !post.is_deleted && (
                  <PostItem
                    isLoading={false}
                    key={post.id}
                    post={post}
                    // isLink={true}
                    refetchPosts={refetchPosts}
                  />
                )
            )}

      <div ref={ref} className='h-10'></div>

      {isFetchingNextPage && (
        <Loader className='animate-spin text-muted-foreground mt-4' />
      )}
    </MainLayout>
  );
}
