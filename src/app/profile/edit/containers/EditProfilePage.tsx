'use client';
import { Eye, X } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Lightbox from 'yet-another-react-lightbox';

import 'yet-another-react-lightbox/styles.css';

import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import Input from '@/components/form/Input';
import { Label } from '@/components/form/Label';
import Textarea from '@/components/form/Textarea';
import withAuth from '@/components/hoc/withAuth';
import Typography from '@/components/Typography';

import useAuthStore from '@/stores/useAuthStore';

import { ProfileImageBase } from '@/app/profile/components/ProfileImage';
import { useEditProfileMutation } from '@/app/profile/edit/hooks/useEditProfileMutation';

export default withAuth(EditProfilePage, 'user');

interface ProfileFormData {
  name: string | null;
  bio: string | null;
  image: File | null;
}

function EditProfilePage() {
  const user = useAuthStore.useUser();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const methods = useForm<ProfileFormData>({
    mode: 'onTouched',
    defaultValues: {
      name: user?.name ?? '',
      bio: user?.bio ?? '',
      image: null,
    },
  });
  const {
    handleSubmit,
    formState: { isValid },
    setValue,
    watch,
  } = methods;

  const { mutate, isPending } = useEditProfileMutation();

  const watchedValues = watch();

  const isChanged =
    watchedValues.name !== user?.name ||
    watchedValues.bio !== user?.bio ||
    watchedValues.image !== null;

  const onSubmit = (data: ProfileFormData) => {
    mutate(data);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setValue('image', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <section className='h-screen flex flex-col items-center justify-center'>
      <Typography
        as='h1'
        variant='h5'
        weight='bold'
        className='text-primary-500 text-center mb-4 max-[350px]:mb-2'
      >
        tn.
      </Typography>
      <Typography
        as='h1'
        variant='h5'
        weight='bold'
        className='text-center max-sm:text-[24px]'
      >
        Edit Profile
      </Typography>

      <FormProvider {...methods}>
        <form
          className='w-[600px] max-sm:w-[90%] mt-4 flex flex-col gap-4 max-[350px]:gap-2'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            id='name'
            label='Name'
            placeholder='Enter your name'
            defaultValue={user?.name ?? ''}
          />

          {!imagePreview ? (
            <Input
              id='image_url'
              label='Profile Photo'
              type='file'
              placeholder='Choose a profile picture'
              accept='image/*'
              onChange={handleImageChange}
            />
          ) : (
            <div className='flex flex-col gap-2'>
              <Label>Profile Photo</Label>
              <div className='flex justify-between items-center gap-3 border border-surface-muted rounded-lg px-6 py-4'>
                <div className='w-16 h-16 rounded overflow-hidden relative'>
                  <ProfileImageBase src={imagePreview} />
                </div>
                <div className='flex gap-2'>
                  <IconButton
                    icon={Eye}
                    variant='transparent'
                    iconSize={20}
                    className='text-muted-foreground'
                    onClick={() => setLightboxOpen(true)}
                  />
                  <IconButton
                    icon={X}
                    variant='transparent'
                    iconSize={20}
                    className='text-red-500 hover:text-red-700'
                    onClick={() => {
                      setImagePreview(null);
                      setValue('image', null);
                    }}
                  />
                </div>
              </div>
              <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={[{ src: imagePreview }]}
                carousel={{ finite: true }}
                render={{
                  buttonPrev: () => null,
                  buttonNext: () => null,
                }}
              />
            </div>
          )}

          <Textarea
            id='bio'
            label='Bio'
            placeholder='Enter your bio'
            rows={4}
            defaultValue={user?.bio ?? ''}
          />
          <Button
            type='submit'
            variant='light'
            size='base'
            className='mt-4 py-2'
            disabled={!isValid || isPending || !isChanged}
            isLoading={isPending}
          >
            Save Changes
          </Button>
        </form>
      </FormProvider>
    </section>
  );
}
