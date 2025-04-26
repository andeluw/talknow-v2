'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Heart, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import { getFromLocalStorage } from '@/lib/helper';
import { cn } from '@/lib/utils';

import Button from '@/components/buttons/Button';
import IconLink from '@/components/links/IconLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import Typography from '@/components/Typography';

import useAuthStore from '@/stores/useAuthStore';

import MoreButton from '@/app/post/components/MoreButton';
import PostItemSkeleton from '@/app/post/components/PostItemSkeleton';
import PostText from '@/app/post/components/PostText';
import ReplyPostModal from '@/app/post/components/ReplyPostModal';
import { useLikePostMutation } from '@/app/post/hooks/useLikeMutation';
import { useUnlikePostMutation } from '@/app/post/hooks/useUnlikeMutation';
import ProfileImage from '@/app/profile/components/ProfileImage';

import { PaginatedApiResponse } from '@/types/api';
import { Post, PostWithReplies } from '@/types/entities/post';

type PostItemProps =
  | {
      post: Post;
      isLoading: false;
      topPost?: boolean;
      isHomepage?: boolean;
      isMainDetail?: boolean;
      isLink?: boolean;
    }
  | {
      isLoading: true;
      post?: undefined;
      topPost?: boolean;
      isHomepage?: boolean;
      isMainDetail?: boolean;
      isLink?: boolean;
    };

export default function PostItem(props: PostItemProps) {
  const {
    topPost,
    isHomepage = true,
    isMainDetail = false,
    isLoading,
    isLink = false,
  } = props;

  // const post = !isLoading ? props.post! : null;
  const post = !isLoading ? props.post ?? null : null;

  const queryClient = useQueryClient();

  const [isReplyModalOpen, setisReplyModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  const isAuthed = useAuthStore.useIsAuthed();
  const user = useAuthStore.useUser();

  const { mutate: likePost } = useLikePostMutation({
    username: user?.username || null,
  });

  const { mutate: unlikePost } = useUnlikePostMutation({
    username: user?.username || null,
  });

  useEffect(() => {
    if (post && user) {
      try {
        const likedPosts = JSON.parse(
          getFromLocalStorage('likedPosts') || '[]'
        ) as { username: string; postIds: number[] }[];

        const userEntry = likedPosts.find(
          (entry) => entry.username === user?.username
        );
        setLiked(userEntry?.postIds.includes(post.id) ?? false);
      } catch {
        setLiked(false);
      }
    }
  }, [post, user]);

  if (isLoading) {
    return <PostItemSkeleton isMainDetail={isMainDetail} />;
  }

  const handleLike = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!post) return;

    function updateLike({ like }: { like: boolean }) {
      setLiked(like);
      //#region //*=========== Main ===========
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(['posts'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: PaginatedApiResponse<Post[]>) => ({
            ...page,
            data: page.data.map((post2: Post) =>
              post2.id === post?.id
                ? {
                    ...post2,
                    total_likes: like
                      ? post2.total_likes + 1
                      : post2.total_likes - 1,
                  }
                : post2
            ),
          })),
        };
      });
      //#endregion  //*======== Main ===========

      //#region //*=========== Update in Detail Parent ID ===========
      queryClient.setQueryData(
        ['posts', 'detail', post?.parent_id],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map(
              (page: PaginatedApiResponse<PostWithReplies>) => ({
                ...page,
                data:
                  page.data.id === post?.id
                    ? {
                        ...page.data,
                        total_likes: like
                          ? post.total_likes + 1
                          : post.total_likes - 1,
                      }
                    : {
                        ...page.data,
                        replies: page.data.replies?.map((reply: Post) =>
                          reply.id === post?.id
                            ? {
                                ...reply,
                                total_likes: like
                                  ? post.total_likes + 1
                                  : post.total_likes - 1,
                              }
                            : reply
                        ),
                      },
              })
            ),
          };
        }
      );
      //#endregion  //*======== Update in Detail Parent ID ===========

      //#region //*=========== Update in Detail ID ===========
      queryClient.setQueryData(
        ['posts', 'detail', post?.id],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map(
              (page: PaginatedApiResponse<PostWithReplies>) => ({
                ...page,
                data:
                  page.data.id === post?.id
                    ? {
                        ...page.data,
                        total_likes: like
                          ? page.data.total_likes + 1
                          : page.data.total_likes - 1,
                      }
                    : {
                        ...page.data,
                        replies: page.data.replies?.map((reply: Post) =>
                          reply.id === post?.id
                            ? {
                                ...reply,
                                total_likes: like
                                  ? reply.total_likes + 1
                                  : reply.total_likes - 1,
                              }
                            : reply
                        ),
                      },
              })
            ),
          };
        }
      );
      //#endregion  //*======== Update in Detail ID ===========

      //#region //*=========== Profile User ===========
      queryClient.setQueryData(
        ['posts', 'user', post?.user.username],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: PaginatedApiResponse<Post[]>) => ({
              ...page,
              data: page.data.map((post2: Post) =>
                post2.id === post?.id
                  ? {
                      ...post2,
                      total_likes: like
                        ? post2.total_likes + 1
                        : post2.total_likes - 1,
                    }
                  : post2
              ),
            })),
          };
        }
      );
      //#endregion  //*======== Profile User ===========
    }

    function invalidateQueriesLike() {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
      queryClient.invalidateQueries({
        queryKey: ['posts', 'detail', post?.parent_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['posts', 'detail', post?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['posts', 'user', post?.user?.username],
      });
    }

    if (!liked) {
      likePost(
        { post_id: post.id },
        {
          onSuccess: () => {
            updateLike({ like: true });
          },
          onSettled: () => {
            invalidateQueriesLike();
          },
        }
      );
    } else {
      unlikePost(
        { post_id: post.id },
        {
          onSuccess: () => {
            updateLike({ like: false });
          },
          onSettled: () => {
            invalidateQueriesLike();
          },
        }
      );
    }
  };

  const WrapperClasses = cn(
    'flex items-start gap-6 px-5 md:px-8 py-6 py-8 border-[1.5px] border-surface-muted bg-surface-alt w-full justify-between',
    isMainDetail && 'pt-6 pb-8 md:pt-8 md:pb-12',
    topPost && 'rounded-t-lg'
  );

  const PostContent = () => {
    if (!post) return null;

    return isMainDetail ? (
      <div className='flex gap-3 md:gap-4 flex-col w-full'>
        <div className='flex gap-3 md:gap-4 items-center'>
          <ProfileImage
            path={post.user?.image_url}
            username={post.user?.username}
          />
          <UnstyledLink
            href={`/profile/${post.user?.username}`}
            className='text-primary font-semibold text-base md:text-xl'
          >
            @{post.user?.username}
          </UnstyledLink>
        </div>
        <PostText text={post.text} postId={post.id} isMainDetail />
        <Button
          variant='outline-2'
          size='sm'
          leftIcon={Heart}
          isIconFilled={liked}
          disabled={!isAuthed}
          filledIcon='red'
          className={cn(
            'w-fit px-3 py-1.5 disabled:cursor-default mt-2 transition-all duration-200 ease-in-out transform'
          )}
          classNames={{
            leftIcon: cn(
              'transition-all duration-100 ease-in-out',
              liked && 'text-red-500'
            ),
          }}
          onClick={handleLike}
          // isLoading={pendingLike || pendingUnlike}
        >
          {post.total_likes}
        </Button>

        {isHomepage && user && (
          <div className='w-full mt-4 md:mt-8'>
            <Typography
              as='h2'
              variant='bt'
              weight='bold'
              className='text-primary mb-4'
            >
              Reply to @{post.user?.username}
            </Typography>
            <ReplyPostModal
              parent_id={post.id}
              isOpen={isReplyModalOpen}
              setIsOpen={setisReplyModalOpen}
            >
              <div className=''>
                <Typography
                  as='p'
                  variant='bt'
                  className='text-muted-foreground mb-2'
                >
                  Type your reply...
                </Typography>
              </div>
            </ReplyPostModal>
          </div>
        )}
      </div>
    ) : (
      <div className='flex gap-4 md:gap-6 w-full'>
        <ProfileImage
          path={post.user?.image_url}
          username={post.user?.username}
          className='flex-shrink-0'
        />
        <div className='flex flex-col w-full'>
          <UnstyledLink
            href={`/profile/${post.user?.username}`}
            className='text-primary font-semibold'
          >
            @{post.user?.username}
          </UnstyledLink>
          <PostText text={post.text} postId={post.id} />
          <div className='flex gap-2 mt-6'>
            <Button
              variant='outline-2'
              size='sm'
              leftIcon={Heart}
              isIconFilled={liked}
              disabled={!isAuthed}
              filledIcon='red'
              className={cn(
                'w-fit px-3 py-1.5 disabled:cursor-default transition-all duration-200 ease-in-out transform'
              )}
              classNames={{
                leftIcon: cn(
                  'transition-all duration-100 ease-in-out',
                  liked && 'text-red-500'
                ),
              }}
              onClick={handleLike}
              // isLoading={pendingLike || pendingUnlike}
            >
              {post.total_likes}
            </Button>

            <IconLink
              href={`/post/${post.id}`}
              icon={MessageCircle}
              variant='transparent'
              className='w-fit px-3 py-1.5'
              classNames={{ icon: 'text-muted-foreground' }}
              iconSize={18}
            />
            {/* {isHomepage && user && (
              <ReplyPostModal
                parent_id={post.id}
                isOpen={isReplyModalOpen}
                setIsOpen={setisReplyModalOpen}
              >
                <Button
                  variant='outline-2'
                  size='sm'
                  rightIcon={Reply}
                  className='w-fit px-3 py-1.5'
                  type='button'
                >
                  Reply
                </Button>
              </ReplyPostModal>
            )} */}
          </div>
        </div>
      </div>
    );
  };

  if (!post) return null;

  if (isLink) {
    return (
      <UnstyledLink href={`/post/${post.id}`} className={WrapperClasses}>
        {PostContent()}
        <MoreButton
          username={post.user?.username}
          postId={post.id}
          currentText={post.text}
          parent_id={post.parent_id}
        />
      </UnstyledLink>
    );
  }

  return (
    <div className={WrapperClasses}>
      {PostContent()}
      <MoreButton
        username={post.user?.username}
        postId={post.id}
        currentText={post.text}
        parent_id={post.parent_id}
      />
      {/* {isReplyModalOpen && (
        <ReplyPostModal
          parent_id={post.id}
          isOpen={isReplyModalOpen}
          setIsOpen={setisReplyModalOpen}
        />
      )} */}
    </div>
  );
}
