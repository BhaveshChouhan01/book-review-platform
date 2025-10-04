# 📚 Book Review Platform

A full-stack web application built with the MERN stack (MongoDB, Express.js, React, Node.js) that allows users to discover, add, and review books in a community-driven platform.

## ✨ Features

### 🔐 User Authentication
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Protected routes and middleware
- Persistent login sessions

### 📖 Book Management
- Add new books with detailed information (title, author, description, genre, published year)
- Edit and delete books (only by the book creator)
- Browse all books with pagination (5 books per page)
- Search books by title or author
- Filter books by genre
- Sort books by date added, rating, or published year

### ⭐ Review System
- Write reviews with 1-5 star ratings
- Edit and delete your own reviews
- View all reviews for each book
- Automatic average rating calculation
- One review per user per book restriction

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Clean and intuitive interface
- Loading states and error handling
- Mobile-friendly navigation
- Interactive star ratings

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling framework

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/book-review-platform.git
   cd book-review-platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/book-review-platform
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   NODE_ENV=development
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start the Application**
   
   **Backend** (in the backend directory):
   ```bash
   npm run dev
   ```
   
   **Frontend** (in the frontend directory):
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
book-review-platform/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── bookController.js     # Book CRUD operations
│   │   └── reviewController.js   # Review CRUD operations
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Book.js               # Book schema
│   │   └── Review.js             # Review schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── books.js              # Book routes
│   │   └── reviews.js            # Review routes
│   ├── server.js                 # Express server setup
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation component
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Book listing page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   ├── BookDetails.jsx   # Book details and reviews
│   │   │   ├── AddBook.jsx       # Add new book
│   │   │   ├── EditBook.jsx      # Edit book
│   │   │   └── Profile.jsx       # User profile
│   │   ├── services/
│   │   │   ├── api.js            # Axios configuration
│   │   │   ├── authService.js    # Auth API calls
│   │   │   ├── bookService.js    # Book API calls
│   │   │   └── reviewService.js  # Review API calls
│   │   ├── utils/
│   │   │   └── helpers.js        # Utility functions
│   │   ├── App.jsx               # Main App component
│   │   ├── main.jsx              # App entry point
│   │   └── index.css             # Global styles
│   ├── tailwind.config.js        # Tailwind configuration
│   ├── vite.config.js            # Vite configuration
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

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

## 🗄️ Database Schema

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

## 🎯 Key Features Implemented

### ✅ Core Requirements
- [x] User authentication with JWT
- [x] CRUD operations for books and reviews
- [x] Pagination (5 books per page)
- [x] Search and filter functionality
- [x] Responsive design with Tailwind CSS
- [x] Input validation and error handling
- [x] Protected routes and authorization

### ✅ Advanced Features
- [x] Real-time rating calculations
- [x] User profile with activity summary
- [x] Interactive star ratings
- [x] Mobile-responsive navigation
- [x] Loading states and error handling
- [x] Form validation with user feedback

### 🚀 Potential Enhancements
- [ ] Dark/Light mode toggle
- [ ] Book cover image uploads
- [ ] Advanced search with filters
- [ ] User book recommendations
- [ ] Social features (follow users, book lists)
- [ ] Email notifications
- [ ] Book rating analytics with charts
- [ ] API rate limiting
- [ ] Deployment configuration

## 🧪 Testing

To test the application:

1. **Register a new user** - Create an account with valid credentials
2. **Login** - Sign in with your credentials
3. **Add a book** - Create a new book entry with all required fields
4. **Browse books** - Use search, filter, and sorting features
5. **Write reviews** - Add reviews to books (not your own)
6. **View profile** - Check your added books and written reviews
7. **Edit/Delete** - Modify or remove your own books and reviews

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built as part of a MERN stack learning project
- Inspired by popular book review platforms
- Uses modern React patterns and best practices
- Implements secure authentication and authorization

---

**Happy Reading! 📚✨**
