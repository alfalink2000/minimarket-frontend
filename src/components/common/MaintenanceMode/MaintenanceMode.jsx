import { useState, useEffect } from "react";
import "./MaintenanceMode.css";

const MaintenanceMode = ({ onRetry }) => {
  const [countdown, setCountdown] = useState(30);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

    // Verificar estado de conexión
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (countdown === 0) {
      // Verificar conexión antes de reintentar
      if (navigator.onLine) {
        onRetry();
      } else {
        setIsOnline(false);
        setCountdown(10); // Reiniciar countdown si sigue sin conexión
      }
    }
  };

  return (
    <div className="maintenance-mode">
      <div className="maintenance-container">
        {/* Icono animado de conexión */}
        <div className="maintenance-icon">
          <div className="wifi-icon">
            <div className="wifi-signal signal-1"></div>
            <div className="wifi-signal signal-2"></div>
            <div className="wifi-signal signal-3"></div>
            <div className="wifi-dot"></div>
          </div>
          <div className="maintenance-emoji">🌐</div>
        </div>

        {/* Código de error */}
        <div className="maintenance-code">
          <span className="code-4">4</span>
          <span className="code-0">0</span>
          <span className="code-4">4</span>
        </div>

        {/* Título y mensaje */}
        <h1 className="maintenance-title">Error de Conexión</h1>

        <p className="maintenance-subtitle">
          {isOnline
            ? "No se pudo conectar con el servidor"
            : "Sin conexión a internet"}
        </p>

        <div className="maintenance-message">
          <p className="message-text">
            {isOnline
              ? "El servidor no está respondiendo. Esto puede ser temporal."
              : "Verifica tu conexión a internet e intenta nuevamente."}
          </p>

          <div className="connection-status">
            <div
              className={`status-indicator ${
                isOnline ? "status-warning" : "status-error"
              }`}
            ></div>
            <p className="status-text">
              {isOnline ? "Servidor no disponible" : "Sin conexión a internet"}
            </p>
          </div>
        </div>

        {/* Soluciones rápidas */}
        <div className="troubleshooting-tips">
          <h3 className="tips-title">Solución rápida:</h3>
          <ul className="tips-list">
            <li className="tip-item">
              ✓ Verifica tu conexión Wi-Fi o datos móviles
            </li>
            <li className="tip-item">✓ Reinicia tu router/módem</li>
            <li className="tip-item">✓ Desactiva temporalmente el VPN</li>
            <li className="tip-item">✓ Verifica la señal de tu conexión</li>
          </ul>
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

        {/* Información de red */}
        <div className="network-info">
          <div className="network-status">
            <span className="status-label">Estado de red:</span>
            <span className={`status-value ${isOnline ? "online" : "offline"}`}>
              {isOnline ? "Conectado" : "Desconectado"}
            </span>
          </div>
          <p className="network-help">
            Si el problema persiste, contacta a tu proveedor de internet
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;
