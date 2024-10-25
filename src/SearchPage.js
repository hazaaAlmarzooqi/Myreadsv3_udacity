import React from "react";
import { Link } from "react-router-dom";

function SearchBook({ query, searchResults, handleSearch, handleShelfChange }) {
  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link to="/" className="close-search">
          Close
        </Link>
        <div className="search-books-input-wrapper">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">
          {searchResults.map((book) => (
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
                <div className="book-authors">{book.authors?.join(", ")}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default SearchBook;
