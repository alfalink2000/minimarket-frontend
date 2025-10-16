import { useState, useEffect } from "react";
import "./MaintenanceMode.css";

const MaintenanceMode = ({ onRetry }) => {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRetry = () => {
    if (countdown === 0) {
      onRetry();
    }
  };

  return (
    <div className="maintenance-mode">
      <div className="maintenance-container">
        {/* Icono animado */}
        <div className="maintenance-icon">
          <div className="icon-outer-ring"></div>
          <div className="icon-inner-ring"></div>
          <div className="icon-emoji">🔧</div>
        </div>

        {/* Título y mensaje */}
        <h1 className="maintenance-title">Sitio en Mantenimiento</h1>

        <p className="maintenance-subtitle">Estamos realizando mejoras</p>

        <div className="maintenance-message">
          <p className="message-text">
            Nuestra tienda estará en línea muy pronto. Estamos trabajando para
            brindarte una mejor experiencia.
          </p>

          <div className="status-indicator">
            <div className="status-pulse"></div>
            <p className="status-text">Volveremos en breve</p>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="contact-info">
          <p className="contact-label">
            Contacte con su proveedor de servicio:
          </p>
          <p className="contact-phone">Conectando...</p>
        </div>

        {/* Botón de reintento */}
        <button
          onClick={handleRetry}
          disabled={countdown > 0}
          className={`retry-button ${
            countdown > 0 ? "retry-button--disabled" : "retry-button--active"
          }`}
        >
          {countdown > 0 ? (
            <span className="button-content">
              <div className="button-spinner"></div>
              Reintentar en {countdown}s
            </span>
          ) : (
            <span className="button-content">
              <span className="button-emoji">🔄</span>
              Reintentar Conexión
            </span>
          )}
        </button>

        {/* Progress bar */}
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${((30 - countdown) / 30) * 100}%` }}
          ></div>
        </div>

        {/* Mensaje animado */}
        <div className="thank-you-message">
          <p className="thank-you-text">¡Gracias por tu paciencia!</p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;
