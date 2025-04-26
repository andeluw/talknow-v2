'use client';
import { ArrowLeft, Loader } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import IconButton from '@/components/buttons/IconButton';

import NotFound from '@/app/not-found';
import useGetDetailPost from '@/app/post/[id]/hooks/useGetDetailPost';
import PostItem from '@/app/post/components/PostItem';
import MainLayout from '@/layouts/MainLayout';

import { User } from '@/types/entities/user';

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { ref, inView } = useInView();
  const {
    posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useGetDetailPost({ id: Number(id) });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (
    (error && 'status' in error && error.status === 400) ||
    ((!posts || !posts.pages || posts.pages.length === 0) && !isLoading) ||
    posts?.pages[0].data?.is_deleted
  ) {
    return <NotFound />;
  }

  return (
    <MainLayout className='items-start'>
      <IconButton
        icon={ArrowLeft}
        variant='transparent'
        className='w-fit px-3 py-1.5 mb-4'
        iconSize={24}
        onClick={() => router.back()}
      />

      {isLoading ? (
        <PostItem isLoading={true} isMainDetail={true} topPost={true} />
      ) : (
        <PostItem
          isLoading={false}
          post={{
            id: posts?.pages[0].data.id as number,
            text: posts?.pages[0].data.text as string,
            total_likes: posts?.pages[0].data.total_likes as number,
            user: posts?.pages[0].data.user as User,
            parent_id: posts?.pages[0].data.parent_id as number,
            is_deleted: posts?.pages[0].data.is_deleted as boolean,
          }}
          isHomepage={true}
          topPost={true}
          isMainDetail={true}
        />
      )}

      {posts?.pages
        .flatMap((page) => page.data.replies)
        .map(
          (post) =>
            post &&
            !post.is_deleted && (
              <PostItem
                isLoading={false}
                key={post.id}
                post={post}
                isHomepage={true}
              />
            )
        )}

      <div ref={ref} className='h-10'></div>

      {isFetchingNextPage && (
        <Loader className='animate-spin text-muted-foreground mt-4 place-self-center' />
      )}
    </MainLayout>
  );
}
