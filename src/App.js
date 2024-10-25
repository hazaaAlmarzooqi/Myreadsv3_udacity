import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import MainPage from "./MainPage";
import SearchBook from "./SearchPage";

function App() {
  const defaultBooks = [
    {
      id: 'AvBvB2Ux7UUC',
      title: "Geronimo Stilton and the Kingdom of Fantasy #1: The Kingdom of Fantasy",
      author: "Geronimo Stilton",
      shelf: "currentlyReading",
      coverUrl: "",
    },
    {
      id: 'zpQ4Vv30fAgC',
      title: "Fitness!",
      author:"Orson Scott Card",
      shelf: "currentlyReading",
      coverUrl: "",
    },
    {
      id: 'Du_mTZwlWRUC',
      title: "Fitness for Work",
      author: "Keith T Palmer, Ian Brown, John Hobson",
      shelf: "wantToRead",
      coverUrl: "",
    },
    {
      id: 'ti6zoAC9Ph8C',
      title: "Types and Programming Languages",
      author: "Benjamin C. Pierce",
      shelf: "wantToRead",
      coverUrl: "",
    },
    {
      id: 'CUIgM3e-I5gC',
      title: "Core Python Programming",
      author: "Wesley J Chun",
      shelf: "read",
      coverUrl: "",
    },
  ];

  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("books");
    return savedBooks ? JSON.parse(savedBooks) : defaultBooks;
  });
  
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchCovers = async () => {
      const updatedBooks = await Promise.all(
        books.map(async (book) => {
          try {
            const bookFromAPI = await BooksAPI.get(book.id);
            return {
              ...book,
              coverUrl: bookFromAPI.imageLinks ? bookFromAPI.imageLinks.thumbnail : book.coverUrl,
            };
          } catch (error) {
            console.error(`Error fetching cover for ${book.title}:`, error);
            return book;
          }
        })
      );
      setBooks(updatedBooks);
    };

    fetchCovers();
  }, []);

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  const handleShelfChange = (book, newShelf) => {
    let updatedBooks = books.map((b) =>
      b.id === book.id ? { ...b, shelf: newShelf } : b
    );
  
    if (!books.find((b) => b.id === book.id)) {
      const newBook = {
        id: book.id,
        title: book.title,
        authors: book.authors || ["Unknown Author"],
        coverUrl: book.imageLinks ? book.imageLinks.thumbnail : "",
        shelf: newShelf,
      };
      updatedBooks = [...updatedBooks, newBook];
    }
  
    setBooks(updatedBooks);
    BooksAPI.update(book, newShelf);
  };

  const handleSearch = (query) => {
    setQuery(query);
    if (query) {
      BooksAPI.search(query, 20).then((results) => {
        if (results && !results.error) {
          const filteredResults = results.map((result) => {
            const matchedBook = books.find((b) => b.id === result.id);
            return {
              ...result,
              shelf: matchedBook ? matchedBook.shelf : "none",
              coverUrl: result.imageLinks ? result.imageLinks.thumbnail : "",
            };
          });
          setSearchResults(filteredResults);
        } else {
          setSearchResults([]);
        }
      });
    } else {
      setSearchResults([]);
    }
  };

  const renderShelf = (shelfName, shelfTitle) => (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{shelfTitle}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {books
            .filter((book) => book.shelf === shelfName)
            .map((book) => (
              <li key={book.id}>
                <div className="book">
                  <div className="book-top">
                    <div
                      className="book-cover"
                      style={{
                        width: 128,
                        height: 193,
                        backgroundImage: `url(${book.coverUrl})`,
                      }}
                    ></div>
                    <div className="book-shelf-changer">
                      <select
                        value={book.shelf}
                        onChange={(e) => handleShelfChange(book, e.target.value)}
                      >
                        <option value="none" disabled>
                          Move to...
                        </option>
                        <option value="currentlyReading">Currently Reading</option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                  <div className="book-title">{book.title}</div>
                  <div className="book-authors">
                    {book.authors ? book.authors.join(", ") : book.author}
                  </div>                
                </div>
              </li>
            ))}
        </ol>
      </div>
    </div>
  );

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <MainPage 
                books={books} 
                handleShelfChange={handleShelfChange} 
                renderShelf={renderShelf} 
              />
            }
          />
          <Route
            path="/search"
            element={
              <SearchBook
                query={query}
                searchResults={searchResults}
                handleSearch={handleSearch}
                handleShelfChange={handleShelfChange}
                onCloseSearch={() => setQuery("")}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
