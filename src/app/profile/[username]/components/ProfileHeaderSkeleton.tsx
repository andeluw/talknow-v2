import { Skeleton } from '@/components/Skeleton';

export default function ProfileHeaderSkeleton() {
  return (
    <div className='flex flex-col items-center justify-center w-full px-8 md:px-16 py-8 mb-4 animate-pulse'>
      <Skeleton className='w-20 h-20 md:w-24 md:h-24 rounded-full' />
      <Skeleton className='h-6 w-32 mt-4 rounded-md' /> {/* Username */}
      <Skeleton className='h-4 w-24 mt-2 rounded-md' /> {/* Name */}
      <Skeleton className='h-4 w-48 mt-3 rounded-md' /> {/* Bio */}
    </div>
  );
}
