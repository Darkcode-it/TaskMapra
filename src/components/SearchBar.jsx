import React from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = "Search users..." }) => {
  const handleSearch = (event) => {
    onSearch(event.target.value);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <svg
          className="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          onChange={handleSearch}
          className="search-input"
          aria-label="Search"
        />
      </div>
    </div>
  );
};

export default SearchBar; 