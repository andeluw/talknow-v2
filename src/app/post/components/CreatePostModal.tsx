import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '@/components/buttons/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog/Dialog';
import Textarea from '@/components/form/Textarea';

import { useCreatePostMutation } from '@/app/post/hooks/useCreatePostMutation';
import { postSchema } from '@/validations/post';

export default function CreatePostModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const methods = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
  });

  const {
    handleSubmit,
    formState: { isValid },
    reset,
  } = methods;

  const { mutate, isPending } = useCreatePostMutation();

  const onSubmit = (data: z.infer<typeof postSchema>) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) reset();
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create post</DialogTitle>
          <DialogDescription>
            Type your thoughts and hit post.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            className='w-full flex gap-4 py-4 flex-col'
            onSubmit={handleSubmit(onSubmit)}
          >
            <Textarea
              id='text'
              placeholder='Type your thoughts here...'
              className='resize-none border-none ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none'
              rows={5}
            />
            <DialogFooter>
              <Button
                type='submit'
                variant='light'
                disabled={!isValid || isPending}
                isLoading={isPending}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
