import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import Typography from '@/components/Typography';

export default function HelperText({
  children,
  helperTextClassName,
}: {
  children: ReactNode;
  helperTextClassName?: string;
}) {
  return (
    <div className='flex space-x-1'>
      <Typography
        as='p'
        weight='regular'
        variant='c'
        className={cn(
          'text-xs !leading-tight text-muted-foreground',
          helperTextClassName
        )}
      >
        {children}
      </Typography>
    </div>
  );
}
