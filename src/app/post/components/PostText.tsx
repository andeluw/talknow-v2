import { useState } from 'react';

import { cn } from '@/lib/utils';

import TextButton from '@/components/buttons/TextButton';
import UnstyledLink from '@/components/links/UnstyledLink';
import Typography from '@/components/Typography';

export default function PostText({
  text,
  isMainDetail,
  postId,
}: {
  text: string;
  isMainDetail?: boolean;
  postId: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsExpanded((prev) => !prev);
  };
  return (
    <div className='flex flex-col gap-2 items-start w-full'>
      <UnstyledLink href={`/post/${postId}`} className='w-full'>
        <Typography
          variant={`${isMainDetail ? 'p' : 'bt'}`}
          className={cn(
            'text-primary mt-2 whitespace-pre-wrap',
            !isExpanded && 'line-clamp-6'
          )}
        >
          {text}
        </Typography>
      </UnstyledLink>
      {text?.split('\n').length > 5 && (
        <TextButton variant='primary' className='mt-2' onClick={toggleExpand}>
          {isExpanded ? 'Show less' : 'Show more'}
        </TextButton>
      )}
    </div>
  );
}
