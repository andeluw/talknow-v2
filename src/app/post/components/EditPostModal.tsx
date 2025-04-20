import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
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
} from '@/components/dialog/Dialog';
import Textarea from '@/components/form/Textarea';

import { useEditPostMutation } from '@/app/post/hooks/useEditPostMutation';
import { postSchema } from '@/validations/post';

export default function EditPostModal({
  currentText,
  postId,
  open,
  onClose,
}: {
  currentText: string;
  postId: number;
  open: boolean;
  onClose: (event?: React.MouseEvent | Event) => void;
}) {
  const methods = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: { text: currentText },
  });

  const {
    handleSubmit,
    formState: { isValid },
    reset,
  } = methods;

  const { mutate, isPending } = useEditPostMutation({ post_id: postId });

  useEffect(() => {
    if (open) {
      reset({ text: currentText });
    }
  }, [open, currentText, reset]);

  const onSubmit = (data: z.infer<typeof postSchema>) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit post</DialogTitle>
          <DialogDescription>Edit and update your message.</DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='w-full flex gap-4 py-4 flex-col'
          >
            <Textarea
              id='text'
              placeholder='Type your changes here...'
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
                Edit
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
