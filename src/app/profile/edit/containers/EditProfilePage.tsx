'use client';

import { FormProvider, useForm } from 'react-hook-form';

import Button from '@/components/buttons/Button';
import Input from '@/components/form/Input';
import Textarea from '@/components/form/Textarea';
import withAuth from '@/components/hoc/withAuth';
import Typography from '@/components/Typography';

import useAuthStore from '@/stores/useAuthStore';

import { useEditProfileMutation } from '@/app/profile/edit/hooks/useEditProfileMutation';

export default withAuth(EditProfilePage, 'user');

interface ProfileFormData {
  name: string | null;
  bio: string | null;
  image: File | null;
}

function EditProfilePage() {
  const user = useAuthStore.useUser();
  const methods = useForm<ProfileFormData>({
    mode: 'onTouched',
  });
  const {
    handleSubmit,
    formState: { isValid },
    setValue,
  } = methods;

  const { mutate, isPending } = useEditProfileMutation();

  const onSubmit = (data: ProfileFormData) => {
    mutate(data);
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
            value={user?.name}
            onChange={(e) => setValue('name', e.target.value)}
          />
          <Input
            id='image_url'
            label='Profile Photo'
            type='file'
            placeholder='Choose a profile picture'
            accept='image/*'
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setValue('image', file);
            }}
          />
          <Textarea
            id='bio'
            label='Bio'
            placeholder='Enter your bio'
            rows={4}
            value={user?.bio ?? ''}
            onChange={(e) => setValue('bio', e.target.value)}
          />
          <Button
            type='submit'
            variant='light'
            size='base'
            className='mt-4 py-2'
            disabled={!isValid || isPending}
            isLoading={isPending}
          >
            Save Changes
          </Button>
        </form>
      </FormProvider>
    </section>
  );
}
