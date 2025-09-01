class Book {
  constructor(title, author, available = true) {
    this.title = title;
    this.author = author;
    this.available = available;
  }
}

const library = {
  books: [],

  addBook: function (title, author) {
    const book = new Book(title, author);
    this.books.push(book);
    //console.log(`Added book: "${book.title}" by ${book.author}`);
  },

  checkOutBook: function (title) {
    try {
      const book = this.books.find((b) => b.title === title);
      if (!book) {
        throw new Error(`Sorry, "${title}" is not in our catalog.`);
      }
      if (!book.available) {
        throw new Error(`Sorry, "${title}" is currently checked out.`);
      }

      book.available = false;
      console.log(`You have checked out "${book.title}" by ${book.author}.`);
    } catch (error) {
      console.error(error.message);
    }
  },

  getAvailableBooks: function () {
    const availableBooks = this.books.filter((book) => book.available);
    console.log(
      `There are ${availableBooks.length} available books: 
      ${availableBooks.map((b) => `"${b.title}"`).join(", ")}`
    );
  },
};

const newBooks = `[
  {"title": "Grokking the Coding Interview","author": "J.W. Kim & S.S. Kim"},
  {"title": "Clean Code","author": "Robert C. Martin"},
  {"title": "The Pragmatic Programmer","author": "Andrew Hunt & David Thomas"},
  {"title": "Cracking the Coding Interview","author": "Gayle Laakmann McDowell"}
]`;

function receiveBooks(bookData) {
  console.log("Filling library with books");
  const booksToAdd = JSON.parse(bookData);
  for (let book of booksToAdd) {
    library.addBook(book.title, book.author);
  }
}

// Tests

console.log(
  `There are currently ${library.books.length} books in the library's database.`
);
library.addBook("Eloquent JavaScript", "Marijn Haverbeke");
receiveBooks(newBooks);

library.checkOutBook("Eloquent JavaScript");
library.checkOutBook("Grokking the Coding Interview");
library.getAvailableBooks();
