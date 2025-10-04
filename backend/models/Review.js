const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
    maxlength: [500, 'Review text cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Ensure one review per user per book
reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

// Update book's average rating after review operations
reviewSchema.statics.updateBookRating = async function(bookId) {
  const Book = mongoose.model('Book');
  
  const stats = await this.aggregate([
    { $match: { bookId: new mongoose.Types.ObjectId(bookId) } },
    {
      $group: {
        _id: '$bookId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount
    });
  } else {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: 0,
      reviewCount: 0
    });
  }
};

// Update book rating after save
reviewSchema.post('save', function() {
  this.constructor.updateBookRating(this.bookId);
});

// Update book rating after remove
reviewSchema.post('remove', function() {
  this.constructor.updateBookRating(this.bookId);
});

module.exports = mongoose.model('Review', reviewSchema);
