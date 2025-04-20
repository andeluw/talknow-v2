import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/dialog/AlertDialog';

import { useDeletePostMutation } from '@/app/post/hooks/useDeletePostMutation';

export default function DeletePostModal({
  postId,
  open,
  onClose,
}: {
  postId: number;
  open: boolean;
  onClose: (event?: React.MouseEvent | Event) => void;
}) {
  const { mutate, isPending } = useDeletePostMutation();

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this post?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The post will be permanently removed
            and cannot be recovered.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              mutate({ post_id: postId });
              onClose(e);
            }}
            className='bg-red-500 hover:bg-red-600 focus:ring-red-500 active:bg-red-700 outline-none border-0'
            disabled={isPending}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
