import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
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

import { useReplyPostMutation } from '@/app/post/hooks/useReplyPostMutation';
import { postSchema } from '@/validations/post';

export default function ReplyPostModal({
  children,
  parent_id,
  isOpen = false,
  setIsOpen,
}: {
  children: React.ReactNode;
  parent_id: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const methods = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
  });

  const {
    handleSubmit,
    formState: { isValid },
    reset,
  } = methods;

  const { mutate, isPending } = useReplyPostMutation();

  const onSubmit = (
    data: z.infer<typeof postSchema>,
    event?: React.BaseSyntheticEvent
  ) => {
    event?.preventDefault();
    event?.stopPropagation();

    mutate(
      {
        ...data,
        parent_id,
      },
      {
        onSuccess: () => {
          reset();
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) reset();
        setIsOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <div
          onClick={(e) => {
            // if ((e.target as HTMLElement).closest('a')) {
            //   e.preventDefault();
            // }
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
        >
          {children}
        </div>
      </DialogTrigger>
      <DialogContent
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className='sm:max-w-[425px]'
      >
        <DialogHeader>
          <DialogTitle>Reply to Post</DialogTitle>
          <DialogDescription>
            Add a reply and join the conversation.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            className='w-full flex gap-4 py-4 flex-col'
            onSubmit={(e) => handleSubmit(onSubmit)(e)}
            onClick={(e) => e.stopPropagation()}
          >
            <Textarea
              id='text'
              placeholder='Type your reply...'
              className='resize-none border-none ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none'
              rows={5}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <DialogFooter>
              <Button
                type='submit'
                variant='light'
                disabled={!isValid || isPending}
                isLoading={isPending}
                onClick={(e) => e.stopPropagation()}
                // onClick={(e) => {
                //   e.preventDefault();
                //   e.stopPropagation();
                // }}
              >
                Reply
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
