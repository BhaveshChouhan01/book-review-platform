const User = require('./models/User');
const Book = require('./models/Book');
const Review = require('./models/Review');
const bcrypt = require('bcryptjs');

const initializeData = async () => {
  try {
    console.log('Checking database...');
    
    const bookCount = await Book.countDocuments();
    console.log(`Current books in database: ${bookCount}`);
    
    if (bookCount > 0) {
      console.log('Database already has data. Skipping initialization.');
      return;
    }

    console.log('Clearing existing data...');
    await Book.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});

    console.log('Initializing database with sample data...');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const users = await User.create([
      {
        name: 'Book Admin',
        email: 'admin@bookreview.com',
        password: hashedPassword
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: hashedPassword
      },
      {
        name: 'Mike Chen',
        email: 'mike@example.com',
        password: hashedPassword
      },
      {
        name: 'Emma Wilson',
        email: 'emma@example.com',
        password: hashedPassword
      }
    ]);

    const books = await Book.create([
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        description: 'A gripping tale of racial injustice and childhood innocence in the American South. Through Scout Finch\'s eyes, we witness her father Atticus defend a Black man falsely accused of rape.',
        genre: 'Fiction',
        publishedYear: 1960,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg',
        addedBy: users[0]._id
      },
      {
        title: '1984',
        author: 'George Orwell',
        description: 'A dystopian masterpiece depicting a totalitarian future where Big Brother watches everything. Winston Smith struggles against a regime that controls truth itself.',
        genre: 'Sci-Fi',
        publishedYear: 1949,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg',
        addedBy: users[0]._id
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        description: 'Elizabeth Bennet navigates societal expectations and her own prejudices in this timeless romance with the proud Mr. Darcy.',
        genre: 'Romance',
        publishedYear: 1813,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg',
        addedBy: users[0]._id
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'Jay Gatsby\'s obsessive pursuit of Daisy Buchanan and the American Dream in the Roaring Twenties. A brilliant critique of wealth and excess.',
        genre: 'Fiction',
        publishedYear: 1925,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg',
        addedBy: users[0]._id
      },
      {
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K. Rowling',
        description: 'Harry discovers he\'s a wizard and begins his magical education at Hogwarts. A tale of friendship, bravery, and the battle between good and evil.',
        genre: 'Fantasy',
        publishedYear: 1997,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1598823299i/42844155.jpg',
        addedBy: users[0]._id
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        description: 'Bilbo Baggins embarks on an unexpected adventure with dwarves and a wizard. A tale of courage, friendship, and dragon-guarded treasure.',
        genre: 'Fantasy',
        publishedYear: 1937,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg',
        addedBy: users[0]._id
      },
      {
        title: 'The Da Vinci Code',
        author: 'Dan Brown',
        description: 'Symbologist Robert Langdon unravels centuries-old secrets hidden in art and architecture in this fast-paced thriller blending history and conspiracy.',
        genre: 'Thriller',
        publishedYear: 2003,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1579621267i/968.jpg',
        addedBy: users[0]._id
      },
      {
        title: 'The Hunger Games',
        author: 'Suzanne Collins',
        description: 'Katniss Everdeen volunteers to take her sister\'s place in a brutal televised fight to the death in a dystopian future.',
        genre: 'Sci-Fi',
        publishedYear: 2008,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1586722975i/2767052.jpg',
        addedBy: users[0]._id
      },
      {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        description: 'Santiago, a shepherd boy, dreams of finding treasure in Egypt. His journey teaches profound lessons about following your dreams and listening to your heart.',
        genre: 'Fiction',
        publishedYear: 1988,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg',
        addedBy: users[0]._id
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        description: 'An exploration of human history from the Stone Age to modern era, examining how Homo sapiens came to dominate the world.',
        genre: 'History',
        publishedYear: 2011,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1703329310i/23692271.jpg',
        addedBy: users[0]._id
      },
      {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        description: 'Holden Caulfield\'s raw narrative captures teenage angst and alienation in 1950s America after being expelled from prep school.',
        genre: 'Fiction',
        publishedYear: 1951,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg',
        addedBy: users[1]._id
      },
      {
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        description: 'Frodo Baggins must destroy the One Ring in the fires of Mount Doom to save Middle-earth from the Dark Lord Sauron.',
        genre: 'Fantasy',
        publishedYear: 1954,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1566425108i/33.jpg',
        addedBy: users[1]._id
      },
      {
        title: 'Gone Girl',
        author: 'Gillian Flynn',
        description: 'When Amy Dunne disappears, her husband Nick becomes the prime suspect. A twisted psychological thriller about marriage and media manipulation.',
        genre: 'Thriller',
        publishedYear: 2012,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1554086139i/19288043.jpg',
        addedBy: users[1]._id
      },
      {
        title: 'The Book Thief',
        author: 'Markus Zusak',
        description: 'Death narrates the story of Liesel, a girl living in Nazi Germany who steals books and shares them with others during bombing raids.',
        genre: 'Fiction',
        publishedYear: 2005,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1522157426i/19063.jpg',
        addedBy: users[2]._id
      },
      {
        title: 'The Girl with the Dragon Tattoo',
        author: 'Stieg Larsson',
        description: 'Journalist Mikael Blomkvist and hacker Lisbeth Salander investigate a decades-old disappearance in this gripping Swedish mystery.',
        genre: 'Mystery',
        publishedYear: 2005,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327868566i/2429135.jpg',
        addedBy: users[2]._id
      },
      {
        title: 'The Kite Runner',
        author: 'Khaled Hosseini',
        description: 'Amir\'s journey from childhood in Afghanistan to redemption in America. A powerful story of friendship, betrayal, and the possibility of forgiveness.',
        genre: 'Fiction',
        publishedYear: 2003,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1579036753i/77203.jpg',
        addedBy: users[2]._id
      },
      {
        title: 'The Fault in Our Stars',
        author: 'John Green',
        description: 'Hazel and Augustus, two teenagers with cancer, fall in love. A heart-wrenching yet humorous story about life, death, and everything in between.',
        genre: 'Romance',
        publishedYear: 2012,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1360206420i/11870085.jpg',
        addedBy: users[3]._id
      },
      {
        title: 'Life of Pi',
        author: 'Yann Martel',
        description: 'Pi survives 227 days stranded on a lifeboat in the Pacific Ocean with a Bengal tiger. A philosophical adventure about faith and survival.',
        genre: 'Adventure',
        publishedYear: 2001,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1631251689i/4214.jpg',
        addedBy: users[3]._id
      },
      {
        title: 'The Shining',
        author: 'Stephen King',
        description: 'Jack Torrance becomes the winter caretaker of the isolated Overlook Hotel. As the hotel\'s dark powers awaken, his sanity deteriorates.',
        genre: 'Horror',
        publishedYear: 1977,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1353277730i/11588.jpg',
        addedBy: users[3]._id
      },
      {
        title: 'Educated',
        author: 'Tara Westover',
        description: 'A memoir of a woman who grows up in a survivalist family in Idaho and eventually escapes to pursue education, earning a PhD from Cambridge.',
        genre: 'Biography',
        publishedYear: 2018,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1506026635i/35133922.jpg',
        addedBy: users[1]._id
      }
    ]);

    console.log(`Created ${books.length} sample books`);

    const reviews = await Review.create([
      // Reviews for books 0-9 (same as before)
      { bookId: books[0]._id, userId: users[1]._id, rating: 5, reviewText: 'An absolute masterpiece! Harper Lee\'s portrayal of racial injustice through a child\'s perspective is both heartbreaking and enlightening.' },
      { bookId: books[0]._id, userId: users[2]._id, rating: 5, reviewText: 'Timeless and powerful. The themes are as relevant today as they were in the 1960s.' },
      { bookId: books[0]._id, userId: users[3]._id, rating: 4, reviewText: 'Beautiful writing and memorable characters. Scout\'s narration brings authenticity to the story.' },
      { bookId: books[1]._id, userId: users[1]._id, rating: 5, reviewText: 'Chillingly prophetic! Orwell\'s dystopia feels more relevant than ever.' },
      { bookId: books[1]._id, userId: users[2]._id, rating: 5, reviewText: 'Mind-blowing and terrifying. The concepts of doublethink and newspeak are frighteningly applicable today.' },
      { bookId: books[2]._id, userId: users[1]._id, rating: 5, reviewText: 'Jane Austen\'s wit and social commentary are brilliant! Elizabeth and Darcy\'s romance is perfect.' },
      { bookId: books[2]._id, userId: users[3]._id, rating: 4, reviewText: 'Charming and cleverly written. The social satire is sharp and the character development excellent.' },
      { bookId: books[3]._id, userId: users[1]._id, rating: 5, reviewText: 'Fitzgerald\'s prose is poetry. The critique of the American Dream is masterful and haunting.' },
      { bookId: books[3]._id, userId: users[2]._id, rating: 4, reviewText: 'Beautiful language and vivid imagery of the Jazz Age. A melancholic yet captivating story.' },
      { bookId: books[4]._id, userId: users[1]._id, rating: 5, reviewText: 'Pure magic! Rowling created a world so immersive you wish it were real. Perfect for all ages.' },
      { bookId: books[4]._id, userId: users[2]._id, rating: 5, reviewText: 'Enchanting from page one! The combination of mystery, magic, and adventure is irresistible.' },
      { bookId: books[4]._id, userId: users[3]._id, rating: 5, reviewText: 'Started a phenomenon for a reason! The magical world is richly detailed and the characters lovable.' },
      { bookId: books[5]._id, userId: users[1]._id, rating: 5, reviewText: 'A delightful adventure! Tolkien\'s world-building is phenomenal. Bilbo\'s transformation is inspiring.' },
      { bookId: books[5]._id, userId: users[2]._id, rating: 5, reviewText: 'Perfect introduction to Middle-earth! The writing is whimsical yet epic.' },
      { bookId: books[6]._id, userId: users[1]._id, rating: 4, reviewText: 'Edge-of-your-seat thriller! The puzzles and historical references are fascinating.' },
      { bookId: books[6]._id, userId: users[3]._id, rating: 4, reviewText: 'Gripping mystery with great pacing. Brown weaves history and fiction skillfully.' },
      { bookId: books[7]._id, userId: users[1]._id, rating: 5, reviewText: 'Impossible to put down! Katniss is a strong, complex protagonist. The world-building is intense.' },
      { bookId: books[7]._id, userId: users[2]._id, rating: 4, reviewText: 'Thrilling and thought-provoking. A powerful commentary on reality TV and authoritarianism.' },
      { bookId: books[8]._id, userId: users[1]._id, rating: 5, reviewText: 'Inspiring and philosophical! The message about following your dreams resonates deeply.' },
      { bookId: books[8]._id, userId: users[3]._id, rating: 4, reviewText: 'Beautiful allegory about life and destiny. The prose is lyrical and the wisdom timeless.' },
      { bookId: books[9]._id, userId: users[1]._id, rating: 5, reviewText: 'Mind-expanding! Harari presents human history in a fresh, thought-provoking way.' },
      { bookId: books[9]._id, userId: users[2]._id, rating: 5, reviewText: 'Brilliant and accessible. This book changed how I view human progress and history.' },
      { bookId: books[10]._id, userId: users[0]._id, rating: 4, reviewText: 'Holden\'s voice is authentic and raw. His struggles with identity and belonging are deeply relatable.' },
      { bookId: books[10]._id, userId: users[2]._id, rating: 3, reviewText: 'Interesting perspective on teenage angst, but Holden\'s constant complaining got tiresome.' },
      { bookId: books[11]._id, userId: users[0]._id, rating: 5, reviewText: 'Epic fantasy at its finest! The world-building, characters, and storytelling are unmatched.' },
      { bookId: books[11]._id, userId: users[2]._id, rating: 5, reviewText: 'A masterpiece of fantasy literature. Tolkien created an entire mythology that feels real.' },
      { bookId: books[12]._id, userId: users[0]._id, rating: 5, reviewText: 'Absolutely gripping! The twists kept me on the edge of my seat. Flynn is a master of suspense.' },
      { bookId: books[12]._id, userId: users[2]._id, rating: 4, reviewText: 'Dark and twisted psychological thriller. The ending is unforgettable.' },
      { bookId: books[13]._id, userId: users[0]._id, rating: 5, reviewText: 'Beautifully written and heartbreaking. Death as a narrator is a brilliant choice.' },
      { bookId: books[13]._id, userId: users[1]._id, rating: 5, reviewText: 'One of the most moving books I\'ve ever read. Liesel\'s story will stay with me forever.' },
      { bookId: books[14]._id, userId: users[0]._id, rating: 5, reviewText: 'Intense mystery with unforgettable characters. Lisbeth Salander is iconic!' },
      { bookId: books[14]._id, userId: users[3]._id, rating: 4, reviewText: 'Gripping Scandinavian noir. Complex plot that keeps you guessing.' },
      { bookId: books[15]._id, userId: users[0]._id, rating: 5, reviewText: 'Emotionally powerful. Hosseini writes about redemption and guilt with incredible depth.' },
      { bookId: books[15]._id, userId: users[1]._id, rating: 5, reviewText: 'A deeply moving story about friendship and the scars of the past. Beautifully told.' },
      { bookId: books[16]._id, userId: users[0]._id, rating: 5, reviewText: 'Heart-wrenching yet hopeful. John Green captures teenage love and loss perfectly.' },
      { bookId: books[16]._id, userId: users[2]._id, rating: 4, reviewText: 'Made me cry multiple times. A beautiful meditation on life and mortality.' },
      { bookId: books[17]._id, userId: users[0]._id, rating: 5, reviewText: 'Magical realism at its best! The story works on so many levels - adventure, philosophy, and faith.' },
      { bookId: books[17]._id, userId: users[1]._id, rating: 4, reviewText: 'Fascinating survival story with deeper meanings. The tiger symbolism is brilliant.' },
      { bookId: books[18]._id, userId: users[0]._id, rating: 5, reviewText: 'Terrifying! King is a master of psychological horror. The Overlook Hotel feels alive.' },
      { bookId: books[18]._id, userId: users[1]._id, rating: 5, reviewText: 'Genuinely scary and disturbing. The descent into madness is brilliantly written.' },
      { bookId: books[19]._id, userId: users[0]._id, rating: 5, reviewText: 'Inspiring memoir about the power of education. Tara\'s journey is incredible and courageous.' },
      { bookId: books[19]._id, userId: users[2]._id, rating: 5, reviewText: 'Impossible to put down. A testament to human resilience and the transformative power of learning.' }
    ]);

    console.log(`Created ${reviews.length} sample reviews`);

    for (const book of books) {
      await Review.updateBookRating(book._id);
    }

    console.log('Updated book ratings based on reviews');
    console.log('\n=== Initialization Complete ===');
    console.log(`Users: ${users.length}`);
    console.log(`Books: ${books.length}`);
    console.log(`Reviews: ${reviews.length}`);
    console.log('\nLogin credentials (all passwords: admin123):');
    console.log('- admin@bookreview.com');
    console.log('- sarah@example.com');
    console.log('- mike@example.com');
    console.log('- emma@example.com');
    
  } catch (error) {
    console.error('Error initializing data:', error.message);
  }
};

module.exports = initializeData;