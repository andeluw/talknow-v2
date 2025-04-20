'use client';
import { Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { copyToClipboard } from '@/lib/helper';

import Button from '@/components/buttons/Button';
import ButtonLink from '@/components/links/ButtonLink';
import Typography from '@/components/Typography';

import useAuthStore from '@/stores/useAuthStore';

import PostItem from '@/app/post/components/PostItem';
import ProfileHeaderSkeleton from '@/app/profile/[username]/components/ProfileHeaderSkeleton';
import useGetUser from '@/app/profile/[username]/hooks/useGetUser';
import useGetUserPosts from '@/app/profile/[username]/hooks/useGetUserPosts';
import ProfileImage from '@/app/profile/components/ProfileImage';
import MainLayout from '@/layouts/MainLayout';

export default function ProfilePage() {
  const user = useAuthStore.useUser();
  const { username } = useParams();
  const { fetchedUser, isLoading: pendingUser } = useGetUser({
    username: username as string,
  });

  const {
    posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: pendingPosts,
    refetchPosts,
  } = useGetUserPosts({
    username: username as string,
  });
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <MainLayout>
      {pendingUser ? (
        <ProfileHeaderSkeleton />
      ) : (
        <div
          className='flex flex-col items-center justify-center w-full px-8 md:px-16 py-8 mb-4
      '
        >
          <ProfileImage
            path={fetchedUser?.image_url as string | null}
            className='w-16 h-16'
          />
          <Typography
            variant='h5'
            className='font-semibold text-primary md:text-2xl mt-2 text-center'
          >
            @{fetchedUser?.username}
          </Typography>
          <Typography
            variant='bt'
            className='font-medium text-muted-foreground mt-1 text-center'
          >
            {fetchedUser?.name}
          </Typography>
          <Typography variant='bt' className='font-medium mt-2 text-center'>
            {fetchedUser?.bio?.trim()}
          </Typography>
          <div className='flex gap-2 mt-8'>
            {fetchedUser?.username === user?.username && (
              <ButtonLink href='/profile/edit' variant='light'>
                Edit Profile
              </ButtonLink>
            )}
            <Button
              variant='outline-2'
              onClick={() =>
                copyToClipboard({
                  text: `https://talknow-rpl-v2.vercel.app/profile/${fetchedUser?.username}`,
                })
              }
            >
              Share Profile
            </Button>
          </div>
        </div>
      )}

      {pendingPosts && !posts
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
