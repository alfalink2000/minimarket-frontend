import { useState, useEffect, useMemo, useCallback } from "react";
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
  HiOutlineUsers,
} from "react-icons/hi";

// Components
import AdminHeader from "../AdminHeader/AdminHeader";
import DashboardStats from "../DashboardStats/DashboardStats";
import ProductList from "../ProductList/ProductList";
import ProductForm from "../ProductForm/ProductForm";
import CategoryManager from "../CategoryManager/CategoryManager";
import FeaturedProductsManager from "../FeaturedProductsManager/FeaturedProductsManager";
import AdminUsersManager from "../AdminUsersManager/AdminUsersManager";
import AppConfigManager from "../AppConfigManager/AppConfigManager";

// Actions
import { getFeaturedProducts } from "../../../actions/featuredProductsActions";
import { getAdminUsers } from "../../../actions/adminUsersActions";
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

import "./AdminInterface.css";

// Constantes para evitar recreación de objetos
const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: HiOutlineChartBar },
  { id: "products", label: "Productos", icon: HiOutlineCube },
  { id: "categories", label: "Categorías", icon: HiOutlineTag },
  { id: "featured", label: "Destacados", icon: HiOutlineStar },
  { id: "users", label: "Usuarios Admin", icon: HiOutlineUsers },
  { id: "config", label: "Configuración App", icon: HiOutlineCog },
];

const AdminInterface = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();

  // Selectores optimizados con selectores específicos
  const products = useSelector((state) => state.products.products);
  const categories = useSelector((state) => state.categories.categories);
  const adminUsers = useSelector((state) => state.adminUsers.users);

  // Efectos agrupados
  useEffect(() => {
    dispatch(getFeaturedProducts());
    dispatch(getAdminUsers());
  }, [dispatch]);

  // Memoizar valores derivados
  const categoryNames = useMemo(
    () =>
      Array.isArray(categories)
        ? categories.map((cat) => cat.name).filter(Boolean)
        : [],
    [categories]
  );

  // Handlers optimizados con useCallback
  const handleSubmit = useCallback(
    (formData) => {
      if (editingProduct) {
        formData.append("id", editingProduct.id);
        dispatch(updateProduct(formData));
      } else {
        dispatch(insertProduct(formData));
      }
      setShowAddForm(false);
      setEditingProduct(null);
    },
    [editingProduct, dispatch]
  );

  const handleEdit = useCallback((product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  }, []);

  const handleDelete = useCallback(
    (productId) => {
      if (
        window.confirm("¿Estás seguro de que quieres eliminar este producto?")
      ) {
        dispatch(deleteProduct(productId));
      }
    },
    [dispatch]
  );

  const handleCancel = useCallback(() => {
    setShowAddForm(false);
    setEditingProduct(null);
  }, []);

  const handleAddCategory = useCallback(
    (categoryName) => {
      dispatch(insertCategory(categoryName));
    },
    [dispatch]
  );

  const handleUpdateCategory = useCallback(
    (oldName, newName) => {
      dispatch(updateCategory(oldName, newName));
    },
    [dispatch]
  );

  const handleDeleteCategory = useCallback(
    (categoryName) => {
      if (
        window.confirm(
          `¿Estás seguro de que quieres eliminar la categoría "${categoryName}"?`
        )
      ) {
        dispatch(deleteCategory(categoryName));
      }
    },
    [dispatch]
  );

  const handleLogout = useCallback(() => {
    dispatch(startLogout());
    onLogout();
  }, [dispatch, onLogout]);

  const handleSectionChange = useCallback((sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  }, []);

  // Renderizado de contenido optimizado
  const renderContent = useMemo(() => {
    const sectionProps = {
      className: "admin-section",
      titleClass: "admin-section__title",
    };

    switch (activeSection) {
      case "dashboard":
        return <DashboardStats products={products} />;

      case "products":
        return (
          <div {...sectionProps}>
            <div className="admin-section__header">
              <h2 className={sectionProps.titleClass}>Gestión de Productos</h2>
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
          <div {...sectionProps}>
            <h2 className={sectionProps.titleClass}>Gestión de Categorías</h2>
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
          <div {...sectionProps}>
            <h2 className={sectionProps.titleClass}>Productos Destacados</h2>
            <FeaturedProductsManager />
          </div>
        );

      case "users":
        return (
          <div {...sectionProps}>
            <h2 className={sectionProps.titleClass}>
              Gestión de Usuarios Administradores
            </h2>
            <AdminUsersManager users={adminUsers} />
          </div>
        );

      case "config":
        return (
          <div {...sectionProps}>
            <h2 className={sectionProps.titleClass}>Configuración de la App</h2>
            <AppConfigManager />
          </div>
        );

      default:
        return <DashboardStats products={products} />;
    }
  }, [
    activeSection,
    products,
    categories,
    adminUsers,
    handleEdit,
    handleDelete,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  ]);

  return (
    <div className="admin-interface">
      <AdminHeader>
        <div className="admin-header__content">
          <div className="admin-header__left">
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
          </div>

          <div className="admin-header__right">
            <div className="admin-header__user-info">
              <HiOutlineUserCircle className="admin-header__user-icon" />
              <div className="admin-header__user-details">
                <span className="admin-header__user-name">Administrador</span>
                <span className="admin-header__user-role">Super Admin</span>
              </div>
            </div>

            <button
              className="admin-interface__mobile-menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menú de navegación"
            >
              {isMobileMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
            </button>
          </div>
        </div>
      </AdminHeader>

      <div className="admin-interface__layout">
        <nav
          className={`admin-sidebar ${
            isMobileMenuOpen ? "admin-sidebar--open" : ""
          }`}
        >
          <div className="admin-sidebar__header">
            <h3 className="admin-sidebar__title">Menú Admin</h3>
          </div>

          <div className="admin-sidebar__menu">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
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

            <button
              onClick={handleLogout}
              className="admin-sidebar__item admin-sidebar__item--logout"
            >
              <HiOutlineLogout className="admin-sidebar__icon" />
              <span className="admin-sidebar__label">Cerrar Sesión</span>
            </button>
          </div>
        </nav>

        <main className="admin-main">
          <div className="admin-main__content">{renderContent}</div>
        </main>
      </div>

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
