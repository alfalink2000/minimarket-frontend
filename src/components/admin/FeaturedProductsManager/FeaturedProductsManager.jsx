import { useState, useMemo, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleProductPopular,
  toggleProductOnSale,
  saveFeaturedProducts,
  getFeaturedProducts,
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(getFeaturedProducts());
  }, [dispatch]);

  // Memoizar categorías
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((p) => p.category?.name).filter(Boolean)),
    ];
    return ["Todos", ...uniqueCategories];
  }, [products]);

  // Memoizar productos filtrados
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch = product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === "Todos" ||
          product.category?.name === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [products, searchTerm, selectedCategory]
  );

  // Handlers optimizados
  const isProductPopular = useCallback(
    (productId) => featuredProducts.popular.includes(productId),
    [featuredProducts.popular]
  );

  const isProductOnSale = useCallback(
    (productId) => featuredProducts.onSale.includes(productId),
    [featuredProducts.onSale]
  );

  const handleTogglePopular = useCallback(
    (productId) => {
      dispatch(toggleProductPopular(productId));
    },
    [dispatch]
  );

  const handleToggleOnSale = useCallback(
    (productId) => {
      dispatch(toggleProductOnSale(productId));
    },
    [dispatch]
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await dispatch(
        saveFeaturedProducts({
          popular: featuredProducts.popular,
          onSale: featuredProducts.onSale,
        })
      );
    } finally {
      setSaving(false);
    }
  }, [dispatch, featuredProducts]);

  // Componente de producto reutilizable
  const ProductItem = useCallback(
    ({ product, isSelected, onToggle }) => (
      <div
        className={`product-item ${isSelected ? "selected" : ""}`}
        onClick={() => onToggle(product.id)}
      >
        <img
          src={product.image_url || "/default-product.png"}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = "/default-product.png";
          }}
        />
        <div className="product-info">
          <span className="product-name">{product.name}</span>
          <span className="product-category">
            {product.category?.name || "Sin categoría"}
          </span>
          <span className="product-price">${product.price}</span>
        </div>
        <div className="selection-indicator">{isSelected ? "✓" : "+"}</div>
      </div>
    ),
    []
  );

  return (
    <div className="featured-products-manager">
      <div className="featured-header">
        <h3>Productos Destacados</h3>
        <button
          className="save-featured-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">{featuredProducts.popular.length}</span>
          <span className="stat-label">Populares</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{featuredProducts.onSale.length}</span>
          <span className="stat-label">En Oferta</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{products.length}</span>
          <span className="stat-label">Total Productos</span>
        </div>
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
                <ProductItem
                  key={product.id}
                  product={product}
                  isSelected={isProductPopular(product.id)}
                  onToggle={handleTogglePopular}
                />
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
                <ProductItem
                  key={product.id}
                  product={product}
                  isSelected={isProductOnSale(product.id)}
                  onToggle={handleToggleOnSale}
                />
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
