import React, { useState, useEffect } from "react";
import "./Feed.css";

interface Post {
  id: number;
  user: string;
  avatar?: string;
  content: string;
  image?: string;
  time: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  category?: string;
  tags?: string[];
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

interface User {
  email: string;
  displayName?: string;
  avatar?: string;
  location?: string;
  bio?: string;
}

export default function CommunityFeed() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [newTags, setNewTags] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCommentBox, setActiveCommentBox] = useState<number | null>(null);
  const [activeReplyBox, setActiveReplyBox] = useState<string | null>(null);

  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");

  // Enhanced demo data with more posts
  const demoPosts: Post[] = [
    {
      id: 1,
      user: "Priya Sharma",
      avatar: "/avatar.svg",
      content: "Just harvested my best tomato crop ever! 🍅 The AI suggestions about watering schedule really made a difference. Yield increased by 23% compared to last season. The FarmTech app's irrigation recommendations were spot on!",
      time: "2 hours ago",
      likes: 47,
      likedBy: ["rajesh@example.com", "anita@example.com"],
      category: "Success Story",
      tags: ["tomatoes", "harvest", "ai-suggestions", "irrigation"],
      comments: [
        {
          user: "Rajesh Kumar",
          avatar: "/avatar.svg",
          text: "Amazing results! What AI tool did you use?",
          time: "1 hour ago",
          likes: 5,
          likedBy: ["priya@example.com"],
          replies: [
            {
              user: "Priya Sharma",
              avatar: "/avatar.svg",
              text: "I used FarmTech's irrigation recommendations feature",
              time: "45 minutes ago"
            }
          ]
        },
        {
          user: "Anita Patel",
          avatar: "/avatar.svg",
          text: "Congratulations! 🎉",
          time: "30 minutes ago",
          likes: 3,
          likedBy: [],
          replies: []
        }
      ]
    },
    {
      id: 2,
      user: "Rajesh Kumar",
      avatar: "/avatar.svg",
      content: "Has anyone tried companion planting with corn and beans? I'm seeing some conflicting advice online. Looking for real farmer experiences. Planning to start next season and want to get it right! 🌽",
      time: "4 hours ago",
      likes: 23,
      likedBy: ["priya@example.com"],
      category: "Question",
      tags: ["corn", "beans", "companion-planting", "planning"],
      comments: [
        {
          user: "Deepak Singh",
          avatar: "/avatar.svg",
          text: "I've been doing it for 3 years now. Beans fix nitrogen for corn, it's a great combination!",
          time: "3 hours ago",
          likes: 8,
          likedBy: ["rajesh@example.com", "priya@example.com"],
          replies: []
        }
      ]
    },
    {
      id: 3,
      user: "Anita Patel",
      avatar: "/avatar.svg",
      content: "Weather forecast shows heavy rain next week. Should I harvest my wheat now or wait? It's about 85% ready according to the app analysis. The FarmTech weather integration is really helpful! 🌾",
      time: "6 hours ago",
      likes: 31,
      likedBy: ["rajesh@example.com", "deepak@example.com"],
      category: "Advice Needed",
      tags: ["wheat", "weather", "harvest-timing", "decision-making"],
      comments: [
        {
          user: "Sunita Reddy",
          avatar: "/avatar.svg",
          text: "I'd harvest now if it's 85% ready. Better safe than sorry with heavy rain coming!",
          time: "5 hours ago",
          likes: 4,
          likedBy: ["anita@example.com"],
          replies: []
        }
      ]
    },
    {
      id: 4,
      user: "Deepak Singh",
      avatar: "/avatar.svg",
      content: "Sharing my soil test results after following the app's fertilizer recommendations for 3 months. pH improved from 6.2 to 6.8, and nitrogen levels are perfect now! 📊 The FarmTech soil analysis feature is incredible!",
      time: "1 day ago",
      likes: 89,
      likedBy: ["priya@example.com", "rajesh@example.com", "anita@example.com"],
      category: "Success Story",
      tags: ["soil-health", "fertilizer", "results", "soil-testing"],
      comments: [
        {
          user: "Priya Sharma",
          avatar: "/avatar.svg",
          text: "Incredible improvement! What fertilizer did you use?",
          time: "20 hours ago",
          likes: 6,
          likedBy: ["deepak@example.com"],
          replies: [
            {
              user: "Deepak Singh",
              avatar: "/avatar.svg",
              text: "Organic compost + the recommended NPK ratio from FarmTech",
              time: "18 hours ago"
            }
          ]
        }
      ]
    },
    {
      id: 5,
      user: "Sunita Reddy",
      avatar: "/avatar.svg",
      content: "My sustainability score reached 95%! 🌱 The FarmSphere game really helped me understand the impact of different farming practices. Highly recommend! The environmental impact tracking is eye-opening!",
      time: "3 hours ago",
      likes: 67,
      likedBy: ["priya@example.com", "rajesh@example.com"],
      category: "Game Achievement",
      tags: ["sustainability", "farmsphere", "game", "environment"],
      comments: [
        {
          user: "Rajesh Kumar",
          avatar: "/avatar.svg",
          text: "That's amazing! I'm at 78%, any tips?",
          time: "2 hours ago",
          likes: 3,
          likedBy: ["sunita@example.com"],
          replies: []
        }
      ]
    },
    {
      id: 6,
      user: "Amit Kumar",
      avatar: "/avatar.svg",
      content: "Successfully implemented drip irrigation system with FarmTech's guidance. Water usage reduced by 40% while maintaining crop quality! 💧 The water management features are game-changing!",
      time: "5 hours ago",
      likes: 52,
      likedBy: ["priya@example.com", "deepak@example.com"],
      category: "Success Story",
      tags: ["irrigation", "water-conservation", "drip-system", "efficiency"],
      comments: [
        {
          user: "Kavita Singh",
          avatar: "/avatar.svg",
          text: "Great work! What was the initial investment?",
          time: "4 hours ago",
          likes: 2,
          likedBy: ["amit@example.com"],
          replies: []
        }
      ]
    },
    {
      id: 7,
      user: "Kavita Singh",
      avatar: "/avatar.svg",
      content: "Looking for advice on organic pest control methods. The FarmTech community has been so helpful! Any recommendations for aphid control? 🐛",
      time: "8 hours ago",
      likes: 19,
      likedBy: ["priya@example.com"],
      category: "Question",
      tags: ["pest-control", "organic", "aphids", "help-needed"],
      comments: [
        {
          user: "Priya Sharma",
          avatar: "/avatar.svg",
          text: "Try neem oil spray! It's worked wonders for me.",
          time: "7 hours ago",
          likes: 7,
          likedBy: ["kavita@example.com", "rajesh@example.com"],
          replies: []
        }
      ]
    },
    {
      id: 8,
      user: "Vikram Patel",
      avatar: "/avatar.svg",
      content: "Just completed the Tractor Run minigame and earned ₹500! 🚜 The game is so fun and helps me understand farm operations better. Try it out! The FarmSphere integration is amazing!",
      time: "1 hour ago",
      likes: 15,
      likedBy: ["sunita@example.com"],
      category: "Game Achievement",
      tags: ["minigame", "tractor-run", "earnings", "gamification"],
      comments: []
    }
  ];

  // Load avatar & posts
  useEffect(() => {
    if (user?.email) {
      const savedAvatar = localStorage.getItem(`avatar_${user.email}`);
      if (savedAvatar) setAvatar(savedAvatar);
    }

    const savedPosts = localStorage.getItem("posts");
    if (savedPosts) {
      const parsed = JSON.parse(savedPosts);
      parsed.forEach((p: Post) => {
        p.likes = p.likes || 0;
        p.likedBy = p.likedBy || [];
        p.comments = p.comments.map((c: Comment) => ({
          ...c,
          likes: c.likes || 0,
          likedBy: c.likedBy || [],
          replies: c.replies || [],
        }));
      });
      setPosts(parsed);
    } else {
      // If no saved posts, use demo data
      setPosts(demoPosts);
    }
  }, [user?.email]);

  // If no user is logged in, show login prompt
  if (!user) {
    return (
      <div className="feed-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Welcome to Farm Community!</h2>
          <p style={{ marginBottom: '2rem', color: '#666' }}>
            Please login to join the community and share your farming stories.
          </p>
          <button 
            onClick={() => window.location.href = '/community-login'}
            style={{
              background: '#16a34a',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Login to Community
          </button>
        </div>
      </div>
    );
  }

  // Save posts
  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user?.email) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        localStorage.setItem(`avatar_${user.email}`, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

    const tagsArray = newTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    const newPostData: Post = {
      id: Date.now(),
      user: user?.displayName || user?.email || "Anonymous",
      avatar: avatar || undefined,
      content: newPost,
      image: newImage || undefined,
      time: new Date().toLocaleString(),
      likes: 0,
      likedBy: [],
      comments: [],
      category: newCategory || "General",
      tags: tagsArray.length > 0 ? tagsArray : ["farming"]
    };

    setPosts([newPostData, ...posts]);
    setNewPost("");
    setNewImage(null);
    setNewCategory("");
    setNewTags("");
  };

  // Like / Unlike post
  const handleLike = (id: number) => {
    setPosts(
      posts.map((p) =>
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

  // Add comment
  const handleComment = (id: number, text: string) => {
    if (!text.trim()) return;
    const commenterAvatar = avatar || "/avatar.svg";

    setPosts(
      posts.map((p) =>
        p.id === id
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  user: user?.displayName || user?.email || "Anonymous",
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

  // Like comment
  const handleCommentLike = (postId: number, commentIndex: number) => {
    setPosts(
      posts.map((p) =>
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

  // Reply to comment
  const handleReply = (postId: number, commentIndex: number, text: string) => {
    if (!text.trim()) return;
    const commenterAvatar = avatar || "/avatar.svg";

    setPosts(
      posts.map((p) =>
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
                          user: user?.displayName || user?.email || "Anonymous",
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="feed-container">
      {/* Header */}
      <div className="feed-header">
        <h2>Farm Community</h2>
        <div className="menu">
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ⋮
          </button>
          {menuOpen && (
            <div className="menu-dropdown">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Avatar Section */}
      <div className="avatar-section">
        <img
          src={avatar || "/avatar.svg"}
          alt="avatar"
          className="big-avatar"
        />
        <label className="avatar-upload">
          Change Avatar
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            hidden
          />
        </label>
        {user?.email && <p className="user-email">{user.displayName || user.email}</p>}
        {user?.location && <p className="user-email" style={{ fontSize: '12px', color: '#666' }}>{user.location}</p>}
      </div>

      {/* Create Post */}
      <div className="create-post">
        <img
          src={avatar || "/avatar.svg"}
          alt="avatar"
          className="avatar"
        />
        <div style={{ width: '100%' }}>
          <textarea
            placeholder="Share your farm story..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          {newImage && (
            <img src={newImage} alt="preview" className="post-image" />
          )}
          <div className="create-post-footer">
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label className="photo-upload">
                📷 Add Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </label>
              <select 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)}
                style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">Select Category</option>
                <option value="Success Story">Success Story</option>
                <option value="Question">Question</option>
                <option value="Advice Needed">Advice Needed</option>
                <option value="Game Achievement">Game Achievement</option>
                <option value="General">General</option>
              </select>
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', width: '150px' }}
              />
            </div>
            <button onClick={handlePost} disabled={!newPost.trim() && !newImage}>
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <div className="post-header">
              <img
                src={post.avatar || "/avatar.svg"}
                alt="avatar"
                className="avatar"
              />
              <div>
                <strong>{post.user}</strong>
                <div className="post-time">{post.time}</div>
                {post.category && (
                  <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>
                    {post.category}
                  </div>
                )}
              </div>
            </div>
            <p>{post.content}</p>
            {post.image && (
              <img src={post.image} alt="post" className="post-image" />
            )}
            {post.tags && post.tags.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                {post.tags.map((tag, index) => (
                  <span key={index} style={{ 
                    background: '#e5e7eb', 
                    color: '#374151', 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    fontSize: '11px', 
                    marginRight: '4px' 
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="post-actions">
              <button
                onClick={() => handleLike(post.id)}
                className={post.likedBy?.includes(user?.email || "") ? "liked" : ""}
              >
                👍 {post.likes}
              </button>
              <button
                onClick={() =>
                  setActiveCommentBox(
                    activeCommentBox === post.id ? null : post.id
                  )
                }
              >
                💬 Comment ({post.comments.length})
              </button>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
              >
                🔗 Share
              </button>
            </div>

            {/* Comments */}
            {activeCommentBox === post.id && (
              <div className="comments">
                {post.comments.map((c, i) => (
                  <div key={i} className="comment">
                    <img
                      src={c.avatar || "/avatar.svg"}
                      alt="avatar"
                      className="avatar"
                    />
                    <div>
                      <strong>{c.user}</strong> {c.text}
                      <div className="comment-time">{c.time}</div>

                      {/* Comment actions */}
                      <div className="comment-actions">
                        <button
                          onClick={() => handleCommentLike(post.id, i)}
                          className={
                            c.likedBy?.includes(user?.email || "") ? "liked" : ""
                          }
                        >
                          👍 {c.likes}
                        </button>
                        <button
                          onClick={() =>
                            setActiveReplyBox(
                              activeReplyBox === `${post.id}-${i}`
                                ? null
                                : `${post.id}-${i}`
                            )
                          }
                        >
                          💬 Reply
                        </button>
                      </div>

                      {/* Replies */}
                      {c.replies?.map((r, j) => (
                        <div key={j} className="reply">
                          <img
                            src={r.avatar || "/avatar.svg"}
                            alt="avatar"
                            className="avatar"
                          />
                          <div>
                            <strong>{r.user}</strong> {r.text}
                            <div className="comment-time">{r.time}</div>
                          </div>
                        </div>
                      ))}

                      {/* Reply box */}
                      {activeReplyBox === `${post.id}-${i}` && (
                        <div className="add-reply">
                          <input
                            type="text"
                            placeholder="Write a reply..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleReply(post.id, i, e.currentTarget.value);
                                e.currentTarget.value = "";
                                setActiveReplyBox(null);
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="add-comment">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleComment(post.id, e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousSibling as HTMLInputElement;
                      handleComment(post.id, input.value);
                      input.value = "";
                    }}
                  >
                    Comment
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}