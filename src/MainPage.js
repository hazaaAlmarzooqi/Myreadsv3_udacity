import React from "react";
import { Link } from "react-router-dom";

function MainPage({ books, handleShelfChange, renderShelf }) {
  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
        {renderShelf("currentlyReading", "Currently Reading")}
        {renderShelf("wantToRead", "Want to Read")}
        {renderShelf("read", "Read")}
      </div>
      <div className="open-search">
        <Link to="/search">Add a book</Link>
      </div>
    </div>
  );
}

export default MainPage;
