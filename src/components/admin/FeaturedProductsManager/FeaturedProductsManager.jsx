// components/admin/FeaturedProductsManager/FeaturedProductsManager.js
import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleProductPopular,
  toggleProductOnSale,
  saveFeaturedProducts,
} from "../../../actions/featuredProductsActions";
import SearchFilter from "../SearchFilter/SearchFilter";
import "./FeaturedProductsManager.css";

const FeaturedProductsManager = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const featuredProducts = useSelector(
    (state) => state.products.featuredProducts
  );

  const [activeTab, setActiveTab] = useState("popular");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((p) => p.category?.name).filter(Boolean)),
    ];
    return ["Todos", ...uniqueCategories];
  }, [products]);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Todos" ||
        product.category?.name === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const isProductPopular = (productId) =>
    featuredProducts.popular.includes(productId);

  const isProductOnSale = (productId) =>
    featuredProducts.onSale.includes(productId);

  const handleTogglePopular = (productId) => {
    dispatch(toggleProductPopular(productId));
  };

  const handleToggleOnSale = (productId) => {
    dispatch(toggleProductOnSale(productId));
  };

  const handleSave = () => {
    dispatch(
      saveFeaturedProducts({
        popular: featuredProducts.popular,
        onSale: featuredProducts.onSale,
      })
    );
  };

  return (
    <div className="featured-products-manager">
      <div className="featured-header">
        <h3>Productos Destacados</h3>
        <button className="save-featured-btn" onClick={handleSave}>
          Guardar Cambios
        </button>
      </div>

      <div className="featured-tabs">
        <button
          className={`tab-button ${activeTab === "popular" ? "active" : ""}`}
          onClick={() => setActiveTab("popular")}
        >
          🏆 Populares ({featuredProducts.popular.length})
        </button>
        <button
          className={`tab-button ${activeTab === "sale" ? "active" : ""}`}
          onClick={() => setActiveTab("sale")}
        >
          🎯 En Oferta ({featuredProducts.onSale.length})
        </button>
      </div>

      {/* Filtro de búsqueda */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Buscar productos..."
        showCategoryFilter={true}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="featured-content">
        {activeTab === "popular" && (
          <div className="products-grid">
            <div className="products-grid__header">
              <h4>
                Selecciona los productos populares (
                {featuredProducts.popular.length} seleccionados)
              </h4>
              <span className="products-count">
                {filteredProducts.length} productos mostrados
              </span>
            </div>
            <div className="products-list">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`product-item ${
                    isProductPopular(product.id) ? "selected" : ""
                  }`}
                  onClick={() => handleTogglePopular(product.id)}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <span className="product-name">{product.name}</span>
                    <span className="product-category">
                      {product.category?.name}
                    </span>
                    <span className="product-price">${product.price}</span>
                  </div>
                  <div className="selection-indicator">
                    {isProductPopular(product.id) ? "✓" : "+"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "sale" && (
          <div className="products-grid">
            <div className="products-grid__header">
              <h4>
                Selecciona los productos en oferta (
                {featuredProducts.onSale.length} seleccionados)
              </h4>
              <span className="products-count">
                {filteredProducts.length} productos mostrados
              </span>
            </div>
            <div className="products-list">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`product-item ${
                    isProductOnSale(product.id) ? "selected" : ""
                  }`}
                  onClick={() => handleToggleOnSale(product.id)}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <span className="product-name">{product.name}</span>
                    <span className="product-category">
                      {product.category?.name}
                    </span>
                    <span className="product-price">${product.price}</span>
                  </div>
                  <div className="selection-indicator">
                    {isProductOnSale(product.id) ? "✓" : "+"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {filteredProducts.length === 0 && products.length > 0 && (
        <div className="featured-products__empty">
          <p>No se encontraron productos con los filtros aplicados</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedProductsManager;
