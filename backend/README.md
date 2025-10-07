# Farm Community Backend

This is the backend server for the Farm Community features, providing API endpoints for user management, posts, comments, and interactions.

## Features

- **User Management**: Registration, login, profile management
- **Community Posts**: Create, read, update, delete posts
- **Comments & Replies**: Full commenting system with nested replies
- **Likes System**: Like/unlike posts and comments
- **User Profiles**: Avatar uploads, bio, location, verification status

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running on your system:
```bash
mongod
```

3. Start the server:
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `DELETE /api/posts/:id` - Delete a post

### Comments
- `POST /api/posts/:id/comment` - Add comment to post
- `POST /api/posts/:id/comments/:commentIndex/reply` - Reply to comment

### Interactions
- `POST /api/posts/:id/like` - Like/unlike a post
- `POST /api/posts/:id/comments/:commentIndex/like` - Like/unlike a comment

### User Management
- `GET /api/users/:email` - Get user profile
- `PUT /api/users/:email` - Update user profile

## Database Schema

### User
```javascript
{
  email: String (required, unique),
  password: String (required),
  displayName: String,
  avatar: String,
  location: String,
  bio: String,
  verified: Boolean (default: false),
  createdAt: Date
}
```

### Post
```javascript
{
  user: String,
  avatar: String,
  content: String,
  image: String,
  time: String,
  likes: Number (default: 0),
  likedBy: [String],
  comments: [Comment],
  category: String (default: "General"),
  tags: [String]
}
```

### Comment
```javascript
{
  user: String,
  avatar: String,
  text: String,
  time: String,
  likes: Number (default: 0),
  likedBy: [String],
  replies: [Reply]
}
```

## Environment Variables

Create a `.env` file in the backend directory:
```
MONGODB_URI=mongodb://127.0.0.1:27017/farm
PORT=5000
JWT_SECRET=your_jwt_secret_here
```

To use the same connection string from MongoDB Compass, copy the SRV or standard URI and paste it as `MONGODB_URI`. Examples:

```
# Standard (local or self-hosted)
MONGODB_URI=mongodb://username:password@127.0.0.1:27017/farm?authSource=admin

# Atlas (SRV string from Compass)
MONGODB_URI=mongodb+srv://username:password@your-cluster.mongodb.net/farm?retryWrites=true&w=majority&appName=YourAppName
```

If your database enforces TLS or specific drivers, ensure your Node version and Mongoose support it.

## Integration with Frontend

This backend integrates with the main Farm Tech frontend application, providing community features alongside the existing Supabase-based functionality. The frontend can use both systems:

- **Supabase**: For main app features (dashboard, games, analytics)
- **MongoDB Backend**: For enhanced community features (posts, comments, interactions)

## Development Notes

- The server uses CORS to allow frontend connections
- All passwords are hashed using bcrypt
- Image uploads are handled via base64 encoding (can be extended to use Cloudinary)
- The API follows RESTful conventions
- Error handling includes proper HTTP status codes

