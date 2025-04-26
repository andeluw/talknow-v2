import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';

import 'yet-another-react-lightbox/styles.css';

import { cn } from '@/lib/utils';

import UnstyledLink from '@/components/links/UnstyledLink';
import NextImage from '@/components/NextImage';

type ProfileImageBaseProps = {
  src: string | null;
  onClick?: () => void;
};

type ProfileImageProps = {
  path: string | null;
  username?: string | null;
  className?: string;
};

export function ProfileImageBase({ src, onClick }: ProfileImageBaseProps) {
  return (
    <NextImage
      src={src ?? '/images/default-avatar.png'}
      alt='Profile Image'
      layout='fill'
      style={{ objectFit: 'cover' }}
      className='rounded-full'
      onError={(e) => {
        e.currentTarget.src = '/images/default-avatar.png';
      }}
      onClick={onClick}
    />
  );
}

export default function ProfileImage({
  path,
  className,
  username,
}: ProfileImageProps) {
  const [openImage, setOpenImage] = useState(false);
  // const imageUrl =
  //   path && path !== null ? `https://tugas2-fe.labse.id/assets/${path}` : null;

  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ['profile-image', path],
  //   queryFn: async () => {
  //     if (!imageUrl) return null;
  //     const res = await axios.get(imageUrl, { responseType: 'blob' });
  //     console.log('res', res);
  //     return URL.createObjectURL(res.data);
  //   },
  //   enabled: !!imageUrl,
  // });

  // const finalImageSrc = isError || !data ? '/images/default-avatar.png' : data;

  const imagePath =
    path && path != null
      ? 'https://tugas2-fe.labse.id/assets/' + path
      : '/images/default-avatar.png';

  return !username ? (
    <>
      <div
        className={cn(
          'h-8 w-8 md:w-12 md:h-12 relative rounded-full overflow-hidden mt-0.5 cursor-pointer',
          className
        )}
      >
        <ProfileImageBase src={imagePath} onClick={() => setOpenImage(true)} />
      </div>
      {imagePath && (
        <Lightbox
          open={openImage}
          close={() => setOpenImage(false)}
          slides={[{ src: imagePath }]}
          carousel={{ finite: true }}
          render={{
            buttonPrev: () => null,
            buttonNext: () => null,
          }}
        />
      )}
    </>
  ) : (
    <UnstyledLink
      href={username ? `/profile/${username}` : '#'}
      className={cn(
        'h-8 w-8 md:w-12 md:h-12 relative rounded-full overflow-hidden mt-0.5',
        className
      )}
    >
      <ProfileImageBase src={imagePath} />
    </UnstyledLink>
  );
}
