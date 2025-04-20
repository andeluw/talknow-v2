import { User } from '@/types/entities/user';

export type Post = {
  id: number;
  text: string;
  total_likes: number;
  parent_id: number | null;
  is_deleted: boolean;
  user: User;
  isliked?: boolean;
};

export type PostWithReplies = Post & {
  replies: Post[];
};
