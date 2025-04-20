import { LogIn, LogOut } from 'lucide-react';

import { cn } from '@/lib/utils';

import Button from '@/components/buttons/Button';
import ButtonLink from '@/components/links/ButtonLink';
import Typography from '@/components/Typography';

import useAuthStore from '@/stores/useAuthStore';

import LogoutModal from '@/app/(auth)/components/LogoutModal';
import Navigation from '@/app/(navigation)/containers/Navigation';

export default function MainLayout({
  children,
  withTopbar = true,
  className,
}: {
  children: React.ReactNode;
  withTopbar?: boolean;
  className?: string;
}) {
  const user = useAuthStore.useUser();
  const isAuthed = useAuthStore.useIsAuthed();
  return (
    <div className='flex flex-col-reverse md:flex-row min-h-screen w-full'>
      <Navigation />
      <div className='flex justify-center min-h-screen w-full'>
        <div
          className={cn(
            'flex flex-col items-center w-[87%] md:w-[75%] lg:w-3/5 mb-20',
            className
          )}
        >
          {withTopbar && (
            <div className='flex justify-between items-center w-full py-8'>
              <div className='w-24 h-0.5 bg-transparent' />
              <Typography variant='h5' className='font-bold text-primary-500'>
                tn.
              </Typography>
              {user && isAuthed ? (
                <LogoutModal>
                  <Button
                    variant='outline-white'
                    size='base'
                    rightIcon={LogOut}
                  >
                    Logout
                  </Button>
                </LogoutModal>
              ) : (
                <ButtonLink
                  variant='light'
                  size='base'
                  href='/login'
                  rightIcon={LogIn}
                >
                  Login
                </ButtonLink>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
