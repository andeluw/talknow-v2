'use client';

import { HouseIcon, Plus, Search, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import useAuthStore from '@/stores/useAuthStore';
import useNavStore from '@/stores/useNavStore';

import NavButton from '@/app/(navigation)/components/NavButton';
import CreatePostModal from '@/app/post/components/CreatePostModal';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore.useUser();
  const setActive = useNavStore.useSetActive();

  useEffect(() => {
    const isSearch = pathname === '/search';
    const isProfile = pathname.startsWith('/profile');
    const isHome = pathname === '/';

    if (isSearch) {
      setActive('search');
    } else if (user && isProfile) {
      const profilePath = `/profile/${user.username}`;
      setActive('profile');
      if (pathname !== profilePath) router.push(profilePath);
    } else if (user && !isProfile) {
      setActive('home');
      if (!isHome) router.push('/');
    } else if (!user && !isSearch && !isProfile) {
      setActive('home');
      if (!isHome) router.push('/');
    } else {
      setActive('home');
    }
  }, [pathname, user, router, setActive]);

  return (
    <div className='w-full h-[64px] bottom-0 sticky md:fixed md:h-screen md:w-[80px] flex md:flex-col gap-6 md:gap-4 px-8 md:p-4 shadow-md bg-background z-20 '>
      <div className='flex h-full w-full md:flex-col md:justify-center items-center justify-between gap-4'>
        <Link href='/' passHref>
          <NavButton name='home' icon={HouseIcon} />
        </Link>

        <Link href='/search' passHref>
          <NavButton name='search' icon={Search} />
        </Link>

        {user ? (
          <CreatePostModal>
            <NavButton name='create' icon={Plus} />
          </CreatePostModal>
        ) : (
          <Link href='/login' passHref>
            <NavButton name='create' icon={Plus} />
          </Link>
        )}

        <Link href={user ? `/profile/${user.username}` : '/login'} passHref>
          <NavButton name='profile' icon={User} />
        </Link>
      </div>
    </div>
  );
}
