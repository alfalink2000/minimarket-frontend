// components/client/ClientInterface/ClientInterface.jsx
import { useState, useMemo, useEffect } from "react";
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

  const dispatch = useDispatch();

  // ✅ VERIFICAR QUE TENEMOS DATOS ANTES DE RENDERIZAR
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const popularProducts = useSelector(selectPopularProducts);
  const offerProducts = useSelector(selectOfferProducts);
  const categoryOptions = useSelector(selectCategoryOptions);
  const featuredProducts = useSelector(selectFeaturedProducts);
  const appConfig = useSelector((state) => state.appConfig.config);

  // ✅ EFECTO PARA CARGAR DATOS ADICIONALES (SOLO SI NO EXISTEN)
  useEffect(() => {
    if (products.length === 0 || categories.length === 0) {
      console.log("🔄 ClientInterface: Cargando datos adicionales...");
      dispatch(loadFeaturedProducts());
    }
  }, [dispatch, products.length, categories.length]);

  // ✅ EFECTO PARA DETECTAR TAMAÑO DE PANTALLA
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // ✅ Manejar click en búsqueda desde Bottom Navigation
  const handleSearchClick = () => {
    const searchInput = document.querySelector(
      ".client-interface__search-section input"
    );

    if (searchInput) {
      searchInput.focus();
    }
  };

  // ✅ Manejar cambio de sección desde Bottom Navigation
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    // Scroll al top cuando cambias de sección
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ BOTÓN FLOTANTE DE WHATSAPP
  const FloatingWhatsAppButton = () => {
    const handleWhatsAppClick = () => {
      const phoneNumber = appConfig.whatsapp_number || "5491112345678";
      const message = `¡Hola! Me gustaría obtener más información sobre sus productos y servicios. ¿Podrían ayudarme?`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
    };

    return (
      <button
        className="floating-whatsapp-button"
        onClick={handleWhatsAppClick}
        title="Contactar por WhatsApp"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="whatsapp-icon"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.262-6.187-3.55-8.444" />
        </svg>
        <div className="whatsapp-pulse"></div>
      </button>
    );
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
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isDesktop={true}
          appConfig={appConfig}
        />
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
    <div className="client-interface__content mobile-layout">
      {/* Search Bar */}
      <div className="client-interface__search-section">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isDesktop={false}
          appConfig={appConfig}
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

      {/* Sección de productos */}
      {(activeSection === "todos" ||
        activeSection === "populares" ||
        activeSection === "ofertas") && (
        <div className="client-interface__products-section">
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

  // ✅ VERIFICACIÓN DE DATOS - MOSTRAR LOADING SI FALTAN DATOS
  if (!appConfig || products.length === 0 || categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Preparando interfaz...</p>
          <p className="text-sm text-gray-500 mt-2">
            {appConfig?.app_name || "Cargando..."}
          </p>
        </div>
      </div>
    );
  }

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
          categories={categoryOptions}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onSearchClick={handleSearchClick}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
      )}
      {/* ✅ BOTÓN FLOTANTE DE WHATSAPP */}
      <FloatingWhatsAppButton />
    </div>
  );
};

export default ClientInterface;
