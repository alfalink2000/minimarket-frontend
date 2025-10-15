// components/client/ProductGrid/ProductGrid.jsx
import React from "react";
import ProductCard from "../ProductCard/ProductCard";
import { Search } from "lucide-react";
import ProductCardOffer from "../ProductCardOffer/ProductCardOffer";
import "./ProductGrid.css";
import "./ProductGrid.desktop.css";

const ProductGrid = ({
  products,
  onWhatsAppClick,
  onProductClick,
  isOfferSection = false,
}) => {
  if (products.length === 0) {
    return (
      <div className="product-grid__empty">
        <div className="product-grid__empty-icon">
          <Search className="w-full h-full" />
        </div>
        <h3 className="product-grid__empty-title">
          No se encontraron productos
        </h3>
        <p className="product-grid__empty-description">
          Intenta ajustar los filtros de búsqueda o categoría
        </p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      <div className="product-grid__container">
        {products.map((product) =>
          isOfferSection ? (
            // Usar ProductCardOffer para ofertas
            <ProductCardOffer
              key={product.id}
              product={product}
              onWhatsAppClick={onWhatsAppClick}
              onProductClick={onProductClick}
            />
          ) : (
            // Usar ProductCard normal para otras secciones
            <ProductCard
              key={product.id}
              product={product}
              onWhatsAppClick={onWhatsAppClick}
              onProductClick={onProductClick}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
