'use client';

import { FormProvider, useForm } from 'react-hook-form';

import Input from '@/components/form/Input';
import Typography from '@/components/Typography';

export default function SandboxForm() {
  const methods = useForm({
    mode: 'onTouched',
  });

  const { handleSubmit } = methods;

  const onSubmit = () => {
    // console.log('Form data:', data);
  };

  return (
    <main className='flex min-h-screen items-center justify-center py-12'>
      <div className='flex flex-col'>
        <Typography
          as='h1'
          variant='h4'
          weight='bold'
          className='text-white text-center'
        >
          Form Sandbox
        </Typography>
        <FormProvider {...methods}>
          <form
            className='w-[600px] max-sm:w-[95%] mt-8 flex flex-col gap-4'
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              id='Test'
              placeholder='Ini placeholder'
              label='Halo'
              helperText='haha'
            />

            <Input id='passwordInput' type='password' />

            <Input id='testFile' type='file' />
          </form>
        </FormProvider>
      </div>
    </main>
  );
}
