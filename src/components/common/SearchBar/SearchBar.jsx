import { Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import "./SearchBar.css";

const SearchBar = ({ searchTerm, onSearchChange, isSticky = false }) => {
  return (
    <div className={`search-bar ${isSticky ? "search-bar--sticky" : ""}`}>
      <Search className="search-bar__icon" />
      <input
        type="text"
        placeholder="Buscar productos..."
        className="search-bar__input"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
