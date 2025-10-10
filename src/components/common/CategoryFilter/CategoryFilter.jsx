import { useRef, useEffect } from "react";
import "./CategoryFilter.css";

const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  productsCount, // Nueva prop para la cantidad de productos
}) => {
  const scrollContainerRef = useRef(null);

  // Efecto para detectar si hay scroll disponible
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const handleScroll = () => {
        if (container.scrollWidth > container.clientWidth) {
          container.classList.add("scrollable");
        } else {
          container.classList.remove("scrollable");
        }
      };

      // Verificar inicialmente
      handleScroll();

      // Revisar en resize
      window.addEventListener("resize", handleScroll);
      return () => window.removeEventListener("resize", handleScroll);
    }
  }, [categories]);

  return (
    <>
      <div className="category-filter-wrapper">
        {/* Header con título y contador */}

        {/* Filtro de categorías scrollable */}
        <div className="category-filter" ref={scrollContainerRef}>
          <div className="category-filter__container">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`category-filter__button ${
                  selectedCategory === category
                    ? "category-filter__button--active"
                    : ""
                }`}
                aria-pressed={selectedCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryFilter;
