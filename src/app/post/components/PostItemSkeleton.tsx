import { cn } from '@/lib/utils';

import { Skeleton } from '@/components/Skeleton';

export default function PostItemSkeleton({
  isMainDetail = false,
}: {
  isMainDetail?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-6 px-5 md:px-8 py-8 border-[1.5px] border-surface-muted bg-surface-alt w-full justify-between animate-pulse',
        isMainDetail && 'pt-8 pb-12'
      )}
    >
      <div className={cn('flex gap-4 w-full', isMainDetail ? 'flex-col' : '')}>
        <div
          className={cn(
            'flex gap-4',
            isMainDetail ? 'items-center' : 'items-start'
          )}
        >
          <Skeleton className='h-10 w-10 rounded-full' />
          {isMainDetail && <Skeleton className='h-4 w-24 rounded-md' />}
        </div>

        <div className='flex flex-col gap-2 w-full max-w-[90%]'>
          {!isMainDetail && <Skeleton className='h-4 w-24 rounded-md' />}
          <Skeleton className='h-4 w-full rounded-md' />
          <Skeleton className='h-4 w-3/4 rounded-md' />

          {/* Buttons section */}
          <div className='flex gap-2 mt-4'>
            <Skeleton className='h-8 w-16 rounded-md' />
            {isMainDetail && <Skeleton className='h-8 w-16 rounded-md' />}
            {!isMainDetail && <Skeleton className='h-8 w-16 rounded-md' />}
          </div>
        </div>
      </div>
    </div>
  );
}
