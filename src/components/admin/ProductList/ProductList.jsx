// components/admin/ProductList/ProductList.jsx
import { useState, useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import SearchFilter from "../SearchFilter/SearchFilter";
import "./ProductList.css";

const ProductList = ({ products, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Obtener categorías únicas de los productos
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((p) => p.category?.name).filter(Boolean)),
    ];
    return ["Todos", ...uniqueCategories];
  }, [products]);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "Todos" ||
        product.category?.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="product-list">
      {/* Filtro de búsqueda */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Buscar productos por nombre o descripción..."
        showCategoryFilter={true}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Contador de resultados */}
      <div className="product-list__info">
        <span className="product-list__count">
          {filteredProducts.length} de {products.length} productos
        </span>
      </div>

      {/* Lista de productos */}
      <div className="product-list__grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-list__item">
            <div className="product-list__content">
              <img
                src={
                  product.image_url || product.image || "/placeholder-image.jpg"
                }
                alt={product.name}
                className="product-list__image"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
              <div className="product-list__details">
                <h3 className="product-list__name">{product.name}</h3>
                <p className="product-list__category">
                  {product.category?.name}
                </p>
                <p className="product-list__price">${product.price}</p>
                <p className="product-list__stock">
                  Stock: {product.stock_quantity || 0}
                </p>
                <span
                  className={`product-list__status ${
                    product.status === "available"
                      ? "product-list__status--available"
                      : "product-list__status--outOfStock"
                  }`}
                >
                  {product.status === "available" ? "Disponible" : "Agotado"}
                </span>
              </div>
              <div className="product-list__actions">
                <button
                  onClick={() => onEdit(product)}
                  className="product-list__button product-list__button--edit"
                >
                  <Edit className="product-list__icon" />
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="product-list__button product-list__button--delete"
                >
                  <Trash2 className="product-list__icon" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="product-list__empty">
          <p>No se encontraron productos con los filtros aplicados</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
