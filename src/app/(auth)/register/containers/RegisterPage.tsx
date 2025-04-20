'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '@/components/buttons/Button';
import Input from '@/components/form/Input';
import UnderlineLink from '@/components/links/UnderlineLink';
import Typography from '@/components/Typography';

import { useRegisterMutation } from '@/app/(auth)/register/hooks/useRegisterMutation';
import { registerSchema } from '@/validations/register';

export default function RegisterPage() {
  const methods = useForm({
    mode: 'onTouched',
    resolver: zodResolver(registerSchema),
  });
  const {
    handleSubmit,
    formState: { isValid },
  } = methods;
  const { mutate, isPending } = useRegisterMutation();
  const onSubmit = (data: z.infer<typeof registerSchema>) => {
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
        Register
      </Typography>

      <FormProvider {...methods}>
        <form
          className='w-[600px] max-sm:w-[90%] mt-4 flex flex-col gap-4 max-[350px]:gap-2'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            id='username'
            label='Username'
            placeholder='Enter your username'
          />
          <Input id='name' label='Name' placeholder='Enter your name' />
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
            Register
          </Button>
        </form>
      </FormProvider>
      <div className='flex mt-4 gap-2'>
        <Typography
          as='p'
          variant='c'
          className='text-center text-muted-foreground text-sm'
        >
          Already have an account?{' '}
        </Typography>
        <UnderlineLink href='/login' className='font-semibold text-sm'>
          Login
        </UnderlineLink>
      </div>
    </section>
  );
}
