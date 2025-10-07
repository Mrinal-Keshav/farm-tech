import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart,
  MessageSquare,
  Share,
  Send,
  Camera,
  MoreHorizontal,
  ThumbsUp,
  Reply,
  Clock,
  User
} from "lucide-react";
import { useAuth } from "../App";
import { useCommunity } from "@/hooks/useCommunity";

interface CommunityPost {
  id: string;
  user: string;
  avatar?: string;
  content: string;
  image?: string;
  time: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
}

interface Comment {
  user: string;
  avatar?: string;
  text: string;
  time: string;
  likes: number;
  likedBy: string[];
  replies: Reply[];
}

interface Reply {
  user: string;
  avatar?: string;
  text: string;
  time: string;
}

const CommunityFeed = () => {
  const { user } = useAuth();
  const { posts, createPost, toggleLike } = useCommunity();
  const [localPosts, setLocalPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const [activeReplyBox, setActiveReplyBox] = useState<string | null>(null);

  // Load posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem("communityPosts");
    if (savedPosts) {
      const parsed = JSON.parse(savedPosts);
      parsed.forEach((p: CommunityPost) => {
        p.likes = p.likes || 0;
        p.likedBy = p.likedBy || [];
        p.comments = p.comments.map((c: Comment) => ({
          ...c,
          likes: c.likes || 0,
          likedBy: c.likedBy || [],
          replies: c.replies || [],
        }));
      });
      setLocalPosts(parsed);
    }
  }, []);

  // Save posts to localStorage whenever localPosts changes
  useEffect(() => {
    localStorage.setItem("communityPosts", JSON.stringify(localPosts));
  }, [localPosts]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (newPost.trim() === "" && !newImage) return;

    const newPostData: CommunityPost = {
      id: Date.now().toString(),
      user: user?.email || "Anonymous",
      avatar: user?.user_metadata?.avatar_url || "/avatar.png",
      content: newPost,
      image: newImage || undefined,
      time: new Date().toLocaleString(),
      likes: 0,
      likedBy: [],
      comments: [],
    };

    setLocalPosts([newPostData, ...localPosts]);
    setNewPost("");
    setNewImage(null);
  };

  const handleLike = (id: string) => {
    setLocalPosts(
      localPosts.map((p) =>
        p.id === id
          ? p.likedBy?.includes(user?.email || "")
            ? {
                ...p,
                likes: p.likes - 1,
                likedBy: p.likedBy.filter((u) => u !== user?.email),
              }
            : {
                ...p,
                likes: p.likes + 1,
                likedBy: [...(p.likedBy || []), user?.email || ""],
              }
          : p
      )
    );
  };

  const handleComment = (id: string, text: string) => {
    if (!text.trim()) return;
    const commenterAvatar = user?.user_metadata?.avatar_url || "/avatar.png";

    setLocalPosts(
      localPosts.map((p) =>
        p.id === id
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  user: user?.email || "Anonymous",
                  avatar: commenterAvatar,
                  text,
                  time: "Just now",
                  likes: 0,
                  likedBy: [],
                  replies: [],
                },
              ],
            }
          : p
      )
    );
  };

  const handleCommentLike = (postId: string, commentIndex: number) => {
    setLocalPosts(
      localPosts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.map((c, i) =>
                i === commentIndex
                  ? c.likedBy?.includes(user?.email || "")
                    ? {
                        ...c,
                        likes: c.likes - 1,
                        likedBy: c.likedBy.filter((u) => u !== user?.email),
                      }
                    : {
                        ...c,
                        likes: c.likes + 1,
                        likedBy: [...(c.likedBy || []), user?.email || ""],
                      }
                  : c
              ),
            }
          : p
      )
    );
  };

  const handleReply = (postId: string, commentIndex: number, text: string) => {
    if (!text.trim()) return;
    const commenterAvatar = user?.user_metadata?.avatar_url || "/avatar.png";

    setLocalPosts(
      localPosts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.map((c, i) =>
                i === commentIndex
                  ? {
                      ...c,
                      replies: [
                        ...(c.replies || []),
                        {
                          user: user?.email || "Anonymous",
                          avatar: commenterAvatar,
                          text,
                          time: "Just now",
                        },
                      ],
                    }
                  : c
              ),
            }
          : p
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Farm Community Feed</h1>
        <p className="text-muted-foreground">
          Share your farming experiences and connect with fellow farmers
        </p>
      </div>

      {/* Create Post */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="Share your farm story..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              {newImage && (
                <div className="relative">
                  <img 
                    src={newImage} 
                    alt="preview" 
                    className="w-full max-w-md rounded-lg object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setNewImage(null)}
                  >
                    ×
                  </Button>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-primary">
                    <Camera className="w-4 h-4" />
                    Add Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <Button 
                  onClick={handlePost}
                  disabled={!newPost.trim() && !newImage}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <div className="space-y-6">
        {localPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">{post.user}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-foreground leading-relaxed">{post.content}</p>
                {post.image && (
                  <img 
                    src={post.image} 
                    alt="post" 
                    className="w-full rounded-lg mt-4 object-cover"
                  />
                )}
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-6">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleLike(post.id)}
                    className={`text-muted-foreground hover:text-primary ${
                      post.likedBy?.includes(user?.email || "") ? "text-red-500" : ""
                    }`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${
                      post.likedBy?.includes(user?.email || "") ? "fill-current" : ""
                    }`} />
                    {post.likes}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveCommentBox(
                      activeCommentBox === post.id ? null : post.id
                    )}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {post.comments.length}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Comments Section */}
              {activeCommentBox === post.id && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  {post.comments.map((comment, i) => (
                    <div key={i} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{comment.user}</span>
                            <span className="text-xs text-muted-foreground">{comment.time}</span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                        
                        {/* Comment Actions */}
                        <div className="flex items-center gap-4 mt-2 ml-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleCommentLike(post.id, i)}
                            className={`text-xs h-6 px-2 ${
                              comment.likedBy?.includes(user?.email || "") ? "text-red-500" : ""
                            }`}
                          >
                            <ThumbsUp className={`w-3 h-3 mr-1 ${
                              comment.likedBy?.includes(user?.email || "") ? "fill-current" : ""
                            }`} />
                            {comment.likes}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setActiveReplyBox(
                              activeReplyBox === `${post.id}-${i}` ? null : `${post.id}-${i}`
                            )}
                            className="text-xs h-6 px-2"
                          >
                            <Reply className="w-3 h-3 mr-1" />
                            Reply
                          </Button>
                        </div>

                        {/* Replies */}
                        {comment.replies?.map((reply, j) => (
                          <div key={j} className="flex gap-3 mt-3 ml-4">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={reply.avatar} />
                              <AvatarFallback>
                                <User className="w-3 h-3" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-muted/30 rounded-lg p-2 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-xs">{reply.user}</span>
                                <span className="text-xs text-muted-foreground">{reply.time}</span>
                              </div>
                              <p className="text-xs">{reply.text}</p>
                            </div>
                          </div>
                        ))}

                        {/* Reply Box */}
                        {activeReplyBox === `${post.id}-${i}` && (
                          <div className="mt-3 ml-4">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Write a reply..."
                                className="text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleReply(post.id, i, e.currentTarget.value);
                                    e.currentTarget.value = "";
                                    setActiveReplyBox(null);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Comment */}
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Input
                        placeholder="Add a comment..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleComment(post.id, e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {localPosts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No posts yet</h3>
              <p>Be the first to share your farming story!</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunityFeed;

