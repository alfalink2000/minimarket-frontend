import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import {
  updateAdminUser,
  toggleUserStatus,
  deleteAdminUser,
  setActiveAdminUser,
} from "../../../actions/adminUsersActions";
import AdminUserForm from "../AdminUserForm/AdminUserForm";
import "./AdminUsersManager.css";

const AdminUsersManager = ({ users }) => {
  const dispatch = useDispatch();
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Calcular estadísticas
  const activeUsersCount = users.filter((user) => user.is_active).length;
  const canDeactivate = activeUsersCount > 1;
  const canDelete = users.length > 1;

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowEditForm(true);
    dispatch(setActiveAdminUser(user));
  };

  const handleToggleStatus = (user) => {
    // Verificación adicional en el frontend
    if (!user.is_active && !canDeactivate) {
      Swal.fire(
        "Error",
        "No se puede desactivar el último usuario activo",
        "error"
      );
      return;
    }
    dispatch(toggleUserStatus(user.id, user.is_active));
  };

  const handleDelete = (userId) => {
    if (!canDelete) {
      Swal.fire("Error", "No se puede eliminar el último usuario", "error");
      return;
    }
    dispatch(deleteAdminUser(userId));
  };
  const handleSubmit = (userData) => {
    dispatch(updateAdminUser(userData)).then((success) => {
      if (success) {
        setShowEditForm(false);
        setEditingUser(null);
      }
    });
  };

  const handleCancel = () => {
    setShowEditForm(false);
    setEditingUser(null);
  };

  return (
    <div className="admin-users-manager">
      <div className="admin-users__stats">
        <div className="admin-users__stat">
          <span className="admin-users__stat-number">{users.length}</span>
          <span className="admin-users__stat-label">Usuarios Totales</span>
        </div>
        <div className="admin-users__stat">
          <span className="admin-users__stat-number">{activeUsersCount}</span>
          <span className="admin-users__stat-label">Usuarios Activos</span>
        </div>
        <div className="admin-users__stat">
          <span className="admin-users__stat-number">
            {canDeactivate ? "✓" : "✗"}
          </span>
          <span className="admin-users__stat-label">
            {canDeactivate ? "Puede desactivar" : "No puede desactivar"}
          </span>
        </div>
      </div>

      <div className="admin-users__list">
        {users.length === 0 ? (
          <div className="admin-users__empty">
            <HiOutlineUsers className="admin-users__empty-icon" />
            <h3>No hay usuarios administradores</h3>
            <p>Los usuarios administradores aparecerán aquí</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="admin-user-card">
              <div className="admin-user-card__info">
                <h4 className="admin-user-card__name">
                  {user.username}
                  {user.id === 1 && (
                    <span className="admin-user-card__badge">Principal</span>
                  )}
                </h4>
                <p className="admin-user-card__email">{user.email}</p>
                <div className="admin-user-card__meta">
                  <span
                    className={`admin-user-card__status ${
                      user.is_active ? "active" : "inactive"
                    }`}
                  >
                    {user.is_active ? "Activo" : "Inactivo"}
                  </span>
                  <span className="admin-user-card__date">
                    Creado: {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="admin-user-card__actions">
                <button
                  onClick={() => handleEdit(user)}
                  className="admin-user-card__button admin-user-card__button--edit"
                  title="Editar usuario"
                >
                  <HiOutlinePencil />
                </button>

                <button
                  onClick={() => handleToggleStatus(user)}
                  className={`admin-user-card__button ${
                    user.is_active
                      ? "admin-user-card__button--deactivate"
                      : "admin-user-card__button--activate"
                  }`}
                  title={
                    user.is_active ? "Desactivar usuario" : "Activar usuario"
                  }
                  disabled={user.is_active && !canDeactivate}
                >
                  {user.is_active ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>

                <button
                  onClick={() => handleDelete(user.id)}
                  className="admin-user-card__button admin-user-card__button--delete"
                  title="Eliminar usuario"
                  disabled={!canDelete}
                >
                  <HiOutlineTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de edición */}
      {showEditForm && (
        <AdminUserForm
          user={editingUser}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default AdminUsersManager;
