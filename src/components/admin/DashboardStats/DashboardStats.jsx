import { useMemo } from "react";
import { useSelector } from "react-redux";
import "./DashboardStats.css";

const DashboardStats = ({ products }) => {
  const featuredProducts = useSelector(
    (state) => state.products.featuredProducts
  );

  // Todas las métricas en un solo useMemo para evitar cálculos repetidos
  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const outOfStockCount = products.filter(
      (p) => p.status === "outOfStock"
    ).length;
    const inStockCount = totalProducts - outOfStockCount;

    const featuredProductsCount = featuredProducts?.popular?.length || 0;
    const offerProductsCount = featuredProducts?.onSale?.length || 0;

    // Agrupar cálculos de categorías
    const productsByCategory = products.reduce((acc, product) => {
      const category = product.category?.name || "Sin categoría";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const topCategory = Object.entries(productsByCategory).sort(
      ([, a], [, b]) => b - a
    )[0] || ["Sin categorías", 0];
    const totalCategories = Object.keys(productsByCategory).length;

    // Agrupar cálculos de inventario
    const totalInventoryValue = products.reduce((total, product) => {
      const price = parseFloat(product.price) || 0;
      const stock = parseInt(product.stock) || 0;
      return total + price * stock;
    }, 0);

    const productsWithImages = products.filter(
      (p) => p.image && p.image !== ""
    ).length;
    const productsWithoutImages = totalProducts - productsWithImages;

    const recentProducts = products.filter((product) => {
      const productDate = new Date(product.createdAt || product.updatedAt);
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      return productDate >= monthAgo;
    }).length;

    // Calcular porcentajes una sola vez
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

    return {
      totalProducts,
      outOfStockCount,
      inStockCount,
      featuredProductsCount,
      offerProductsCount,
      topCategory,
      totalCategories,
      totalInventoryValue,
      productsWithImages,
      productsWithoutImages,
      recentProducts,
      stockPercentage,
      imagesPercentage,
      outOfStockPercentage,
      featuredPercentage,
      hasMarketing: featuredProductsCount > 0 || offerProductsCount > 0,
    };
  }, [products, featuredProducts]);

  // Componente de tarjeta reutilizable
  const StatCard = ({
    type,
    icon,
    label,
    value,
    percentage,
    breakdown,
    trend,
    alert,
    tip,
  }) => (
    <div className={`dashboard-stat dashboard-stat--${type}`}>
      <div className="stat-content">
        <div className="stat-header">
          <div className="stat-header-main">
            <div className="stat-icon">{icon}</div>
            <div className="stat-label">{label}</div>
          </div>
        </div>
        <div className={`stat-value stat-value--${type}`}>{value}</div>

        {percentage !== undefined && (
          <div className="stat-progress">
            <div className="progress-bar">
              <div
                className={`progress-fill progress-fill--${type}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="progress-label">{percentage}% del inventario</div>
          </div>
        )}

        {breakdown && (
          <div className="stat-breakdown">
            {breakdown.map((item, index) => (
              <div key={index} className="breakdown-item">
                <div className="breakdown-info">
                  <span
                    className={`breakdown-dot breakdown-dot--${item.type}`}
                  />
                  <span className="breakdown-text">{item.text}</span>
                </div>
                <span className="breakdown-value">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {trend && (
          <div className={`stat-trend stat-trend--${trend.type}`}>
            <span className="trend-icon">{trend.icon}</span>
            <span className="trend-text">{trend.text}</span>
          </div>
        )}

        {alert && <div className="stat-alert">{alert}</div>}
        {tip && <div className="stat-tip">{tip}</div>}
      </div>
    </div>
  );

  return (
    <div className="dashboard-stats">
      <StatCard
        type="primary"
        icon="📊"
        label="Inventario Total"
        value={metrics.totalProducts}
        breakdown={[
          {
            type: "success",
            text: `${metrics.inStockCount} disponibles`,
            value: metrics.inStockCount,
          },
          {
            type: "warning",
            text: `${metrics.outOfStockCount} agotados`,
            value: metrics.outOfStockCount,
          },
        ]}
        trend={
          metrics.recentProducts > 0
            ? {
                type: "positive",
                icon: "+",
                text: `${metrics.recentProducts} nuevos este mes`,
              }
            : null
        }
      />

      <StatCard
        type="success"
        icon="📦"
        label="Stock Disponible"
        value={metrics.inStockCount}
        percentage={metrics.stockPercentage}
      />

      <StatCard
        type="warning"
        icon="⚠️"
        label="Requiere Atención"
        value={metrics.outOfStockCount}
        percentage={metrics.outOfStockPercentage}
        alert={
          metrics.outOfStockCount > 0 ? "Necesitan reposición inmediata" : null
        }
      />

      <StatCard
        type="featured"
        icon="⭐"
        label="Destacados"
        value={metrics.featuredProductsCount}
        percentage={metrics.featuredPercentage}
        trend={
          metrics.featuredProductsCount === 0
            ? null
            : {
                type: "positive",
                icon: "👑",
                text: "Productos populares",
              }
        }
        tip={
          metrics.featuredProductsCount === 0
            ? "Agrega productos destacados"
            : null
        }
      />

      <StatCard
        type="danger"
        icon="🎯"
        label="Ofertas Activas"
        value={metrics.offerProductsCount}
        trend={
          metrics.offerProductsCount > 0
            ? {
                type: "positive",
                icon: "🔥",
                text: "Atrayendo clientes",
              }
            : null
        }
        tip={
          metrics.offerProductsCount === 0
            ? "Crea ofertas para aumentar ventas"
            : null
        }
      />

      <StatCard
        type="info"
        icon="📁"
        label="Categorías"
        value={metrics.totalCategories}
        breakdown={[
          {
            text: `Principal: ${metrics.topCategory[1]} productos`,
            value: null,
          },
        ]}
      />

      {metrics.totalInventoryValue > 0 && (
        <StatCard
          type="inventory"
          icon="💰"
          label="Valor Inventario"
          value={`$${metrics.totalInventoryValue.toLocaleString()}`}
          breakdown={[{ text: "Basado en precios actuales", value: null }]}
        />
      )}

      <StatCard
        type="media"
        icon="🖼️"
        label="Imágenes"
        value={metrics.productsWithImages}
        percentage={metrics.imagesPercentage}
        tip={
          metrics.productsWithoutImages > 0
            ? `${metrics.productsWithoutImages} productos sin imágenes`
            : null
        }
      />

      {metrics.hasMarketing && (
        <StatCard
          type="summary"
          icon="🚀"
          label="Marketing Activo"
          breakdown={[
            {
              type: "featured",
              text: "Productos destacados",
              value: metrics.featuredProductsCount,
            },
            {
              type: "danger",
              text: "Ofertas activas",
              value: metrics.offerProductsCount,
            },
          ]}
          trend={{
            type: "positive",
            icon: "📈",
            text: "Estrategia de marketing activa",
          }}
        />
      )}
    </div>
  );
};

export default DashboardStats;
