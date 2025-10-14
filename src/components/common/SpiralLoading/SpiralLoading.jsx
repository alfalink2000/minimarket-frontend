// components/common/SpiralLoading/SpiralLoading.jsx
import { useSelector } from "react-redux";
import "./SpiralLoading.css";

const SpiralLoading = ({ fadeOut = false }) => {
  // Obtener el nombre de la app desde el estado de Redux
  const appConfig = useSelector((state) => state.appConfig.config);
  const appName = appConfig?.app_name || "Minimarket Digital";
  const appDescription = appConfig?.app_description || "Tu tienda en línea";

  return (
    <div className={`spiral-loading ${fadeOut ? "fade-out" : ""}`}>
      <div className="spiral-container">
        {/* Espiral principal */}
        <div className="spiral">
          <div className="spiral-ring ring-1"></div>
          <div className="spiral-ring ring-2"></div>
          <div className="spiral-ring ring-3"></div>
          <div className="spiral-ring ring-4"></div>
          <div className="spiral-core"></div>
        </div>

        {/* Texto con efecto de aparición - DESCOMENTADO Y MEJORADO */}

        {/* Partículas flotantes */}
        <div className="floating-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
        </div>
      </div>

      {/* Mensaje de bienvenida personalizado */}
      <div className="welcome-message">
        <h2>{appName}</h2>
        <p>{appDescription}</p>
      </div>
    </div>
  );
};

export default SpiralLoading;
