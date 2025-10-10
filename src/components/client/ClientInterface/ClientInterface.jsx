// components/client/ClientInterface/ClientInterface.jsx
import { useState, useMemo, useEffect, useRef } from "react";
import { loadAppConfig } from "../../../actions/appConfigActions";
import { useProductsSync } from "../../../hooks/useProductsSync";
import { useSelector } from "react-redux";

import {
  HiOutlineShoppingBag,
  HiOutlineFire,
  HiOutlineTag,
  HiOutlinePhone,
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineSearch,
  HiOutlineStar,
  HiOutlineCog,
  HiOutlineInformationCircle,
} from "react-icons/hi";
import { useDispatch } from "react-redux";
import Header from "../../common/Header/Header";
import SearchBar from "../../common/SearchBar/SearchBar";
import CategoryFilter from "../../common/CategoryFilter/CategoryFilter";
import ProductGrid from "../ProductGrid/ProductGrid";
import ProductDetail from "../ProductDetail/ProductDetail";
import BottomNavigation from "../../common/BottomNavigation/BottomNavigation";
import { loadFeaturedProducts } from "../../../actions/featuredProductsActions";
import image from "../../../assets/images/shop.png";

import "./ClientInterface.css";
import "./ClientInterface.desktop.css";

// Importar selectores memoizados
import {
  selectProducts,
  selectCategories,
  selectPopularProducts,
  selectOfferProducts,
  selectCategoryOptions,
  selectFeaturedProducts,
} from "../../../selectors/productSelectors";

const ClientInterface = ({ currentView, onViewChange, onShowLoginForm }) => {
  // 🔄 SINCRONIZACIÓN AUTOMÁTICA DE PRODUCTOS
  useProductsSync(30000);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [activeSection, setActiveSection] = useState("todos");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isSearchSticky, setIsSearchSticky] = useState(false);

  // ✅ REFS PARA DETECTAR SCROLL
  const productsSectionRef = useRef(null);
  const searchBarRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFeaturedProducts());
    dispatch(loadAppConfig());
  }, [dispatch]);

  // ✅ EFECTO PARA DETECTAR TAMAÑO DE PANTALLA
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // ✅ EFECTO PARA DETECTAR SCROLL Y ACTIVAR STICKY (SOLO MÓVIL)
  useEffect(() => {
    if (isDesktop) return; // Solo aplicar en móvil

    const handleScroll = () => {
      if (!productsSectionRef.current || !searchBarRef.current) return;

      const productsSectionTop =
        productsSectionRef.current.getBoundingClientRect().top;
      const searchBarHeight = searchBarRef.current.offsetHeight;

      // Activar sticky cuando el grid de productos esté cerca del top
      setIsSearchSticky(productsSectionTop <= 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDesktop]);

  // ✅ USAR SELECTORES MEMOIZADOS
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const popularProducts = useSelector(selectPopularProducts);
  const offerProducts = useSelector(selectOfferProducts);
  const categoryOptions = useSelector(selectCategoryOptions);
  const featuredProducts = useSelector(selectFeaturedProducts);
  const appConfig = useSelector((state) => state.appConfig.config);

  // ✅ NUEVO: Manejar click en búsqueda desde Bottom Navigation
  const handleSearchClick = () => {
    const searchInput = document.querySelector(
      ".client-interface__search-section input"
    );
    if (searchInput) {
      searchInput.focus();
      // Scroll suave al search bar
      searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // ✅ NUEVO: Manejar cambio de sección desde Bottom Navigation
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    // Scroll al top cuando cambias de sección
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Componente del título con icono
  const TitleWithIcon = () => (
    <div className="header-title-with-icon">
      <img src={image} alt="Icono Minimarket" className="header-icon" />
      <div className="header-text">
        <span className="header-main-title">{appConfig.app_name}</span>
        <span className="header-subtitle">{appConfig.app_description}</span>
      </div>
    </div>
  );

  // ✅ Navegación para desktop que va dentro del Header
  const DesktopNavigation = () => (
    <div className="desktop-navigation">
      {/* Botón de búsqueda avanzada */}
      <button
        className="header-action header-action--icon"
        title="Búsqueda avanzada"
        onClick={() => document.querySelector(".desktop-search input")?.focus()}
      >
        <HiOutlineSearch className="header-action__icon" />
      </button>

      {/* Botón de favoritos */}
      <button
        className="header-action header-action--icon"
        title="Productos destacados"
        onClick={() => setActiveSection("populares")}
      >
        <HiOutlineStar className="header-action__icon" />
      </button>

      {/* Botón de ofertas */}
      <button
        className="header-action header-action--icon"
        title="Ofertas especiales"
        onClick={() => setActiveSection("ofertas")}
      >
        <HiOutlineTag className="header-action__icon" />
      </button>

      {/* Separador visual */}
      <div className="header-separator"></div>

      {/* Botón de contacto rápido */}
      <button
        className="header-action header-action--icon"
        title="Contacto rápido"
        onClick={() => setActiveSection("contacto")}
      >
        <HiOutlinePhone className="header-action__icon" />
      </button>

      {/* Botón de administración */}
      <button
        onClick={onShowLoginForm}
        className="header-action header-action--admin"
        title="Panel de administración"
      >
        <HiOutlineCog className="header-action__icon" />
        <span className="header-action__text">Admin</span>
      </button>
    </div>
  );

  // ✅ FILTRADO CORREGIDO Y MEMOIZADO
  const filteredProducts = useMemo(() => {
    const productsToFilter =
      activeSection === "todos"
        ? products
        : activeSection === "populares"
        ? popularProducts
        : activeSection === "ofertas"
        ? offerProducts
        : products;

    return productsToFilter.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === "Todos" ||
        product.category?.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [
    products,
    popularProducts,
    offerProducts,
    searchTerm,
    selectedCategory,
    activeSection,
  ]);

  // ✅ FUNCIÓN MEJORADA PARA OBTENER PRODUCTOS
  const getProductsToShow = () => {
    return filteredProducts;
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleBackFromDetail = () => {
    setSelectedProduct(null);
  };

  const handleWhatsAppClick = (productName) => {
    const phoneNumber = appConfig.whatsapp_number || "5491112345678";
    const message = `¡Hola! Estoy interesado en el producto: ${productName} que vi en su catálogo online. ¿Podrían ayudarme?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  // ✅ OBTENER CONTADOR DE PRODUCTOS PARA CADA SECCIÓN
  const getProductsCount = () => {
    const productsToShow = getProductsToShow();
    return `${productsToShow.length} ${
      productsToShow.length === 1 ? "producto" : "productos"
    }`;
  };

  // ✅ RENDERIZAR SECCIÓN DE PRODUCTOS POPULARES
  const renderPopularSection = () => {
    if (activeSection !== "populares") return null;

    return (
      <div className="popular-section">
        <div className="section-header">
          <div className="section-title">
            <div className="icon-wrapper trending-icon">
              <HiOutlineFire className="section-icon" />
              <div className="icon-sparkle"></div>
            </div>
            <div className="title-content">
              <h2>Productos Más Vendidos</h2>
              <div className="title-subtitle">
                <span className="trending-badge">🔥 Tendencia</span>
                <span className="products-count-badge">
                  {popularProducts.length} productos
                </span>
              </div>
            </div>
          </div>
          <div className="section-decoration">
            <div className="decoration-line"></div>
            <div className="decoration-pulse"></div>
          </div>
        </div>

        <div className="section-content">
          <p className="section-description">
            Los productos favoritos de nuestros clientes - ¡Descubre lo que más
            aman!
          </p>
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-number">⭐</span>
              <span className="stat-label">Mejor Calificados</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">🚀</span>
              <span className="stat-label">Más Vendidos</span>
            </div>
          </div>
        </div>

        {popularProducts.length === 0 && (
          <div className="no-products-message">
            <HiOutlineFire className="no-products-icon" />
            <p>Próximamente tendremos productos destacados</p>
            <span className="coming-soon">¡Estamos preparando sorpresas!</span>
          </div>
        )}
      </div>
    );
  };

  // ✅ RENDERIZAR SECCIÓN DE OFERTAS
  const renderOffersSection = () => {
    if (activeSection !== "ofertas") return null;

    return (
      <div className="offers-section">
        <div className="section-header">
          <div className="section-title">
            <div className="icon-wrapper offer-icon">
              <HiOutlineTag className="section-icon" />
              <div className="icon-sparkle"></div>
            </div>
            <div className="title-content">
              <h2>Ofertas Especiales</h2>
              <div className="title-subtitle">
                <span className="discount-badge">🎯 Oportunidad Única</span>
                <span className="products-count-badge">
                  {offerProducts.length} ofertas
                </span>
              </div>
            </div>
          </div>
          <div className="offer-badge">
            <HiOutlineSparkles className="badge-icon" />
            <span>LIMITED</span>
          </div>
        </div>

        <div className="section-content">
          <p className="section-description">
            Aprovecha nuestras promociones exclusivas - ¡Precios que no volverás
            a ver!
          </p>
          <div className="offer-features">
            <div className="feature-tag">⚡ Ofertas Flash</div>
            <div className="feature-tag">💰 Precios Especiales</div>
            <div className="feature-tag">🎁 Descuentos Exclusivos</div>
          </div>
        </div>

        {offerProducts.length === 0 && (
          <div className="no-products-message">
            <HiOutlineTag className="no-products-icon" />
            <p>Próximamente tendremos ofertas especiales</p>
            <span className="coming-soon">
              ¡Las mejores promociones están en camino!
            </span>
          </div>
        )}
      </div>
    );
  };

  // ✅ RENDERIZAR SECCIÓN DE CONTACTO
  const renderContactSection = () => {
    if (activeSection !== "contacto") return null;

    return (
      <div className="contact-section">
        <div className="section-header">
          <div className="section-title">
            <HiOutlinePhone className="section-icon contact-icon" />
            <h2>Contáctanos</h2>
          </div>
        </div>
        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-label">
              <HiOutlinePhone className="contact-item-icon" />
              WhatsApp:
            </span>
            <span className="contact-value">{appConfig.whatsapp_number}</span>
          </div>
          <div className="contact-item">
            <span className="contact-label">
              <HiOutlineClock className="contact-item-icon" />
              Horario:
            </span>
            <span className="contact-value">{appConfig.business_hours}</span>
          </div>
          <div className="contact-item">
            <span className="contact-label">
              <HiOutlineLocationMarker className="contact-item-icon" />
              Dirección:
            </span>
            <span className="contact-value">{appConfig.business_address}</span>
          </div>
        </div>
      </div>
    );
  };

  // ✅ RENDERIZADO PARA DESKTOP
  const renderDesktopLayout = () => (
    <div className="client-interface__content desktop-layout">
      {/* Barra de búsqueda */}
      <div className="client-interface__search-section desktop-search">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      </div>

      {/* Sidebar con navegación y filtros */}
      <div className="desktop-sidebar">
        {/* Navegación por secciones en sidebar */}
        <div className="desktop-sections-nav">
          <button
            className={`desktop-section-button ${
              activeSection === "todos" ? "desktop-section-button--active" : ""
            }`}
            onClick={() => setActiveSection("todos")}
          >
            <HiOutlineShoppingBag className="desktop-section-icon" />
            <span className="desktop-section-text">Todos los Productos</span>
            <span className="desktop-section-badge">{products.length}</span>
          </button>

          <button
            className={`desktop-section-button ${
              activeSection === "populares"
                ? "desktop-section-button--active"
                : ""
            }`}
            onClick={() => setActiveSection("populares")}
          >
            <HiOutlineFire className="desktop-section-icon" />
            <span className="desktop-section-text">Populares</span>
            <span className="desktop-section-badge">
              {popularProducts.length}
            </span>
          </button>

          <button
            className={`desktop-section-button ${
              activeSection === "ofertas"
                ? "desktop-section-button--active"
                : ""
            }`}
            onClick={() => setActiveSection("ofertas")}
          >
            <HiOutlineTag className="desktop-section-icon" />
            <span className="desktop-section-text">Ofertas</span>
            <span className="desktop-section-badge">
              {offerProducts.length}
            </span>
          </button>

          <button
            className={`desktop-section-button ${
              activeSection === "contacto"
                ? "desktop-section-button--active"
                : ""
            }`}
            onClick={() => setActiveSection("contacto")}
          >
            <HiOutlinePhone className="desktop-section-icon" />
            <span className="desktop-section-text">Contacto</span>
          </button>
        </div>

        {/* Filtros de categoría - SOLO para secciones de productos */}
        {(activeSection === "todos" ||
          activeSection === "populares" ||
          activeSection === "ofertas") && (
          <div className="desktop-filters">
            <div className="filters-header desktop-filters-header">
              <h3 className="filters-title">Filtrar por Categoría</h3>
              <span className="products-count">{getProductsCount()}</span>
            </div>

            <div className="desktop-category-filter">
              <CategoryFilter
                categories={categoryOptions}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="desktop-main-content">
        {/* Renderizar sección activa */}
        {activeSection === "populares" && renderPopularSection()}
        {activeSection === "ofertas" && renderOffersSection()}
        {activeSection === "contacto" && renderContactSection()}

        {/* Grid de productos para secciones de productos */}
        {(activeSection === "todos" ||
          activeSection === "populares" ||
          activeSection === "ofertas") && (
          <div className="desktop-products-section">
            <ProductGrid
              products={getProductsToShow()}
              onWhatsAppClick={handleWhatsAppClick}
              onProductClick={handleProductClick}
              isOfferSection={activeSection === "ofertas"}
            />
          </div>
        )}
      </div>
    </div>
  );

  // ✅ RENDERIZADO PARA MÓVIL
  const renderMobileLayout = () => (
    <div
      className={`client-interface__content mobile-layout ${
        isSearchSticky ? "has-sticky-search" : ""
      }`}
    >
      {/* Search Bar - ahora con ref y condición sticky */}
      <div ref={searchBarRef} className="client-interface__search-section">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isSticky={isSearchSticky}
        />
      </div>

      {/* Navegación por secciones */}
      <div className="sections-navigation">
        <button
          className={`nav-button ${activeSection === "todos" ? "active" : ""}`}
          onClick={() => setActiveSection("todos")}
        >
          <HiOutlineShoppingBag className="nav-icon" />
          <span className="nav-text">Todos</span>
        </button>

        <button
          className={`nav-button ${
            activeSection === "populares" ? "active" : ""
          }`}
          onClick={() => setActiveSection("populares")}
        >
          <HiOutlineFire className="nav-icon" />
          <span className="nav-text">Populares</span>
        </button>

        <button
          className={`nav-button ${
            activeSection === "ofertas" ? "active" : ""
          }`}
          onClick={() => setActiveSection("ofertas")}
        >
          <HiOutlineTag className="nav-icon" />
          <span className="nav-text">Ofertas</span>
        </button>

        <button
          className={`nav-button ${
            activeSection === "contacto" ? "active" : ""
          }`}
          onClick={() => setActiveSection("contacto")}
        >
          <HiOutlinePhone className="nav-icon" />
          <span className="nav-text">Contacto</span>
        </button>
      </div>

      {/* Sección de filtros */}
      {(activeSection === "todos" ||
        activeSection === "populares" ||
        activeSection === "ofertas") && (
        <>
          <div className="filters-header">
            <h3 className="filters-title">Categorías</h3>
            <div className="header-ornament">
              <span className="ornament-dot"></span>
              <span className="ornament-dot"></span>
              <span className="ornament-dot"></span>
            </div>
            <span className="products-count">{getProductsCount()}</span>
          </div>

          <div className="client-interface__filters-section">
            <div className="filters-container">
              <CategoryFilter
                categories={categoryOptions}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>
        </>
      )}

      {/* Renderizar sección específica */}
      {renderPopularSection()}
      {renderContactSection()}
      {renderOffersSection()}

      {/* Sección de productos - con ref para detectar scroll */}
      {(activeSection === "todos" ||
        activeSection === "populares" ||
        activeSection === "ofertas") && (
        <div
          ref={productsSectionRef}
          className="client-interface__products-section"
        >
          <ProductGrid
            products={getProductsToShow()}
            onWhatsAppClick={handleWhatsAppClick}
            onProductClick={handleProductClick}
            isOfferSection={activeSection === "ofertas"}
          />
        </div>
      )}
    </div>
  );

  // ✅ Si hay un producto seleccionado, mostrar la vista detallada
  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={handleBackFromDetail}
        onWhatsAppClick={handleWhatsAppClick}
      />
    );
  }

  return (
    <div className="client-interface">
      <Header title={<TitleWithIcon />}>
        <DesktopNavigation />
      </Header>

      {/* Renderizar layout según el dispositivo */}
      {isDesktop ? renderDesktopLayout() : renderMobileLayout()}

      {/* Bottom Navigation - Solo móvil */}
      {!isDesktop && (
        <BottomNavigation
          currentView={currentView}
          onViewChange={onViewChange}
          onAdminClick={onShowLoginForm}
          // ✅ NUEVAS PROPS PARA EL BOTTOM NAVIGATION MEJORADO
          categories={categoryOptions}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onSearchClick={handleSearchClick}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
      )}
    </div>
  );
};

export default ClientInterface;
