// components/client/ProductDetail/ProductDetail.jsx
import { useState, useEffect } from "react";
import {
  HiOutlineArrowLeft,
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineStar,
  HiOutlineHeart,
} from "react-icons/hi";
import { FiPhone, FiShare2 } from "react-icons/fi";
import "./ProductDetail.css";

const ProductDetail = ({ product, onBack, onWhatsAppClick }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) return null;

  const isAvailable =
    product.status === "available" && product.stock_quantity > 0;

  const handleWhatsAppClick = () => {
    onWhatsAppClick(product.name);
  };

  const handleShare = async () => {
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
      alert("Enlace copiado al portapapeles");
    }
  };

  const images = [product.image_url].filter(Boolean);

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
        <section className="gallery-section">
          <div className="gallery-container">
            <div className="main-image-frame">
              <div className="image-wrapper">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className={`main-image-premium ${
                    imageLoaded ? "loaded" : ""
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/600x600/ffffff/374151?text=Imagen+No+Disponible";
                  }}
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
                  <button
                    key={index}
                    className={`thumbnail-premium ${
                      selectedImage === index ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`Vista ${index + 1}`} />
                    <div className="thumbnail-overlay"></div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="info-section-premium">
          <div className="info-content">
            {/* Header Compacto */}
            <div className="product-header-compact">
              <div className="product-meta-main">
                <span className="category-tag">{product.category?.name}</span>
                <h1 className="product-title">{product.name}</h1>
              </div>
              <div className="price-section-compact">
                <div className="current-price">
                  ${parseFloat(product.price).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Especificaciones en Fila */}
            <div className="specs-row">
              <div className="spec-item-row">
                <span className="spec-label">Estado</span>
                <span
                  className={`spec-value ${
                    isAvailable ? "in-stock" : "out-of-stock"
                  }`}
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

            {/* Descripción con elemento decorativo */}
            <div className="description-section">
              <div className="description-decoration"></div>
              <h3 className="section-title">Descripción</h3>
              <div className="description-content">
                <p>
                  {product.description ||
                    "Descubre la excelencia en cada detalle. Este producto ha sido cuidadosamente seleccionado para ofrecerte la mejor calidad y experiencia."}
                </p>
              </div>
            </div>

            {/* Beneficios en Fila */}
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

            {/* Botón de acción */}
            <div className="action-section">
              <button
                className={`whatsapp-button-premium ${
                  !isAvailable ? "disabled" : ""
                }`}
                onClick={handleWhatsAppClick}
                disabled={!isAvailable}
              >
                <div className="button-content">
                  <FiPhone className="whatsapp-icon-premium" />
                  <div className="button-text">
                    <span className="button-main-text">
                      {isAvailable
                        ? "Consultar Disponibilidad"
                        : "Producto Agotado"}
                    </span>
                    <span className="button-sub-text">Vía WhatsApp</span>
                  </div>
                </div>
                <div className="button-glow"></div>
              </button>
            </div>

            {/* Nota de seguridad con elemento decorativo */}
            <div className="security-notice">
              <div className="security-decoration"></div>
              <div className="security-content">
                <HiOutlineShieldCheck className="security-icon" />
                <span>Compra 100% segura · Tus datos están protegidos</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetail;
