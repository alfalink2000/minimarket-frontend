// components/client/ProductDetail/ProductDetail.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  HiOutlineArrowLeft,
  HiOutlineShoppingBag,
  HiOutlineShieldCheck,
  HiOutlineClock,
} from "react-icons/hi";
import { FiPhone, FiShare2 } from "react-icons/fi";
import "./ProductDetail.css";

// Componente memoizado para evitar re-renders innecesarios
const Thumbnail = React.memo(({ image, index, isActive, onClick }) => (
  <button
    className={`thumbnail-premium ${isActive ? "active" : ""}`}
    onClick={() => onClick(index)}
    aria-label={`Ver imagen ${index + 1}`}
  >
    <img src={image} alt={`Vista ${index + 1}`} loading="lazy" />
    <div className="thumbnail-overlay"></div>
  </button>
));

const ProductDetail = ({ product, onBack, onWhatsAppClick }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Scroll al top con useEffect optimizado
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Memoizar valores computados
  const { isAvailable, images, formattedPrice } = useMemo(
    () => ({
      isAvailable:
        product?.status === "available" && product?.stock_quantity > 0,
      images: [product?.image_url].filter(Boolean),
      formattedPrice: product?.price
        ? `$${parseFloat(product.price).toFixed(2)}`
        : "$0.00",
    }),
    [product]
  );

  // Handlers memoizados
  const handleWhatsAppClick = useCallback(() => {
    onWhatsAppClick(product.name);
  }, [onWhatsAppClick, product?.name]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Podrías usar un toast en lugar de alert
      alert("Enlace copiado al portapapeles");
    }
  }, [product]);

  const handleImageSelect = useCallback((index) => {
    setSelectedImage(index);
  }, []);

  const handleImageError = useCallback((e) => {
    e.target.src =
      "https://via.placeholder.com/600x600/ffffff/374151?text=Imagen+No+Disponible";
  }, []);

  // Early return optimizado
  if (!product) return null;

  return (
    <div className="product-detail-premium">
      {/* Elementos decorativos de fondo */}
      <div className="floating-decoration decoration-1"></div>
      <div className="floating-decoration decoration-2"></div>

      {/* Botón flotante */}
      <div className="floating-header">
        <button
          className="floating-back-button"
          onClick={onBack}
          aria-label="Volver atrás"
        >
          <HiOutlineArrowLeft className="back-icon" />
        </button>
      </div>

      <main className="product-detail__content-premium">
        <GallerySection
          images={images}
          selectedImage={selectedImage}
          imageLoaded={imageLoaded}
          isAvailable={isAvailable}
          productName={product.name}
          onImageSelect={handleImageSelect}
          onImageLoad={() => setImageLoaded(true)}
          onImageError={handleImageError}
        />

        <InfoSection
          product={product}
          isAvailable={isAvailable}
          formattedPrice={formattedPrice}
          onWhatsAppClick={handleWhatsAppClick}
        />
      </main>
    </div>
  );
};

// Subcomponente para la galería
const GallerySection = React.memo(
  ({
    images,
    selectedImage,
    imageLoaded,
    isAvailable,
    productName,
    onImageSelect,
    onImageLoad,
    onImageError,
  }) => (
    <section className="gallery-section">
      <div className="gallery-container">
        <div className="main-image-frame">
          <div className="image-wrapper">
            <img
              src={images[selectedImage]}
              alt={productName}
              className={`main-image-premium ${imageLoaded ? "loaded" : ""}`}
              onLoad={onImageLoad}
              onError={onImageError}
              loading="eager" // La imagen principal carga prioritariamente
            />
            {!imageLoaded && <div className="image-skeleton"></div>}

            <div
              className={`product-badge ${
                isAvailable ? "available" : "sold-out"
              }`}
            >
              {isAvailable ? "🟢 Disponible" : "🔴 Agotado"}
            </div>
          </div>
        </div>

        {images.length > 1 && (
          <div className="thumbnails-grid">
            {images.map((image, index) => (
              <Thumbnail
                key={index}
                image={image}
                index={index}
                isActive={selectedImage === index}
                onClick={onImageSelect}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
);

// Subcomponente para la información
const InfoSection = React.memo(
  ({ product, isAvailable, formattedPrice, onWhatsAppClick }) => (
    <section className="info-section-premium">
      <div className="info-content">
        {/* Header Compacto */}
        <div className="product-header-compact">
          <div className="product-meta-main">
            <span className="category-tag">{product.category?.name}</span>
            <h1 className="product-title">{product.name}</h1>
          </div>
          <div className="price-section-compact">
            <div className="current-price">{formattedPrice}</div>
          </div>
        </div>

        {/* Especificaciones en Fila */}
        <SpecsRow product={product} isAvailable={isAvailable} />

        {/* Descripción */}
        <DescriptionSection description={product.description} />

        {/* Beneficios */}
        <BenefitsSection />

        {/* Botón de acción */}
        <ActionSection
          isAvailable={isAvailable}
          onWhatsAppClick={onWhatsAppClick}
        />

        {/* Nota de seguridad */}
        <SecurityNotice />
      </div>
    </section>
  )
);

// Componente para especificaciones
const SpecsRow = React.memo(({ product, isAvailable }) => (
  <div className="specs-row">
    <div className="spec-item-row">
      <span className="spec-label">Estado</span>
      <span
        className={`spec-value ${isAvailable ? "in-stock" : "out-of-stock"}`}
      >
        {isAvailable ? "Disponible" : "Agotado"}
      </span>
    </div>
    <div className="spec-item-row">
      <span className="spec-label">Stock</span>
      <span className="spec-value">{product.stock_quantity}u</span>
    </div>
    <div className="spec-item-row">
      <span className="spec-label">Categoría</span>
      <span className="spec-value">{product.category?.name}</span>
    </div>
    <div className="spec-item-row">
      <span className="spec-label">Entrega</span>
      <span className="spec-value">24-48h</span>
    </div>
  </div>
));

// Componente para descripción
const DescriptionSection = React.memo(({ description }) => (
  <div className="description-section">
    <div className="description-decoration"></div>
    <h3 className="section-title">Descripción</h3>
    <div className="description-content">
      <p>
        {description ||
          "Descubre la excelencia en cada detalle. Este producto ha sido cuidadosamente seleccionado para ofrecerte la mejor calidad y experiencia."}
      </p>
    </div>
  </div>
));

// Componente para beneficios
const BenefitsSection = React.memo(() => (
  <div className="benefits-row">
    <div className="benefit-item-compact">
      <div className="benefit-decoration"></div>
      <HiOutlineClock className="benefit-icon" />
      <div className="benefit-content">
        <span className="benefit-title">Disponible</span>
        <span className="benefit-desc">Lun-Vie 8:00-20:00</span>
      </div>
    </div>

    <div className="benefit-item-compact">
      <div className="benefit-decoration"></div>
      <HiOutlineShoppingBag className="benefit-icon" />
      <div className="benefit-content">
        <span className="benefit-title">Retiro</span>
        <span className="benefit-desc">En tienda</span>
      </div>
    </div>
  </div>
));

// Componente para acciones
const ActionSection = React.memo(({ isAvailable, onWhatsAppClick }) => (
  <div className="action-section">
    <button
      className={`whatsapp-button-premium ${!isAvailable ? "disabled" : ""}`}
      onClick={onWhatsAppClick}
      disabled={!isAvailable}
      aria-label={
        isAvailable
          ? "Consultar disponibilidad por WhatsApp"
          : "Producto agotado"
      }
    >
      <div className="button-content">
        <FiPhone className="whatsapp-icon-premium" />
        <div className="button-text">
          <span className="button-main-text">
            {isAvailable ? "Consultar Disponibilidad" : "Producto Agotado"}
          </span>
          <span className="button-sub-text">Vía WhatsApp</span>
        </div>
      </div>
      <div className="button-glow"></div>
    </button>
  </div>
));

// Componente para nota de seguridad
const SecurityNotice = React.memo(() => (
  <div className="security-notice">
    <div className="security-decoration"></div>
    <div className="security-content">
      <HiOutlineShieldCheck className="security-icon" />
      <span>Compra 100% segura · Tus datos están protegidos</span>
    </div>
  </div>
));

export default React.memo(ProductDetail);
