// components/client/ProductCard/ProductCard.jsx
import React, { useCallback, memo, useState } from "react";
import { FiPhone, FiPlus, FiMinus, FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateCartQuantity } from "../../../actions/cartActions";
import { selectCartItems } from "../../../selectors/cartSelectors";
import "./ProductCard.css";
import "./ProductCard.desktop.css";

const ProductCard = memo(({ product, onWhatsAppClick, onProductClick }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const [showQuantity, setShowQuantity] = useState(false);

  // ✅ OBTENER LA MONEDA DESDE LA CONFIGURACIÓN
  const currency = useSelector(
    (state) => state.appConfig.config?.currency || "MN"
  );

  const isAvailable =
    product.status === "available" && product.stock_quantity > 0;
  const cartItem = cartItems.find((item) => item.id === product.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  // ✅ FUNCIÓN PARA OBTENER EL SÍMBOLO DE MONEDA
  const getCurrencySymbol = useCallback(() => {
    switch (currency) {
      case "USD":
        return "US$";
      case "EUR":
        return "€";
      case "MN":
      default:
        return "$";
    }
  }, [currency]);

  // ✅ FUNCIÓN PARA FORMATEAR EL PRECIO
  const formatPrice = useCallback((price) => {
    return parseFloat(price).toFixed(2);
  }, []);

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

  const handleAddToCart = useCallback(
    (e) => {
      e.stopPropagation();
      if (!isAvailable) return;

      dispatch(addToCart(product));
      setShowQuantity(true);
    },
    [dispatch, product, isAvailable]
  );

  const handleQuantityChange = useCallback(
    (e, change) => {
      e.stopPropagation();
      const newQuantity = Math.max(0, currentQuantity + change);

      if (newQuantity === 0) {
        setShowQuantity(false);
      }

      dispatch(updateCartQuantity(product.id, newQuantity));
    },
    [dispatch, product.id, currentQuantity]
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

        {/* ✅ BADGE DE MONEDA - Agregado aquí */}
        <div className="product-card__currency-badge">{currency}</div>

        {/* Badge de cantidad en carrito */}
        {currentQuantity > 0 && (
          <div className="product-card__cart-badge">{currentQuantity}</div>
        )}
      </div>

      <div className="product-card__content">
        <h3 className="product-card__name">{product.name}</h3>

        <div className="product-card__info-row">
          <div className="product-card__price">
            {getCurrencySymbol()} {formatPrice(product.price)}
          </div>
          <div className="product-card__category">{product.category?.name}</div>
        </div>

        <p className="product-card__description">
          {product.description?.substring(0, 80) || "Producto de calidad..."}
          {product.description && product.description.length > 80 ? "..." : ""}
        </p>

        {/* Controles de cantidad */}
        {showQuantity || currentQuantity > 0 ? (
          <div className="product-card__quantity-controls">
            <button
              className="quantity-btn minus"
              onClick={(e) => handleQuantityChange(e, -1)}
              disabled={!isAvailable}
            >
              <FiMinus size={14} />
            </button>

            <span className="quantity-display">{currentQuantity}</span>

            <button
              className="quantity-btn plus"
              onClick={(e) => handleQuantityChange(e, 1)}
              disabled={!isAvailable}
            >
              <FiPlus size={14} />
            </button>
          </div>
        ) : (
          <div className="product-card__action-buttons">
            <button
              className="product-card__cart-btn"
              onClick={handleAddToCart}
              disabled={!isAvailable}
            >
              <FiShoppingCart className="cart-icon" />
              Agregar
            </button>

            <button
              className="product-card__whatsapp-btn"
              onClick={handleWhatsAppClick}
              disabled={!isAvailable}
            >
              <FiPhone className="whatsapp-icon" />
              Info
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";
export default ProductCard;
