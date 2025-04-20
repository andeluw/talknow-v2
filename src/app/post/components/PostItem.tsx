'use client';

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

import { Post } from '@/types/entities/post';

type PostItemProps =
  | {
      post: Post;
      isLoading: false;
      topPost?: boolean;
      isHomepage?: boolean;
      refetchPosts?: () => void;
      isMainDetail?: boolean;
      isLink?: boolean;
    }
  | {
      isLoading: true;
      post?: undefined;
      topPost?: boolean;
      isHomepage?: boolean;
      refetchPosts?: () => void;
      isMainDetail?: boolean;
      isLink?: boolean;
    };

export default function PostItem(props: PostItemProps) {
  const {
    topPost,
    isHomepage = true,
    refetchPosts,
    isMainDetail = false,
    isLoading,
    isLink = false,
  } = props;

  // const post = !isLoading ? props.post! : null;
  const post = !isLoading ? props.post ?? null : null;

  const [isReplyModalOpen, setisReplyModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(post?.total_likes ?? 0);

  const isFetchingUser = useAuthStore.useIsLoading();
  const isAuthed = useAuthStore.useIsAuthed();
  const user = useAuthStore.useUser();

  const { mutate: likePost, isPending: pendingLike } = useLikePostMutation({
    setLiked,
    username: user?.username || null,
    setTotalLikes,
  });

  const { mutate: unlikePost, isPending: pendingUnlike } =
    useUnlikePostMutation({
      setLiked,
      username: user?.username || null,
      setTotalLikes,
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
        setTotalLikes(post.total_likes);
      } catch {
        setLiked(false);
      }
    }
  }, [post, user]);

  if (isLoading || (isAuthed && isFetchingUser)) {
    return <PostItemSkeleton isMainDetail={isMainDetail} />;
  }

  const handleLike = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!post) return;

    if (!liked) {
      likePost({ post_id: post.id });
    } else {
      unlikePost({ post_id: post.id });
    }

    refetchPosts?.();
  };

  // const handleReply = (event: React.MouseEvent) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   event.nativeEvent.stopImmediatePropagation();
  //   setisReplyModalOpen(true);
  // };

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
          className={cn('w-fit px-3 py-1.5 disabled:cursor-default mt-2')}
          classNames={{ leftIcon: cn(liked && 'text-red-500') }}
          onClick={handleLike}
          isLoading={pendingLike || pendingUnlike}
        >
          {totalLikes}
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
          <div className='flex gap-2 mt-4'>
            <Button
              variant='outline-2'
              size='sm'
              leftIcon={Heart}
              isIconFilled={liked}
              disabled={!isAuthed}
              filledIcon='red'
              className={cn('w-fit px-3 py-1.5 disabled:cursor-default')}
              classNames={{ leftIcon: cn(liked && 'text-red-500') }}
              onClick={handleLike}
              isLoading={pendingLike || pendingUnlike}
            >
              {totalLikes}
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
        {post.user?.id === user?.id && (
          <MoreButton postId={post.id} currentText={post.text} />
        )}
      </UnstyledLink>
    );
  }

  return (
    <div className={WrapperClasses}>
      {PostContent()}
      {post.user?.id === user?.id && (
        <MoreButton postId={post.id} currentText={post.text} />
      )}
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
