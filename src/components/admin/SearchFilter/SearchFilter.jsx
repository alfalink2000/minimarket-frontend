// components/admin/SearchFilter/SearchFilter.jsx
import { Search } from "lucide-react";
import "./SearchFilter.css";

const SearchFilter = ({
  searchTerm,
  onSearchChange,
  placeholder = "Buscar...",
  showCategoryFilter = false,
  categories = [],
  selectedCategory = "Todos",
  onCategoryChange = () => {},
}) => {
  return (
    <div className="search-filter">
      <div className="search-filter__search">
        <Search className="search-filter__icon" />
        <input
          type="text"
          placeholder={placeholder}
          className="search-filter__input"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {showCategoryFilter && categories.length > 0 && (
        <div className="search-filter__category">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="search-filter__select"
          >
            <option value="Todos">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
