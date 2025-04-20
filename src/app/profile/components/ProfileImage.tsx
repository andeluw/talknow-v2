import { cn } from '@/lib/utils';

import NextImage from '@/components/NextImage';

export default function ProfileImage({
  path,
  className,
}: {
  path: string | null;
  className?: string;
}) {
  // const { data, isLoading } = useQuery<any, any>({
  //   queryKey: ['profile-image', path],
  //   queryFn: async () => {
  //     if (!path) return null;
  //     const response = await api.get<string>(`/assets/${path}`);
  //     return response.data;
  //   },
  // });
  // if (isLoading) {
  //   return <div className='h-12 w-12 rounded-full bg-muted animate-pulse' />;
  // }
  // if (!data) {
  //   return <div className='h-12 w-12 rounded-full bg-muted' />;
  // }
  const imagePath =
    path && path != null
      ? 'https://tugas2-fe.labse.id/assets/' + path
      : '/images/default-avatar.png';
  return (
    <div
      className={cn(
        'h-8 w-8 md:w-12 md:h-12 relative rounded-full overflow-hidden mt-0.5',
        className
      )}
    >
      <NextImage
        src={imagePath}
        alt='Profile Image'
        layout='fill'
        style={{
          objectFit: 'cover',
        }}
        className='rounded-full'
      />
    </div>
  );
}
