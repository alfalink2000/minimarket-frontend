import React, { useCallback, memo } from "react";
import { FiPhone } from "react-icons/fi";
import { HiOutlineFire } from "react-icons/hi";
import "./ProductCardOffer.css";

const ProductCardOffer = memo(
  ({ product, onWhatsAppClick, onProductClick }) => {
    const isAvailable = product.stock_quantity > 0;

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
      <div className="product-card-offer" onClick={handleCardClick}>
        <div className="offer-hot-badge">
          <HiOutlineFire className="hot-icon" />
          <span>HOT</span>
        </div>

        <div className="product-card-offer__image-container">
          <img
            src={product.image_url}
            alt={product.name}
            className="product-card-offer__image"
            onError={handleImageError}
            loading="lazy"
          />
        </div>

        <div className="product-card-offer__content">
          <h3 className="product-card-offer__name">{product.name}</h3>

          <div className="product-card-offer__info-row">
            <div className="product-card-offer__price">
              ${parseFloat(product.price).toFixed(2)}
            </div>
            <div className="product-card-offer__category">
              {product.category?.name}
            </div>
          </div>

          <p className="product-card-offer__description">
            {product.description?.substring(0, 80) ||
              "¡Oferta especial! No te pierdas esta oportunidad..."}
            {product.description && product.description.length > 80
              ? "..."
              : ""}
          </p>

          <button
            className="product-card-offer__whatsapp-btn"
            onClick={handleWhatsAppClick}
            disabled={!isAvailable}
          >
            <FiPhone className="whatsapp-icon" />
            Consultar Oferta
          </button>
        </div>
      </div>
    );
  }
);

ProductCardOffer.displayName = "ProductCardOffer";

export default ProductCardOffer;
