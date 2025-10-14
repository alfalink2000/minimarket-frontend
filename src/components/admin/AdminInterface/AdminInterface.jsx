import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  HiOutlineChartBar,
  HiOutlineTag,
  HiOutlineStar,
  HiOutlineCube,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineCog,
  HiOutlineX,
  HiOutlineShieldCheck,
  HiOutlineUserCircle,
} from "react-icons/hi";
import Header from "../../common/Header/Header";
import DashboardStats from "../DashboardStats/DashboardStats";
import ProductList from "../ProductList/ProductList";
import ProductForm from "../ProductForm/ProductForm";
import "./AdminInterface.css";
import CategoryManager from "../CategoryManager/CategoryManager";
import FeaturedProductsManager from "../FeaturedProductsManager/FeaturedProductsManager";
import { getFeaturedProducts } from "../../../actions/featuredProductsActions";

import { HiOutlineUsers } from "react-icons/hi";
import AdminUsersManager from "../AdminUsersManager/AdminUsersManager";
import { getAdminUsers } from "../../../actions/adminUsersActions";
import AppConfigManager from "../AppConfigManager/AppConfigManager";

import {
  insertProduct,
  updateProduct,
  deleteProduct,
} from "../../../actions/productsActions";
import {
  insertCategory,
  updateCategory,
  deleteCategory,
} from "../../../actions/categoriesActions";
import { startLogout } from "../../../actions/authActions";

const AdminInterface = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeaturedProducts());
    dispatch(getAdminUsers());
  }, [dispatch]);

  // Selectores
  const products = useSelector((state) => state.products.products);
  const categories = useSelector((state) => state.categories.categories);
  const adminUsers = useSelector((state) => state.adminUsers.users);

  const categoryNames = Array.isArray(categories)
    ? categories.map((cat) => cat.name).filter(Boolean)
    : [];

  // Handlers
  const handleSubmit = (formData) => {
    if (editingProduct) {
      formData.append("id", editingProduct.id);
      dispatch(updateProduct(formData));
    } else {
      dispatch(insertProduct(formData));
    }
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleDelete = (productId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este producto?")
    ) {
      dispatch(deleteProduct(productId));
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleAddCategory = (categoryName) => {
    dispatch(insertCategory(categoryName));
  };

  const handleUpdateCategory = (oldName, newName) => {
    dispatch(updateCategory(oldName, newName));
  };

  const handleDeleteCategory = (categoryName) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar la categoría "${categoryName}"?`
      )
    ) {
      dispatch(deleteCategory(categoryName));
    }
  };

  const handleLogout = () => {
    dispatch(startLogout());
    onLogout();
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: HiOutlineChartBar },
    { id: "products", label: "Productos", icon: HiOutlineCube },
    { id: "categories", label: "Categorías", icon: HiOutlineTag },
    { id: "featured", label: "Destacados", icon: HiOutlineStar },
    { id: "users", label: "Usuarios Admin", icon: HiOutlineUsers },
    { id: "config", label: "Configuración App", icon: HiOutlineCog },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardStats products={products} />;

      case "products":
        return (
          <div className="admin-section">
            <div className="admin-section__header">
              <h2 className="admin-section__title">Gestión de Productos</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="admin-section__add-button"
              >
                Agregar Producto
              </button>
            </div>

            {products.length === 0 ? (
              <div className="admin-section__empty">
                <HiOutlineCube className="admin-section__empty-icon" />
                <h3>No hay productos</h3>
                <p>Comienza agregando tu primer producto al catálogo</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="admin-section__empty-button"
                >
                  Agregar Primer Producto
                </button>
              </div>
            ) : (
              <ProductList
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        );

      case "categories":
        return (
          <div className="admin-section">
            <h2 className="admin-section__title">Gestión de Categorías</h2>
            <CategoryManager
              categories={categories}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          </div>
        );

      case "featured":
        return (
          <div className="admin-section">
            <h2 className="admin-section__title">Productos Destacados</h2>
            <FeaturedProductsManager />
          </div>
        );

      case "users":
        return (
          <div className="admin-section">
            <h2 className="admin-section__title">
              Gestión de Usuarios Administradores
            </h2>
            <AdminUsersManager users={adminUsers} />
          </div>
        );

      case "config":
        return (
          <div className="admin-section">
            <h2 className="admin-section__title">Configuración de la App</h2>
            <AppConfigManager />
          </div>
        );

      default:
        return <DashboardStats products={products} />;
    }
  };

  return (
    <div className="admin-interface">
      {/* Header Mejorado */}
      <Header>
        <div className="admin-header__content">
          <div className="admin-header__brand">
            <div className="admin-header__icon-wrapper">
              <HiOutlineShieldCheck className="admin-header__icon" />
            </div>
            <div className="admin-header__text">
              <h1 className="admin-header__title">Panel de Administración</h1>
              <p className="admin-header__subtitle">
                Gestión completa de tu tienda
              </p>
            </div>
          </div>

          <div className="admin-interface__header-actions">
            <div className="admin-header__user">
              <HiOutlineUserCircle className="admin-header__user-icon" />
              <span className="admin-header__user-text">Administrador</span>
            </div>
            <button
              className="admin-interface__mobile-menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
            </button>
          </div>
        </div>
      </Header>

      <div className="admin-interface__layout">
        {/* Sidebar Navigation */}
        <nav
          className={`admin-sidebar ${
            isMobileMenuOpen ? "admin-sidebar--open" : ""
          }`}
        >
          <div className="admin-sidebar__header">
            <h3 className="admin-sidebar__title">Menú Admin</h3>
          </div>

          <div className="admin-sidebar__menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`admin-sidebar__item ${
                    activeSection === item.id
                      ? "admin-sidebar__item--active"
                      : ""
                  }`}
                >
                  <Icon className="admin-sidebar__icon" />
                  <span className="admin-sidebar__label">{item.label}</span>
                </button>
              );
            })}

            {/* Botón de Cerrar Sesión en el sidebar */}
            <button
              onClick={handleLogout}
              className="admin-sidebar__item admin-sidebar__item--logout"
            >
              <HiOutlineLogout className="admin-sidebar__icon" />
              <span className="admin-sidebar__label">Cerrar Sesión</span>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="admin-main">
          <div className="admin-main__content">{renderContent()}</div>
        </main>
      </div>

      {/* Product Form Modal */}
      {showAddForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default AdminInterface;
