// ClientInterface.js - VERSIÓN SIN LOADING INTERNO
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useProductsSync } from "../../../hooks/useProductsSync";
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

// Components
import Header from "../../common/Header/Header";
import SearchBar from "../../common/SearchBar/SearchBar";
import CategoryFilter from "../../common/CategoryFilter/CategoryFilter";
import ProductGrid from "../ProductGrid/ProductGrid";
import ProductDetail from "../ProductDetail/ProductDetail";
import BottomNavigation from "../../common/BottomNavigation/BottomNavigation";
import InitialInfoModal from "../../common/InitialInfoModal/InitialInfoModal";
import CartModal from "../../common/CartModal/CartModal";

// Actions & Selectors
import { loadFeaturedProducts } from "../../../actions/featuredProductsActions";
import {
  selectProducts,
  selectCategories,
  selectPopularProducts,
  selectOfferProducts,
  selectCategoryOptions,
  selectFeaturedProducts,
} from "../../../selectors/productSelectors";

import image from "../../../assets/images/shop.png";
import "./ClientInterface.css";
import "./ClientInterface.desktop.css";

// Constantes para evitar recreación
const SECTIONS = {
  TODOS: "todos",
  POPULARES: "populares",
  OFERTAS: "ofertas",
  CONTACTO: "contacto",
};

const PRODUCT_SECTIONS = [SECTIONS.TODOS, SECTIONS.POPULARES, SECTIONS.OFERTAS];

const ClientInterface = ({ currentView, onViewChange, onShowLoginForm }) => {
  // 🔄 SINCRONIZACIÓN AUTOMÁTICA DE PRODUCTOS
  useProductsSync(30000);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [activeSection, setActiveSection] = useState(SECTIONS.TODOS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  // ⚠️ ELIMINAMOS el isLoading interno

  const dispatch = useDispatch();

  // Selectores memoizados
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const popularProducts = useSelector(selectPopularProducts);
  const offerProducts = useSelector(selectOfferProducts);
  const categoryOptions = useSelector(selectCategoryOptions);
  const featuredProducts = useSelector(selectFeaturedProducts);
  const appConfig = useSelector((state) => state.appConfig.config);

  // ✅ ELIMINAR EFECTO DE LOADING INTERNO - LA APP PRINCIPAL YA LO MANEJA
  // useEffect(() => {
  //   // ESTE EFECTO CAUSABA EL PROBLEMA - LO ELIMINAMOS
  // }, [appConfig, products, categories]);

  // ✅ EFECTO PARA MOSTRAR MODAL AL INICIAR (SOLO SI HAY CONFIGURACIÓN)
  useEffect(() => {
    if (appConfig?.show_initialinfo !== false) {
      const timer = setTimeout(() => setShowInfoModal(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [appConfig?.show_initialinfo]);

  // ✅ EFECTO PARA CARGAR DATOS ADICIONALES (SI HAY PRODUCTOS)
  useEffect(() => {
    if (Array.isArray(products) && Array.isArray(categories)) {
      dispatch(loadFeaturedProducts());
    }
  }, [dispatch, products, categories]);

  // ✅ EFECTO PARA DETECTAR TAMAÑO DE PANTALLA
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // ✅ Handlers optimizados con useCallback
  const handleSearchClick = useCallback(() => {
    const searchInput = document.querySelector(
      ".client-interface__search-section input"
    );
    searchInput?.focus();
  }, []);

  const handleSectionChange = useCallback((sectionId) => {
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleProductClick = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  const handleBackFromDetail = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleWhatsAppClick = useCallback(
    (productName) => {
      const phoneNumber = appConfig?.whatsapp_number || "5491112345678";
      const message = `¡Hola! Estoy interesado en el producto: ${productName} que vi en su catálogo online. ¿Podrían ayudarme?`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
    },
    [appConfig?.whatsapp_number]
  );

  // ✅ Componentes memoizados
  const InfoButton = useCallback(
    () => (
      <button
        className="header-action header-action--icon"
        title="Información de la tienda"
        onClick={() => setShowInfoModal(true)}
      >
        <HiOutlineInformationCircle className="header-action__icon" />
      </button>
    ),
    []
  );

  const FloatingWhatsAppButton = useCallback(() => {
    const handleWhatsAppClick = () => {
      const phoneNumber = appConfig?.whatsapp_number || "5491112345678";
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
  }, [appConfig?.whatsapp_number]);

  const TitleWithIcon = useCallback(() => {
    const handleImageError = (e) => {
      e.target.src = image;
      e.target.onerror = null;
    };

    const isValidLogoUrl = (url) => {
      if (!url) return false;
      try {
        const parsedUrl = new URL(url);
        return (
          parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
        );
      } catch {
        return false;
      }
    };

    const logoUrl = appConfig?.logo_url;
    const shouldUseCustomLogo = isValidLogoUrl(logoUrl);

    return (
      <div className="header-title-with-icon">
        <img
          src={shouldUseCustomLogo ? logoUrl : image}
          alt={`Logo ${appConfig?.app_name}`}
          className="header-icon"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="header-text">
          <span className="header-main-title">{appConfig?.app_name}</span>
          <span className="header-subtitle">{appConfig?.app_description}</span>
        </div>
      </div>
    );
  }, [appConfig]);

  const DesktopNavigation = useCallback(
    () => (
      <div className="desktop-navigation">
        <InfoButton />
        <button
          className="header-action header-action--icon"
          title="Búsqueda avanzada"
          onClick={() =>
            document.querySelector(".desktop-search input")?.focus()
          }
        >
          <HiOutlineSearch className="header-action__icon" />
        </button>
        <button
          className="header-action header-action--icon"
          title="Productos destacados"
          onClick={() => setActiveSection(SECTIONS.POPULARES)}
        >
          <HiOutlineStar className="header-action__icon" />
        </button>
        <button
          className="header-action header-action--icon"
          title="Ofertas especiales"
          onClick={() => setActiveSection(SECTIONS.OFERTAS)}
        >
          <HiOutlineTag className="header-action__icon" />
        </button>

        <div className="header-separator"></div>
        <button
          className="header-action header-action--icon"
          title="Contacto rápido"
          onClick={() => setActiveSection(SECTIONS.CONTACTO)}
        >
          <HiOutlinePhone className="header-action__icon" />
        </button>
        <button
          onClick={onShowLoginForm}
          className="header-action header-action--admin"
          title="Panel de administración"
        >
          <HiOutlineCog className="header-action__icon" />
          <span className="header-action__text">Admin</span>
        </button>
      </div>
    ),
    [onShowLoginForm]
  );

  // ✅ FILTRADO CORREGIDO Y MEMOIZADO
  const filteredProducts = useMemo(() => {
    const productsToFilter =
      activeSection === SECTIONS.TODOS
        ? products
        : activeSection === SECTIONS.POPULARES
        ? popularProducts
        : activeSection === SECTIONS.OFERTAS
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
  const getProductsToShow = useCallback(
    () => filteredProducts,
    [filteredProducts]
  );

  // ✅ OBTENER CONTADOR DE PRODUCTOS
  const getProductsCount = useCallback(() => {
    const productsToShow = getProductsToShow();
    return `${productsToShow.length} ${
      productsToShow.length === 1 ? "producto" : "productos"
    }`;
  }, [getProductsToShow]);

  // ✅ COMPONENTES DE SECCIÓN MEMOIZADOS
  const renderPopularSection = useMemo(() => {
    if (activeSection !== SECTIONS.POPULARES) return null;

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
  }, [activeSection, popularProducts]);

  const renderOffersSection = useMemo(() => {
    if (activeSection !== SECTIONS.OFERTAS) return null;

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
  }, [activeSection, offerProducts]);

  const renderContactSection = useMemo(() => {
    if (activeSection !== SECTIONS.CONTACTO) return null;

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
            <span className="contact-value">{appConfig?.whatsapp_number}</span>
          </div>
          <div className="contact-item">
            <span className="contact-label">
              <HiOutlineClock className="contact-item-icon" />
              Horario:
            </span>
            <span className="contact-value">{appConfig?.business_hours}</span>
          </div>
          <div className="contact-item">
            <span className="contact-label">
              <HiOutlineLocationMarker className="contact-item-icon" />
              Dirección:
            </span>
            <span className="contact-value">{appConfig?.business_address}</span>
          </div>
        </div>
      </div>
    );
  }, [activeSection, appConfig]);

  // ✅ RENDERIZADO PARA DESKTOP OPTIMIZADO
  const renderDesktopLayout = useMemo(
    () => (
      <div className="client-interface__content desktop-layout">
        <div className="client-interface__search-section desktop-search">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            isDesktop={true}
            appConfig={appConfig}
          />
        </div>

        <div className="desktop-sidebar">
          <div className="desktop-sections-nav">
            {[
              {
                id: SECTIONS.TODOS,
                icon: HiOutlineShoppingBag,
                label: "Todos los Productos",
                count: products.length,
              },
              {
                id: SECTIONS.POPULARES,
                icon: HiOutlineFire,
                label: "Populares",
                count: popularProducts.length,
              },
              {
                id: SECTIONS.OFERTAS,
                icon: HiOutlineTag,
                label: "Ofertas",
                count: offerProducts.length,
              },
              {
                id: SECTIONS.CONTACTO,
                icon: HiOutlinePhone,
                label: "Contacto",
              },
            ].map(({ id, icon: Icon, label, count }) => (
              <button
                key={id}
                className={`desktop-section-button ${
                  activeSection === id ? "desktop-section-button--active" : ""
                }`}
                onClick={() => setActiveSection(id)}
              >
                <Icon className="desktop-section-icon" />
                <span className="desktop-section-text">{label}</span>
                {count !== undefined && (
                  <span className="desktop-section-badge">{count}</span>
                )}
              </button>
            ))}
          </div>

          {PRODUCT_SECTIONS.includes(activeSection) && (
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

        <div className="desktop-main-content">
          {activeSection === SECTIONS.POPULARES && renderPopularSection}
          {activeSection === SECTIONS.OFERTAS && renderOffersSection}
          {activeSection === SECTIONS.CONTACTO && renderContactSection}

          {PRODUCT_SECTIONS.includes(activeSection) && (
            <div className="desktop-products-section">
              <ProductGrid
                products={getProductsToShow()}
                onWhatsAppClick={handleWhatsAppClick}
                onProductClick={handleProductClick}
                isOfferSection={activeSection === SECTIONS.OFERTAS}
              />
            </div>
          )}
        </div>
      </div>
    ),
    [
      searchTerm,
      appConfig,
      activeSection,
      products.length,
      popularProducts.length,
      offerProducts.length,
      categoryOptions,
      selectedCategory,
      getProductsCount,
      renderPopularSection,
      renderOffersSection,
      renderContactSection,
      getProductsToShow,
      handleWhatsAppClick,
      handleProductClick,
    ]
  );

  // ✅ RENDERIZADO PARA MÓVIL OPTIMIZADO
  const renderMobileLayout = useMemo(
    () => (
      <div className="client-interface__content mobile-layout">
        <div className="client-interface__search-section">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            isDesktop={false}
            appConfig={appConfig}
          />
        </div>

        <div className="sections-navigation">
          {[
            { id: SECTIONS.TODOS, icon: HiOutlineShoppingBag, label: "Todos" },
            { id: SECTIONS.POPULARES, icon: HiOutlineFire, label: "Populares" },
            { id: SECTIONS.OFERTAS, icon: HiOutlineTag, label: "Ofertas" },
            { id: SECTIONS.CONTACTO, icon: HiOutlinePhone, label: "Contacto" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={`nav-button ${activeSection === id ? "active" : ""}`}
              onClick={() => setActiveSection(id)}
            >
              <Icon className="nav-icon" />
              <span className="nav-text">{label}</span>
            </button>
          ))}
        </div>

        {PRODUCT_SECTIONS.includes(activeSection) && (
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

        {renderPopularSection}
        {renderContactSection}
        {renderOffersSection}

        {PRODUCT_SECTIONS.includes(activeSection) && (
          <div className="client-interface__products-section">
            <ProductGrid
              products={getProductsToShow()}
              onWhatsAppClick={handleWhatsAppClick}
              onProductClick={handleProductClick}
              isOfferSection={activeSection === SECTIONS.OFERTAS}
            />
          </div>
        )}
      </div>
    ),
    [
      searchTerm,
      appConfig,
      activeSection,
      categoryOptions,
      selectedCategory,
      getProductsCount,
      renderPopularSection,
      renderContactSection,
      renderOffersSection,
      getProductsToShow,
      handleWhatsAppClick,
      handleProductClick,
    ]
  );

  // ✅ **ELIMINAMOS COMPLETAMENTE LA VERIFICACIÓN DE CARGA INTERNA**
  // El loading principal ya se maneja en App.js

  // ✅ Si no hay configuración, mostrar error mínimo
  if (!appConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Error de configuración</p>
          <p className="text-sm text-gray-500 mt-2">
            No se pudo cargar la configuración de la aplicación
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

  // ✅ RENDERIZADO PRINCIPAL - SIN VERIFICACIONES DE LOADING
  return (
    <div className="client-interface">
      <Header
        title={<TitleWithIcon />}
        onInfoClick={() => setShowInfoModal(true)}
        showInfoButton={!isDesktop}
      >
        <DesktopNavigation />
      </Header>

      {/* AGREGAR EL MODAL DEL CARRITO */}
      <CartModal />

      <InitialInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        initialInfo={appConfig.initialinfo}
      />

      {isDesktop ? renderDesktopLayout : renderMobileLayout}

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

      <FloatingWhatsAppButton />
    </div>
  );
};

export default ClientInterface;
