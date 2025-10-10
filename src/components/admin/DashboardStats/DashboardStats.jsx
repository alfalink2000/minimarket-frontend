import "./DashboardStats.css";
import { useSelector } from "react-redux";

const DashboardStats = ({ products }) => {
  // ✅ OBTENER PRODUCTOS DESTACADOS DEL REDUCER
  const featuredProducts = useSelector(
    (state) => state.products.featuredProducts
  );

  // MÉTRICAS BÁSICAS
  const totalProducts = products.length;
  const outOfStockCount = products.filter(
    (p) => p.status === "outOfStock"
  ).length;
  const inStockCount = totalProducts - outOfStockCount;

  // ✅ MÉTRICAS CORREGIDAS - USAR DATOS DEL REDUCER
  const featuredProductsCount = featuredProducts?.popular?.length || 0;
  const offerProductsCount = featuredProducts?.onSale?.length || 0;

  // MÉTRICAS DE CATEGORÍAS
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category?.name || "Sin categoría";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const topCategory = Object.entries(productsByCategory).sort(
    ([, a], [, b]) => b - a
  )[0] || ["Sin categorías", 0];

  const totalCategories = Object.keys(productsByCategory).length;

  // MÉTRICAS DE INVENTARIO
  const totalInventoryValue = products.reduce((total, product) => {
    const price = parseFloat(product.price) || 0;
    const stock = parseInt(product.stock) || 0;
    return total + price * stock;
  }, 0);

  // MÉTRICAS DE ESTADO
  const productsWithImages = products.filter(
    (p) => p.image && p.image !== ""
  ).length;
  const productsWithoutImages = totalProducts - productsWithImages;

  // PRODUCTOS RECIENTES (últimos 30 días)
  const recentProducts = products.filter((product) => {
    const productDate = new Date(product.createdAt || product.updatedAt);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    return productDate >= monthAgo;
  }).length;

  // PORCENTAJES
  const stockPercentage = totalProducts
    ? Math.round((inStockCount / totalProducts) * 100)
    : 0;
  const imagesPercentage = totalProducts
    ? Math.round((productsWithImages / totalProducts) * 100)
    : 0;
  const outOfStockPercentage = totalProducts
    ? Math.round((outOfStockCount / totalProducts) * 100)
    : 0;
  const featuredPercentage = totalProducts
    ? Math.round((featuredProductsCount / totalProducts) * 100)
    : 0;

  console.log("📊 Dashboard Stats:", {
    totalProducts,
    featuredProductsCount,
    offerProductsCount,
    featuredProducts: featuredProducts,
  });

  return (
    <div className="dashboard-stats">
      {/* TARJETA PRINCIPAL - RESUMEN GENERAL */}
      <div className="dashboard-stat dashboard-stat--primary">
        <div className="stat-content">
          <div className="stat-header">
            <div className="stat-header-main">
              <div className="stat-icon">📊</div>
              <div className="stat-label">Inventario Total</div>
            </div>
          </div>
          <div className="stat-value stat-value--primary">{totalProducts}</div>
          <div className="stat-breakdown">
            <div className="breakdown-item">
              <div className="breakdown-info">
                <span className="breakdown-dot breakdown-dot--success"></span>
                <span className="breakdown-text">
                  {inStockCount} disponibles
                </span>
              </div>
              <span className="breakdown-value">{inStockCount}</span>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-info">
                <span className="breakdown-dot breakdown-dot--warning"></span>
                <span className="breakdown-text">
                  {outOfStockCount} agotados
                </span>
              </div>
              <span className="breakdown-value">{outOfStockCount}</span>
            </div>
          </div>
          {recentProducts > 0 && (
            <div className="stat-trend stat-trend--positive">
              <span className="trend-icon">+</span>
              <span className="trend-text">
                {recentProducts} nuevos este mes
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ESTADO DE STOCK */}
      <div className="dashboard-stat dashboard-stat--success">
        <div className="stat-content">
          <div className="stat-header">
            <div className="stat-header-main">
              <div className="stat-icon">📦</div>
              <div className="stat-label">Stock Disponible</div>
            </div>
          </div>
          <div className="stat-value stat-value--success">{inStockCount}</div>
          <div className="stat-progress">
            <div className="progress-bar">
              <div
                className="progress-fill progress-fill--success"
                style={{ width: `${stockPercentage}%` }}
              ></div>
            </div>
            <div className="progress-label">
              {stockPercentage}% del inventario
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTOS AGOTADOS */}
      <div className="dashboard-stat dashboard-stat--warning">
        <div className="stat-content">
          <div className="stat-header">
            <div className="stat-header-main">
              <div className="stat-icon">⚠️</div>
              <div className="stat-label">Requiere Atención</div>
            </div>
          </div>
          <div className="stat-value stat-value--warning">
            {outOfStockCount}
          </div>
          <div className="stat-progress">
            <div className="progress-bar">
              <div
                className="progress-fill progress-fill--warning"
                style={{ width: `${outOfStockPercentage}%` }}
              ></div>
            </div>
            <div className="progress-label">
              {outOfStockPercentage}% del inventario
            </div>
          </div>
          {outOfStockCount > 0 && (
            <div className="stat-alert">Necesitan reposición inmediata</div>
          )}
        </div>
      </div>

      {/* PRODUCTOS DESTACADOS */}
      <div className="dashboard-stat dashboard-stat--featured">
        <div className="stat-content">
          <div className="stat-header">
            <div className="stat-header-main">
              <div className="stat-icon">⭐</div>
              <div className="stat-label">Destacados</div>
            </div>
          </div>
          <div className="stat-value stat-value--featured">
            {featuredProductsCount}
          </div>
          <div className="stat-progress">
            <div className="progress-bar">
              <div
                className="progress-fill progress-fill--featured"
                style={{ width: `${featuredPercentage}%` }}
              ></div>
            </div>
            <div className="progress-label">
              {featuredPercentage}% del inventario
            </div>
          </div>
          {featuredProductsCount === 0 ? (
            <div className="stat-tip">Agrega productos destacados</div>
          ) : (
            <div className="stat-trend stat-trend--positive">
              <span className="trend-icon">👑</span>
              <span className="trend-text">Productos populares</span>
            </div>
          )}
        </div>
      </div>

      {/* OFERTAS ACTIVAS */}
      <div className="dashboard-stat dashboard-stat--danger">
        <div className="stat-content">
          <div className="stat-header">
            <div className="stat-header-main">
              <div className="stat-icon">🎯</div>
              <div className="stat-label">Ofertas Activas</div>
            </div>
          </div>
          <div className="stat-value stat-value--danger">
            {offerProductsCount}
          </div>
          <div className="stat-subtext">En promoción especial</div>
          {offerProductsCount > 0 ? (
            <div className="stat-trend stat-trend--positive">
              <span className="trend-icon">🔥</span>
              <span className="trend-text">Atrayendo clientes</span>
            </div>
          ) : (
            <div className="stat-tip">Crea ofertas para aumentar ventas</div>
          )}
        </div>
      </div>

      {/* CATEGORÍAS */}
      <div className="dashboard-stat dashboard-stat--info">
        <div className="stat-content">
          <div className="stat-header">
            <div className="stat-header-main">
              <div className="stat-icon">📁</div>
              <div className="stat-label">Categorías</div>
            </div>
          </div>
          <div className="stat-value stat-value--info">{totalCategories}</div>
          <div className="stat-subtext">{topCategory[0]}</div>
          <div className="stat-breakdown">
            <div className="breakdown-item">
              <div className="breakdown-info">
                <span className="breakdown-text">
                  Principal: {topCategory[1]} productos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VALOR DEL INVENTARIO */}
      {totalInventoryValue > 0 && (
        <div className="dashboard-stat dashboard-stat--inventory">
          <div className="stat-content">
            <div className="stat-header">
              <div className="stat-header-main">
                <div className="stat-icon">💰</div>
                <div className="stat-label">Valor Inventario</div>
              </div>
            </div>
            <div className="stat-value stat-value--inventory">
              ${totalInventoryValue.toLocaleString()}
            </div>
            <div className="stat-subtext">Valor total estimado</div>
            <div className="stat-breakdown">
              <div className="breakdown-item">
                <div className="breakdown-info">
                  <span className="breakdown-text">
                    Basado en precios actuales
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ESTADO DE IMÁGENES */}
      <div className="dashboard-stat dashboard-stat--media">
        <div className="stat-content">
          <div className="stat-header">
            <div className="stat-header-main">
              <div className="stat-icon">🖼️</div>
              <div className="stat-label">Imágenes</div>
            </div>
          </div>
          <div className="stat-value stat-value--media">
            {productsWithImages}
          </div>
          <div className="stat-progress">
            <div className="progress-bar">
              <div
                className="progress-fill progress-fill--media"
                style={{ width: `${imagesPercentage}%` }}
              ></div>
            </div>
            <div className="progress-label">
              {imagesPercentage}% con imágenes
            </div>
          </div>
          {productsWithoutImages > 0 && (
            <div className="stat-tip">
              {productsWithoutImages} productos sin imágenes
            </div>
          )}
        </div>
      </div>

      {/* TARJETA EXTRA: RESUMEN DESTACADOS */}
      {(featuredProductsCount > 0 || offerProductsCount > 0) && (
        <div className="dashboard-stat dashboard-stat--summary">
          <div className="stat-content">
            <div className="stat-header">
              <div className="stat-header-main">
                <div className="stat-icon">🚀</div>
                <div className="stat-label">Marketing Activo</div>
              </div>
            </div>
            <div className="stat-breakdown">
              <div className="breakdown-item">
                <div className="breakdown-info">
                  <span className="breakdown-dot breakdown-dot--featured"></span>
                  <span className="breakdown-text">Productos destacados</span>
                </div>
                <span className="breakdown-value">{featuredProductsCount}</span>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-info">
                  <span className="breakdown-dot breakdown-dot--danger"></span>
                  <span className="breakdown-text">Ofertas activas</span>
                </div>
                <span className="breakdown-value">{offerProductsCount}</span>
              </div>
            </div>
            <div className="stat-trend stat-trend--positive">
              <span className="trend-icon">📈</span>
              <span className="trend-text">Estrategia de marketing activa</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardStats;
