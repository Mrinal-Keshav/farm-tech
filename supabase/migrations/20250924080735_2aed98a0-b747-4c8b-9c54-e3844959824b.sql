-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  location TEXT,
  bio TEXT,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  category TEXT,
  image_url TEXT,
  tags TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create discussions table
CREATE TABLE public.discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  pinned BOOLEAN DEFAULT false,
  posts_count INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT comment_target_check CHECK (
    (post_id IS NOT NULL AND discussion_id IS NULL) OR 
    (post_id IS NULL AND discussion_id IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create likes table for tracking user likes
CREATE TABLE public.likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT like_target_check CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR 
    (post_id IS NULL AND comment_id IS NOT NULL)
  ),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id)
);

-- Enable RLS
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for posts
CREATE POLICY "Posts are viewable by everyone" 
ON public.posts 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own posts" 
ON public.posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
ON public.posts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
ON public.posts 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for discussions
CREATE POLICY "Discussions are viewable by everyone" 
ON public.discussions 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create discussions" 
ON public.discussions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own discussions" 
ON public.discussions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for likes
CREATE POLICY "Likes are viewable by everyone" 
ON public.likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own likes" 
ON public.likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
ON public.likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discussions_updated_at
BEFORE UPDATE ON public.discussions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update post likes count
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.post_id IS NOT NULL THEN
    UPDATE public.posts 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' AND OLD.post_id IS NOT NULL THEN
    UPDATE public.posts 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.post_id;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to update likes count
CREATE TRIGGER update_post_likes_trigger
AFTER INSERT OR DELETE ON public.likes
FOR EACH ROW
EXECUTE FUNCTION public.update_post_likes_count();

-- Function to update comments count
CREATE OR REPLACE FUNCTION public.update_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.post_id IS NOT NULL THEN
      UPDATE public.posts 
      SET comments_count = comments_count + 1 
      WHERE id = NEW.post_id;
    ELSIF NEW.discussion_id IS NOT NULL THEN
      UPDATE public.discussions 
      SET posts_count = posts_count + 1, last_active = now()
      WHERE id = NEW.discussion_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.post_id IS NOT NULL THEN
      UPDATE public.posts 
      SET comments_count = comments_count - 1 
      WHERE id = OLD.post_id;
    ELSIF OLD.discussion_id IS NOT NULL THEN
      UPDATE public.discussions 
      SET posts_count = posts_count - 1
      WHERE id = OLD.discussion_id;
    END IF;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to update comments count
CREATE TRIGGER update_comments_count_trigger
AFTER INSERT OR DELETE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_comments_count();