// components/admin/AppConfigManager/AppConfigManager.jsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  HiOutlineCog,
  HiOutlineColorSwatch,
  HiOutlineInformationCircle,
  HiCheck,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineCurrencyDollar,
  HiOutlineCurrencyEuro,
  HiOutlineCash,
} from "react-icons/hi";
import {
  updateAppConfig,
  loadAppConfig,
  previewTheme,
  resetTheme,
} from "../../../actions/appConfigActions";
import { getThemePreview } from "../../../utils/themeManager";
import Swal from "sweetalert2";
import "./AppConfigManager.css";

const AppConfigManager = () => {
  const dispatch = useDispatch();
  const config = useSelector((state) => state.appConfig.config);

  const [formData, setFormData] = useState({
    app_name: "",
    app_description: "",
    theme: "blue",
    whatsapp_number: "",
    business_hours: "",
    business_address: "",
    logo_url: "",
    initialinfo: "",
    show_initialinfo: true,
    currency: "MN", // ✅ NUEVO CAMPO
  });

  const [activeTab, setActiveTab] = useState("general");
  const [previewingTheme, setPreviewingTheme] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(loadAppConfig());
  }, [dispatch]);

  useEffect(() => {
    if (config) {
      setFormData({
        app_name: config.app_name || "",
        app_description: config.app_description || "",
        theme: config.theme || "blue",
        whatsapp_number: config.whatsapp_number || "",
        business_hours: config.business_hours || "",
        business_address: config.business_address || "",
        logo_url: config.logo_url || "",
        initialinfo: config.initialinfo || "",
        show_initialinfo: config.show_initialinfo !== false,
        currency: config.currency || "MN", // ✅ NUEVO CAMPO
      });
    }
  }, [config]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleThemeSelect = (themeName) => {
    setFormData((prev) => ({
      ...prev,
      theme: themeName,
    }));
  };

  const handleCurrencySelect = (currencyCode) => {
    setFormData((prev) => ({
      ...prev,
      currency: currencyCode,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "¿Guardar cambios?",
      text: "Se aplicarán los cambios a toda la aplicación",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
      return;
    }

    setSaving(true);

    try {
      const success = await dispatch(updateAppConfig(formData));
      if (success) {
        setPreviewingTheme(null);
      }
    } catch (error) {
      console.error("Error guardando configuración:", error);
    } finally {
      setSaving(false);
    }
  };

  const handlePreviewTheme = (themeName) => {
    setPreviewingTheme(themeName);
    dispatch(previewTheme(themeName));
  };

  const handleResetPreview = () => {
    setPreviewingTheme(null);
    dispatch(resetTheme());
  };

  // En tu componente AppConfigManager.jsx, reemplaza el array themeOptions con:
  const themeOptions = [
    {
      id: "blue",
      name: "Azul Profesional",
      description: "Perfecto para negocios serios",
    },
    {
      id: "green",
      name: "Verde Natural",
      description: "Ideal para productos orgánicos",
    },
    {
      id: "emerald",
      name: "Verde Esmeralda",
      description: "Fresco y moderno",
    },
    {
      id: "lime",
      name: "Verde Lima",
      description: "Energético y vibrante",
    },
    {
      id: "purple",
      name: "Púrpura Creativo",
      description: "Para marcas innovadoras",
    },
    {
      id: "violet",
      name: "Violeta Real",
      description: "Lujo y elegancia",
    },
    {
      id: "indigo",
      name: "Índigo Profundo",
      description: "Confiabilidad y estabilidad",
    },
    {
      id: "fuchsia",
      name: "Fucsia Vibrante",
      description: "Juvenil y atrevido",
    },
    {
      id: "pink",
      name: "Rosa Moderno",
      description: "Amigable y accesible",
    },
    {
      id: "rose",
      name: "Rosa Elegante",
      description: "Moderna y sofisticada",
    },
    {
      id: "orange",
      name: "Naranja Energético",
      description: "Llama la atención",
    },
    {
      id: "amber",
      name: "Ámbar Cálido",
      description: "Acogedor y tradicional",
    },
    {
      id: "cyan",
      name: "Cyan Refrescante",
      description: "Tecnológico y limpio",
    },
    {
      id: "sky",
      name: "Azul Cielo",
      description: "Sereno y confiable",
    },
    {
      id: "slate",
      name: "Pizarra Neutral",
      description: "Minimalista y profesional",
    },
    {
      id: "stone",
      name: "Piedra Natural",
      description: "Elegante y discreto",
    },
  ];

  // ✅ NUEVO: Opciones de moneda (con iconos corregidos)
  const currencyOptions = [
    {
      code: "MN",
      name: "Moneda Nacional",
      symbol: "$",
      description: "Peso local (MN)",
      icon: HiOutlineCash, // Usando HiOutlineCash para moneda nacional
    },
    {
      code: "USD",
      name: "Dólares Americanos",
      symbol: "US$",
      description: "Dólares (USD)",
      icon: HiOutlineCurrencyDollar,
    },
    {
      code: "EUR",
      name: "Euros",
      symbol: "€",
      description: "Euros (EUR)",
      icon: HiOutlineCurrencyEuro,
    },
  ];

  return (
    <div className="app-config-manager">
      <div className="config-header">
        <HiOutlineCog className="config-icon" />
        <h2>Configuración de la App</h2>
      </div>

      <div className="config-tabs">
        <button
          className={`tab ${activeTab === "general" ? "active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          <HiOutlineInformationCircle />
          General
        </button>
        <button
          className={`tab ${activeTab === "appearance" ? "active" : ""}`}
          onClick={() => setActiveTab("appearance")}
        >
          <HiOutlineColorSwatch />
          Apariencia
        </button>
        <button
          className={`tab ${activeTab === "currency" ? "active" : ""}`}
          onClick={() => setActiveTab("currency")}
        >
          <HiOutlineCurrencyDollar />
          Moneda
        </button>
        <button
          className={`tab ${activeTab === "contact" ? "active" : ""}`}
          onClick={() => setActiveTab("contact")}
        >
          <HiOutlineCog />
          Contacto
        </button>
        <button
          className={`tab ${activeTab === "welcome" ? "active" : ""}`}
          onClick={() => setActiveTab("welcome")}
        >
          <HiOutlineInformationCircle />
          Mensaje Bienvenida
        </button>
      </div>

      <form onSubmit={handleSubmit} className="config-form">
        {activeTab === "general" && (
          <div className="tab-content">
            <div className="form-group">
              <label>Nombre de la App</label>
              <input
                type="text"
                name="app_name"
                value={formData.app_name}
                onChange={handleInputChange}
                placeholder="Ej: Minimarket Digital"
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="app_description"
                value={formData.app_description}
                onChange={handleInputChange}
                placeholder="Ej: Tu tienda de confianza"
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>URL del Logo</label>
              <input
                type="url"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/logo.png"
              />
              <small className="help-text">
                Opcional. Deja vacío para usar el logo por defecto.
              </small>
            </div>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="tab-content">
            <div className="theme-selection">
              <h3 className="theme-title">Selecciona un Tema</h3>
              <p className="theme-subtitle">
                El tema cambiará los colores de toda la aplicación
              </p>

              <div className="theme-grid">
                {themeOptions.map((theme) => {
                  const themeColors = getThemePreview(theme.id);
                  return (
                    <div
                      key={theme.id}
                      className={`theme-card ${
                        formData.theme === theme.id ? "selected" : ""
                      } ${previewingTheme === theme.id ? "previewing" : ""}`}
                      onClick={() => handleThemeSelect(theme.id)}
                    >
                      <div className="theme-preview">
                        <div
                          className="theme-primary"
                          style={{
                            backgroundColor: themeColors["--primary-blue"],
                          }}
                        />
                        <div
                          className="theme-accent"
                          style={{
                            backgroundColor: themeColors["--accent-teal"],
                          }}
                        />
                        <div
                          className="theme-success"
                          style={{ backgroundColor: themeColors["--success"] }}
                        />
                      </div>

                      <div className="theme-info">
                        <h4 className="theme-name">{theme.name}</h4>
                        <p className="theme-description">{theme.description}</p>
                      </div>

                      {formData.theme === theme.id && (
                        <div className="theme-selected-indicator">
                          <HiCheck className="check-icon" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="theme-preview-actions">
                <button
                  type="button"
                  onClick={() => handlePreviewTheme(formData.theme)}
                  className="preview-btn"
                  disabled={previewingTheme === formData.theme}
                >
                  {previewingTheme ? "Vista Previa Activa" : "Ver Vista Previa"}
                </button>

                {previewingTheme && (
                  <button
                    type="button"
                    onClick={handleResetPreview}
                    className="reset-btn"
                  >
                    Restablecer
                  </button>
                )}
              </div>

              {previewingTheme && (
                <div className="preview-notice">
                  <span>
                    ⚠️ Vista previa activa - Guarda los cambios para aplicar
                    permanentemente
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ✅ NUEVA PESTAÑA: Configuración de Moneda */}
        {activeTab === "currency" && (
          <div className="tab-content">
            <div className="currency-selection">
              <h3 className="currency-title">Selecciona la Moneda</h3>
              <p className="currency-subtitle">
                Esta moneda se mostrará en todos los precios de la aplicación
              </p>

              <div className="currency-grid">
                {currencyOptions.map((currency) => {
                  const IconComponent = currency.icon;
                  return (
                    <div
                      key={currency.code}
                      className={`currency-card ${
                        formData.currency === currency.code ? "selected" : ""
                      }`}
                      onClick={() => handleCurrencySelect(currency.code)}
                    >
                      <div className="currency-icon">
                        <IconComponent className="currency-symbol" />
                      </div>

                      <div className="currency-info">
                        <h4 className="currency-name">{currency.name}</h4>
                        <p className="currency-description">
                          {currency.description}
                        </p>
                        <div className="currency-preview">
                          <span className="currency-example">
                            {currency.symbol} 99.99
                          </span>
                        </div>
                      </div>

                      {formData.currency === currency.code && (
                        <div className="currency-selected-indicator">
                          <HiCheck className="check-icon" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="currency-preview-section">
                <h4 className="preview-title">Vista Previa</h4>
                <div className="preview-content">
                  <div className="price-preview">
                    <p>
                      <strong>Producto de ejemplo:</strong> Camiseta Básica
                    </p>
                    <p className="preview-price">
                      Precio:{" "}
                      {currencyOptions.find((c) => c.code === formData.currency)
                        ?.symbol || "$"}{" "}
                      29.99
                    </p>
                    <small className="help-text">
                      Los precios se mostrarán con este formato en toda la app
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="tab-content">
            <div className="form-group">
              <label>Número de WhatsApp</label>
              <input
                type="text"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleInputChange}
                placeholder="+5491112345678"
                required
              />
              <small className="help-text">
                Incluye el código de país. Ej: +5491112345678
              </small>
            </div>

            <div className="form-group">
              <label>Horario de Atención</label>
              <input
                type="text"
                name="business_hours"
                value={formData.business_hours}
                onChange={handleInputChange}
                placeholder="Lun-Vie: 8:00 - 20:00"
                required
              />
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <textarea
                name="business_address"
                value={formData.business_address}
                onChange={handleInputChange}
                placeholder="Av. Principal 123"
                rows="3"
                required
              />
            </div>
          </div>
        )}

        {activeTab === "welcome" && (
          <div className="tab-content">
            <div className="form-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  name="show_initialinfo"
                  checked={formData.show_initialinfo}
                  onChange={handleInputChange}
                  className="toggle-input"
                />
                <span className="toggle-slider"></span>
                <span className="toggle-text">
                  {formData.show_initialinfo ? (
                    <>
                      <HiOutlineEye className="toggle-icon" />
                      Mostrar mensaje al iniciar la app
                    </>
                  ) : (
                    <>
                      <HiOutlineEyeOff className="toggle-icon" />
                      Ocultar mensaje al iniciar la app
                    </>
                  )}
                </span>
              </label>
              <small className="help-text">
                Cuando está activado, los usuarios verán este mensaje la primera
                vez que abran la aplicación
              </small>
            </div>

            <div className="form-group">
              <label>Mensaje de Bienvenida</label>
              <textarea
                name="initialinfo"
                value={formData.initialinfo}
                onChange={handleInputChange}
                placeholder="Escribe aquí tu mensaje de bienvenida personalizado..."
                rows="8"
                className="welcome-textarea"
              />
              <small className="help-text">
                Puedes usar formato Markdown básico: **negrita**, *cursiva*,
                saltos de línea
              </small>
            </div>

            <div className="preview-section">
              <h4 className="preview-title">Vista Previa del Mensaje</h4>
              <div className="preview-content">
                {formData.initialinfo ? (
                  <div className="preview-message">
                    {formData.initialinfo.split("\n").map((line, index) => (
                      <p key={index} className="preview-line">
                        {line}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="preview-placeholder">
                    El mensaje de bienvenida aparecerá aquí...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? "Guardando..." : "Guardar Configuración"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppConfigManager;
