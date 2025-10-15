import { Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import "./SearchBar.css";

const SearchBar = ({
  searchTerm,
  onSearchChange,
  isDesktop = false,
  appConfig,
}) => {
  return (
    <div className={`search-bar ${isDesktop ? "search-bar--desktop" : ""}`}>
      <div className="search-bar__content">
        <div className="search-bar__input-container">
          <Search className="search-bar__icon" />
          <input
            type="text"
            placeholder="Buscar productos..."
            className="search-bar__input"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Campo de información para desktop */}
        {isDesktop && (
          <div className="search-bar__location-info">
            <HiOutlineLocationMarker className="location-info__icon" />
            <span className="location-info__text">
              {appConfig?.business_address || "Pinar del Río, Cuba"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
