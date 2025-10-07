import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  category: string | null;
  image_url: string | null;
  tags: string[] | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  user_liked?: boolean;
}

export interface Discussion {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  pinned: boolean;
  posts_count: number;
  last_active: string | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Comment {
  id: string;
  user_id: string;
  post_id: string | null;
  discussion_id: string | null;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export const useCommunity = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select(`
          *,
          profile:profiles!posts_user_id_fkey(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check which posts the current user has liked
      let postsWithLikes = postsData || [];
      if (user) {
        const { data: likesData } = await supabase
          .from('likes')
          .select('post_id')
          .eq('user_id', user.id);

        const likedPostIds = new Set(likesData?.map(like => like.post_id) || []);
        postsWithLikes = postsData?.map(post => ({
          ...post,
          user_liked: likedPostIds.has(post.id)
        })) || [];
      }

      setPosts(postsWithLikes);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    }
  };

  const fetchDiscussions = async () => {
    try {
      const { data, error } = await supabase
        .from('discussions')
        .select(`
          *,
          profile:profiles!discussions_user_id_fkey(*)
        `)
        .order('pinned', { ascending: false })
        .order('last_active', { ascending: false });

      if (error) throw error;
      setDiscussions(data || []);
    } catch (error) {
      console.error('Error fetching discussions:', error);
      toast({
        title: "Error",
        description: "Failed to load discussions",
        variant: "destructive",
      });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchPosts(), fetchDiscussions()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createPost = async (content: string, category?: string, tags?: string[]) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create posts",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content,
          category,
          tags,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully",
      });

      fetchPosts(); // Refresh posts
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
      return false;
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.user_liked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            post_id: postId,
          });

        if (error) throw error;
      }

      // Update local state
      setPosts(posts.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              user_liked: !p.user_liked,
              likes_count: p.user_liked ? p.likes_count - 1 : p.likes_count + 1
            }
          : p
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const createDiscussion = async (title: string, description?: string, category?: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create discussions",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('discussions')
        .insert({
          user_id: user.id,
          title,
          description,
          category,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Discussion created successfully",
      });

      fetchDiscussions(); // Refresh discussions
      return true;
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast({
        title: "Error",
        description: "Failed to create discussion",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    posts,
    discussions,
    loading,
    user,
    createPost,
    toggleLike,
    createDiscussion,
    refetch: fetchData,
  };
};