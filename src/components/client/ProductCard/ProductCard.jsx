// components/client/ProductCard/ProductCard.jsx
import { FiPhone } from "react-icons/fi";
import "./ProductCard.css";
import "./ProductCard.desktop.css";

const ProductCard = ({ product, onWhatsAppClick, onProductClick }) => {
  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    if (onWhatsAppClick) {
      onWhatsAppClick(product.name);
    }
  };

  // ✅ LÓGICA CORREGIDA: Usar ambos campos para determinar disponibilidad
  const isAvailable =
    product.status === "available" && product.stock_quantity > 0;

  // ✅ DEBUG: Mostrar información del producto
  console.log("🔄 ProductCard -", {
    id: product.id,
    name: product.name,
    status: product.status,
    stock: product.stock_quantity,
    isAvailable: isAvailable,
  });

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-card__image-container">
        <img
          src={product.image_url}
          alt={product.name}
          className="product-card__image"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/200x200?text=Imagen+No+Disponible";
          }}
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

        {/* ✅ DEBUG: Mostrar información adicional */}
        <div style={{ fontSize: "10px", color: "#666", marginBottom: "8px" }}>
          Status: {product.status} | Stock: {product.stock_quantity}
        </div>

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
};

export default ProductCard;
