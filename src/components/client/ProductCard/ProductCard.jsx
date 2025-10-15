import React, { useCallback, memo } from "react";
import { FiPhone } from "react-icons/fi";
import "./ProductCard.css";
import "./ProductCard.desktop.css";

const ProductCard = memo(({ product, onWhatsAppClick, onProductClick }) => {
  const isAvailable =
    product.status === "available" && product.stock_quantity > 0;

  const handleCardClick = useCallback(() => {
    onProductClick?.(product);
  }, [onProductClick, product]);

  const handleWhatsAppClick = useCallback(
    (e) => {
      e.stopPropagation();
      onWhatsAppClick?.(product.name);
    },
    [onWhatsAppClick, product.name]
  );

  const handleImageError = useCallback((e) => {
    e.target.src =
      "https://via.placeholder.com/200x200?text=Imagen+No+Disponible";
  }, []);

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-card__image-container">
        <img
          src={product.image_url}
          alt={product.name}
          className="product-card__image"
          onError={handleImageError}
          loading="lazy"
        />
        <div
          className={`product-card__status ${
            isAvailable ? "available" : "out-of-stock"
          }`}
        >
          {isAvailable ? "🟢 Disponible" : "🔴 Agotado"}
        </div>
      </div>

      <div className="product-card__content">
        <h3 className="product-card__name">{product.name}</h3>

        <div className="product-card__info-row">
          <div className="product-card__price">
            ${parseFloat(product.price).toFixed(2)}
          </div>
          <div className="product-card__category">{product.category?.name}</div>
        </div>

        <p className="product-card__description">
          {product.description?.substring(0, 80) || "Producto de calidad..."}
          {product.description && product.description.length > 80 ? "..." : ""}
        </p>

        <button
          className="product-card__whatsapp-btn"
          onClick={handleWhatsAppClick}
          disabled={!isAvailable}
        >
          <FiPhone className="whatsapp-icon" />
          {isAvailable ? "Consultar por WhatsApp" : "Producto Agotado"}
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
