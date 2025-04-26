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

import NotFound from '@/app/not-found';
import CreatePostModal from '@/app/post/components/CreatePostModal';
import PostItem from '@/app/post/components/PostItem';
import ProfileHeaderSkeleton from '@/app/profile/[username]/components/ProfileHeaderSkeleton';
import useGetUser from '@/app/profile/[username]/hooks/useGetUser';
import useGetUserPosts from '@/app/profile/[username]/hooks/useGetUserPosts';
import ProfileImage from '@/app/profile/components/ProfileImage';
import MainLayout from '@/layouts/MainLayout';

export default function ProfilePage() {
  const user = useAuthStore.useUser();
  const { username } = useParams();
  const {
    fetchedUser,
    isLoading: pendingUser,
    error: errorGetUser,
  } = useGetUser({
    username: username as string,
  });

  const {
    posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: pendingPosts,
  } = useGetUserPosts({
    username: username as string,
  });
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const noPosts =
    (!posts ||
      !posts.pages ||
      posts.pages.every(
        (page) =>
          !page.data ||
          page.data.length === 0 ||
          page.data.every((post) => post.is_deleted)
      )) &&
    !pendingPosts;

  if (errorGetUser && 'status' in errorGetUser && errorGetUser.status === 400) {
    return <NotFound />;
  }

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
            className='w-20 h-20 md:w-24 md:h-24'
          />
          <Typography
            variant='h5'
            className='font-semibold text-primary md:text-2xl mt-4 text-center'
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

      {!noPosts && fetchedUser?.username === user?.username && (
        <CreatePostModal>
          <div className='flex items-center gap-3 w-full rounded-t-xl border-[1.5px] border-b-0 border-surface-muted bg-surface-alt py-5 px-5 md:px-8'>
            <div className='flex items-center gap-6 w-full'>
              <ProfileImage
                path={user?.image_url as string | null}
                username={user?.username}
              />
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

      {pendingPosts && !posts
        ? [...Array(3)].map((_, idx) => <PostItem key={idx} isLoading={true} />)
        : posts?.pages
            .flatMap((page) => page.data ?? [])
            .map(
              (post) =>
                !post.is_deleted && (
                  <PostItem
                    isLoading={false}
                    key={post.id}
                    post={post}
                    // isLink={true}
                  />
                )
            )}

      <div ref={ref} className='h-10'></div>

      {isFetchingNextPage && (
        <Loader className='animate-spin text-muted-foreground mt-4' />
      )}

      {noPosts && (
        <div className='flex flex-col items-center justify-center w-full px-8 md:px-16 mb-4 gap-6'>
          <Typography
            variant='p'
            className=' text-muted-foreground text-center'
          >
            No posts yet.
          </Typography>
          {fetchedUser?.username === user?.username && (
            <CreatePostModal>
              <Button variant='light'>Create Post</Button>
            </CreatePostModal>
          )}
        </div>
      )}
    </MainLayout>
  );
}
