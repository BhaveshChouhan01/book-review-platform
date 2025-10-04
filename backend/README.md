# Book Review Platform - Backend

## Overview
RESTful API backend for the Book Review Platform built with Node.js, Express.js, and MongoDB.

## Features
- User authentication with JWT
- CRUD operations for books and reviews
- Search and filter functionality
- Pagination support
- Input validation and error handling
- MongoDB with Mongoose ODM

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/book-review-platform
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

3. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Books
- `GET /api/books` - Get all books (with pagination, search, filter)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create new book (Protected)
- `PUT /api/books/:id` - Update book (Protected)
- `DELETE /api/books/:id` - Delete book (Protected)
- `GET /api/books/user/:userId` - Get books by user

### Reviews
- `GET /api/reviews/book/:bookId` - Get reviews for a book
- `GET /api/reviews/user/:userId` - Get reviews by user
- `GET /api/reviews/:id` - Get single review
- `POST /api/reviews` - Create new review (Protected)
- `PUT /api/reviews/:id` - Update review (Protected)
- `DELETE /api/reviews/:id` - Delete review (Protected)

## Query Parameters

### Books Endpoint (`GET /api/books`)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 5)
- `search` - Search by title or author
- `genre` - Filter by genre
- `sortBy` - Sort by 'createdAt', 'rating', or 'year'
- `sortOrder` - 'asc' or 'desc'

## Database Schema

### User
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique),
  password: String (required, min 6 chars, hashed),
  timestamps: true
}
```

### Book
```javascript
{
  title: String (required, max 200 chars),
  author: String (required, max 100 chars),
  description: String (required, max 1000 chars),
  genre: String (required, enum),
  publishedYear: Number (required),
  addedBy: ObjectId (User reference),
  averageRating: Number (0-5),
  reviewCount: Number,
  timestamps: true
}
```

### Review
```javascript
{
  bookId: ObjectId (Book reference),
  userId: ObjectId (User reference),
  rating: Number (required, 1-5),
  reviewText: String (required, max 500 chars),
  timestamps: true
}
```

## Error Handling
The API returns consistent error responses:
```javascript
{
  message: "Error description",
  errors: [] // Validation errors if applicable
}
```

## Security Features
- Password hashing with bcryptjs
- JWT authentication
- Input validation with express-validator
- CORS enabled
- Protected routes middleware

## Development
```bash
npm run dev  # Start with nodemon for auto-restart
```
