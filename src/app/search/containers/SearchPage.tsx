'use client';

import debounce from 'lodash/debounce';
import { Loader } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';

import Input from '@/components/form/Input';

import PostItem from '@/app/post/components/PostItem';
import useSearchPost from '@/app/search/hooks/useSearchPost';
import MainLayout from '@/layouts/MainLayout';

export default function SearchPage() {
  const methods = useForm<{ search: string }>();
  const search = methods.watch('search');
  const { ref, inView } = useInView();

  const [searchQuery, setSearchQuery] = useState('');

  const debouncedUpdate = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value.trim());
      }, 400),
    [setSearchQuery]
  );

  useEffect(() => {
    debouncedUpdate(search || '');
    return () => debouncedUpdate.cancel();
  }, [search, debouncedUpdate]);

  const {
    posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetchPosts,
  } = useSearchPost({
    searchQuery,
  });

  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      !isFetchingNextPage &&
      searchQuery.length >= 2
    ) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, searchQuery]);

  return (
    <MainLayout>
      <FormProvider {...methods}>
        <form className='flex gap-4 w-full'>
          <Input id='search' placeholder='Search...' className='w-full' />
        </form>
      </FormProvider>

      <div className='h-8 w-full' />

      {searchQuery.length < 2 && search ? (
        <div className='text-muted-foreground text-center py-4'>
          Please enter at least 2 characters
        </div>
      ) : isLoading && !posts ? (
        [...Array(3)].map((_, idx) => <PostItem key={idx} isLoading={true} />)
      ) : (
        posts?.pages
          .flatMap((page) => page.data)
          .filter((post) => !post.is_deleted)
          .map((post) => (
            <PostItem
              isLoading={false}
              key={post.id}
              post={post}
              refetchPosts={refetchPosts}
            />
          ))
      )}

      <div ref={ref} className='h-10' />

      {isFetchingNextPage && (
        <Loader className='animate-spin text-muted-foreground mt-4' />
      )}
    </MainLayout>
  );
}
