// components/common/BottomNavigation/BottomNavigation.jsx
import { useState, useRef, useEffect } from "react";
import {
  HiOutlineEye,
  HiOutlineLockClosed,
  HiOutlineFilter,
  HiOutlineSearch,
  HiOutlineHome,
  HiOutlineTag,
  HiOutlineStar,
  HiOutlinePhone,
  HiOutlineX,
  HiOutlineSparkles,
} from "react-icons/hi";
import "./BottomNavigation.css";
import "./BottomNavigation.desktop.css";

const BottomNavigation = ({
  currentView,
  onViewChange,
  onAdminClick,
  categories = [],
  selectedCategory,
  onCategoryChange,
  onSearchClick,
  activeSection,
  onSectionChange,
}) => {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowCategoryMenu(false);
        setShowQuickActions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navegación rápida por secciones
  const quickSections = [
    {
      id: "todos",
      icon: HiOutlineHome,
      label: "Inicio",
      color: "var(--primary-blue)",
    },
    {
      id: "populares",
      icon: HiOutlineStar,
      label: "Populares",
      color: "var(--accent-orange)",
    },
    {
      id: "ofertas",
      icon: HiOutlineTag,
      label: "Ofertas",
      color: "var(--accent-green)",
    },
    {
      id: "contacto",
      icon: HiOutlinePhone,
      label: "Contacto",
      color: "var(--accent-purple)",
    },
  ];

  const handleCategorySelect = (category) => {
    onCategoryChange(category);
    setShowCategoryMenu(false);
  };

  const handleSectionSelect = (sectionId) => {
    onSectionChange(sectionId);
    setShowQuickActions(false);
  };

  return (
    <>
      {/* Overlay para menús */}
      {(showCategoryMenu || showQuickActions) && (
        <div className="bottom-nav-overlay" />
      )}

      <nav className="bottom-nav" ref={menuRef}>
        <div className="bottom-nav__container">
          {/* Botón Catálogo/Inicio */}
          <button
            onClick={() => onViewChange("client")}
            className={`bottom-nav__button ${
              currentView === "client"
                ? "bottom-nav__button--active"
                : "bottom-nav__button--inactive"
            }`}
          >
            <HiOutlineEye className="bottom-nav__icon" />
            <span className="bottom-nav__label">Catálogo</span>
          </button>

          {/* Botón Búsqueda */}
          <button
            onClick={onSearchClick}
            className="bottom-nav__button bottom-nav__button--inactive"
          >
            <HiOutlineSearch className="bottom-nav__icon" />
            <span className="bottom-nav__label">Buscar</span>
          </button>

          {/* Botón Principal - Acciones Rápidas */}
          <div className="bottom-nav__center">
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="bottom-nav__main-button"
              aria-label="Acciones rápidas"
            >
              <div className="main-button-content">
                <HiOutlineSparkles className="main-button-icon main-button-icon--sparkle" />
                <HiOutlineFilter className="main-button-icon main-button-icon--filter" />
              </div>
            </button>
          </div>

          {/* Botón Categorías */}
          <button
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className={`bottom-nav__button ${
              selectedCategory !== "Todos"
                ? "bottom-nav__button--active"
                : "bottom-nav__button--inactive"
            }`}
          >
            <HiOutlineTag className="bottom-nav__icon" />
            <span className="bottom-nav__label">
              {selectedCategory !== "Todos" ? selectedCategory : "Categorías"}
            </span>
          </button>

          {/* Botón Admin */}
          <button
            onClick={onAdminClick}
            className="bottom-nav__button bottom-nav__button--inactive"
          >
            <HiOutlineLockClosed className="bottom-nav__icon" />
            <span className="bottom-nav__label">Admin</span>
          </button>
        </div>

        {/* Menú de Categorías */}
        {showCategoryMenu && (
          <div className="bottom-nav-menu category-menu">
            <div className="menu-header">
              <h3 className="menu-title">Filtrar por Categoría</h3>
              <button
                onClick={() => setShowCategoryMenu(false)}
                className="menu-close"
              >
                <HiOutlineX size={18} />
              </button>
            </div>
            <div className="category-list">
              <button
                onClick={() => handleCategorySelect("Todos")}
                className={`category-item ${
                  selectedCategory === "Todos" ? "category-item--active" : ""
                }`}
              >
                <span className="category-name">Todos los productos</span>
                <div className="category-dot"></div>
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`category-item ${
                    selectedCategory === category ? "category-item--active" : ""
                  }`}
                >
                  <span className="category-name">{category}</span>
                  <div className="category-dot"></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menú de Navegación Rápida */}
        {showQuickActions && (
          <div className="bottom-nav-menu quick-actions-menu">
            <div className="menu-header">
              <h3 className="menu-title">Navegación Rápida</h3>
              <button
                onClick={() => setShowQuickActions(false)}
                className="menu-close"
              >
                <HiOutlineX size={18} />
              </button>
            </div>
            <div className="quick-actions-grid">
              {quickSections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionSelect(section.id)}
                    className={`quick-action-item ${
                      activeSection === section.id
                        ? "quick-action-item--active"
                        : ""
                    }`}
                    style={{ "--accent-color": section.color }}
                  >
                    <div className="quick-action-icon">
                      <IconComponent size={20} />
                    </div>
                    <span className="quick-action-label">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default BottomNavigation;
