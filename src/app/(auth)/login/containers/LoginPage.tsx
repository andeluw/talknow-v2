'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '@/components/buttons/Button';
import Input from '@/components/form/Input';
import UnderlineLink from '@/components/links/UnderlineLink';
import Typography from '@/components/Typography';

import { useLoginMutation } from '@/app/(auth)/login/hooks/useLoginMutation';
import { loginSchema } from '@/validations/login';

export default function LoginPage() {
  const methods = useForm({
    mode: 'onTouched',
    resolver: zodResolver(loginSchema),
  });
  const {
    handleSubmit,
    formState: { isValid },
  } = methods;
  const { mutate, isPending } = useLoginMutation();
  const onSubmit = (data: z.infer<typeof loginSchema>) => {
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
        Login
      </Typography>

      <FormProvider {...methods}>
        <form
          className='w-[600px] max-sm:w-[90%] mt-4 flex flex-col gap-4'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            id='username'
            label='Username'
            placeholder='Enter your username'
          />
          <Input
            id='password'
            label='Password'
            type='password'
            placeholder='Enter your password'
          />
          <Button
            type='submit'
            variant='light'
            size='base'
            className='mt-4 py-2'
            disabled={!isValid || isPending}
            isLoading={isPending}
          >
            Login
          </Button>
        </form>
      </FormProvider>
      <div className='flex mt-4 gap-2'>
        <Typography
          as='p'
          variant='c'
          className='text-center text-muted-foreground text-sm'
        >
          Don't have an account?{' '}
        </Typography>
        <UnderlineLink href='/register' className='font-semibold text-sm'>
          Register
        </UnderlineLink>
      </div>
    </section>
  );
}
