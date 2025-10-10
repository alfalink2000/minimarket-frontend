import React, { useState, useEffect } from "react";
import { HiOutlineX, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import "./AdminUserForm.css";

const AdminUserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        full_name: user.full_name || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = "El nombre completo es obligatorio";
    }

    // Validaciones de contraseña solo si se está cambiando
    if (
      formData.newPassword ||
      formData.confirmPassword ||
      formData.currentPassword
    ) {
      if (!formData.currentPassword) {
        newErrors.currentPassword =
          "La contraseña actual es obligatoria para cambiar la contraseña";
      }

      if (formData.newPassword && formData.newPassword.length < 8) {
        newErrors.newPassword =
          "La nueva contraseña debe tener al menos 8 caracteres";
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      id: user?.id,
      username: formData.username,
      email: formData.email,
      full_name: formData.full_name,
    };

    // Solo incluir campos de contraseña si se están cambiando
    if (formData.currentPassword) {
      submitData.password_user = formData.currentPassword;
      submitData.new_password = formData.newPassword;
    }

    onSubmit(submitData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando se empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const isEditing = !!user;

  return (
    <div className="admin-user-form-overlay">
      <div className="admin-user-form">
        <div className="admin-user-form__header">
          <h2 className="admin-user-form__title">
            {isEditing
              ? "Editar Usuario Administrador"
              : "Crear Usuario Administrador"}
          </h2>
          <button onClick={onCancel} className="admin-user-form__close-button">
            <HiOutlineX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-user-form__content">
          <div className="admin-user-form__group">
            <label htmlFor="username" className="admin-user-form__label">
              Nombre de Usuario *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`admin-user-form__input ${
                errors.username ? "admin-user-form__input--error" : ""
              }`}
              placeholder="Ingresa el nombre de usuario"
            />
            {errors.username && (
              <span className="admin-user-form__error">{errors.username}</span>
            )}
          </div>

          <div className="admin-user-form__group">
            <label htmlFor="email" className="admin-user-form__label">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`admin-user-form__input ${
                errors.email ? "admin-user-form__input--error" : ""
              }`}
              placeholder="Ingresa el email"
            />
            {errors.email && (
              <span className="admin-user-form__error">{errors.email}</span>
            )}
          </div>

          <div className="admin-user-form__group">
            <label htmlFor="full_name" className="admin-user-form__label">
              Nombre Completo *
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`admin-user-form__input ${
                errors.full_name ? "admin-user-form__input--error" : ""
              }`}
              placeholder="Ingresa el nombre completo"
            />
            {errors.full_name && (
              <span className="admin-user-form__error">{errors.full_name}</span>
            )}
          </div>

          {isEditing && (
            <>
              <div className="admin-user-form__section-divider">
                <span>Cambiar Contraseña (Opcional)</span>
              </div>

              <div className="admin-user-form__group">
                <label
                  htmlFor="currentPassword"
                  className="admin-user-form__label"
                >
                  Contraseña Actual
                </label>
                <div className="admin-user-form__password-wrapper">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`admin-user-form__input ${
                      errors.currentPassword
                        ? "admin-user-form__input--error"
                        : ""
                    }`}
                    placeholder="Ingresa la contraseña actual"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="admin-user-form__password-toggle"
                  >
                    {showCurrentPassword ? (
                      <HiOutlineEyeOff />
                    ) : (
                      <HiOutlineEye />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <span className="admin-user-form__error">
                    {errors.currentPassword}
                  </span>
                )}
              </div>

              <div className="admin-user-form__group">
                <label htmlFor="newPassword" className="admin-user-form__label">
                  Nueva Contraseña
                </label>
                <div className="admin-user-form__password-wrapper">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`admin-user-form__input ${
                      errors.newPassword ? "admin-user-form__input--error" : ""
                    }`}
                    placeholder="Ingresa la nueva contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="admin-user-form__password-toggle"
                  >
                    {showNewPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                  </button>
                </div>
                {errors.newPassword && (
                  <span className="admin-user-form__error">
                    {errors.newPassword}
                  </span>
                )}
              </div>

              <div className="admin-user-form__group">
                <label
                  htmlFor="confirmPassword"
                  className="admin-user-form__label"
                >
                  Confirmar Nueva Contraseña
                </label>
                <div className="admin-user-form__password-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`admin-user-form__input ${
                      errors.confirmPassword
                        ? "admin-user-form__input--error"
                        : ""
                    }`}
                    placeholder="Confirma la nueva contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="admin-user-form__password-toggle"
                  >
                    {showConfirmPassword ? (
                      <HiOutlineEyeOff />
                    ) : (
                      <HiOutlineEye />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="admin-user-form__error">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </>
          )}

          <div className="admin-user-form__actions">
            <button
              type="button"
              onClick={onCancel}
              className="admin-user-form__button admin-user-form__button--cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="admin-user-form__button admin-user-form__button--submit"
            >
              {isEditing ? "Actualizar Usuario" : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUserForm;
