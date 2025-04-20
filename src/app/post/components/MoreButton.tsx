'use client';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';

import { copyToClipboard } from '@/lib/helper';

import IconButton from '@/components/buttons/IconButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown/DropdownMenu';

import useAuthStore from '@/stores/useAuthStore';

import DeletePostModal from '@/app/post/components/DeletePostModal';
import EditPostModal from '@/app/post/components/EditPostModal';

type MoreButtonProps = {
  postId: number;
  currentText: string;
  username?: string;
};

export default function MoreButton({
  postId,
  currentText,
  username,
}: MoreButtonProps) {
  const user = useAuthStore.useUser();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const openDeleteModal = (event?: React.MouseEvent | Event) => {
    if (event) {
      event.preventDefault?.();
      event.stopPropagation?.();
    }
    setDeleteModalOpen(true);
  };
  function closeDeleteModal(event?: React.MouseEvent | Event) {
    if (event) {
      event.preventDefault?.();
      event.stopPropagation?.();
    }
    setDeleteModalOpen(false);
  }
  const openEditModal = (event?: React.MouseEvent | Event) => {
    if (event) {
      event.preventDefault?.();
      event.stopPropagation?.();
    }
    setEditModalOpen(true);
  };

  const closeEditModal = (event?: React.MouseEvent | Event) => {
    if (event) {
      event.preventDefault?.();
      event.stopPropagation?.();
    }
    setEditModalOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            icon={EllipsisVertical}
            variant='transparent'
            className='w-8 h-8 p-2 hover:bg-surface-muted text-primary'
            iconSize={24}
            onClick={(e) => e.stopPropagation()}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem
            className='group cursor-pointer'
            onClick={() =>
              copyToClipboard({
                text: `https://talknow-rpl-v2.vercel.app/post/${postId}`,
              })
            }
          >
            <span className='group-hover:font-semibold'>Share</span>
          </DropdownMenuItem>

          {user?.username === username && (
            <>
              <DropdownMenuItem
                className='group cursor-pointer'
                onClick={openEditModal}
              >
                <span className='group-hover:font-semibold'>Edit</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className='group cursor-pointer'
                onClick={openDeleteModal}
              >
                <span className='text-red-500 group-hover:font-semibold group-hover:text-red-600'>
                  Delete
                </span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditModalOpen && (
        <EditPostModal
          open={isEditModalOpen}
          onClose={closeEditModal}
          currentText={currentText}
          postId={postId}
        />
      )}

      {isDeleteModalOpen && (
        <DeletePostModal
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          postId={postId}
        />
      )}
    </>
  );
}
