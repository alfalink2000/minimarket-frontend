import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClientInterface from "./components/client/ClientInterface/ClientInterface";
import AdminInterface from "./components/admin/AdminInterface/AdminInterface";
import LoginModal from "./components/auth/LoginModal";
import {
  StartChecking,
  checkingFinish,
  StartLogin,
} from "./actions/authActions";
import { getProducts } from "./actions/productsActions";
import { getCategories } from "./actions/categoriesActions";
import { loadFeaturedProducts } from "./actions/featuredProductsActions";
import { loadAppConfig } from "./actions/appConfigActions";
import SpiralLoading from "./components/common/SpiralLoading/SpiralLoading";

const App = () => {
  const [currentView, setCurrentView] = useState("client");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const appConfig = useSelector((state) => state.appConfig.config);
  const loadingStartTime = useRef(Date.now());

  // Agrega este script en tu frontend (React)
  useEffect(() => {
    const keepAlive = () => {
      fetch("https://minimarket-backend-6z9m.onrender.com/api/health")
        .then(() => console.log("✅ Ping enviado"))
        .catch(() => console.log("❌ Error en ping"));
    };

    // Ping cada 10 minutos
    const interval = setInterval(keepAlive, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ CARGAR DATOS INICIALES CON MEJOR MANEJO
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log("🚀 Iniciando carga de datos...");
        loadingStartTime.current = Date.now();

        // Simular progreso
        setLoadingProgress(20);

        // Cargar configuración primero (más importante)
        await dispatch(loadAppConfig());
        setLoadingProgress(40);

        // Cargar el resto en paralelo
        await Promise.all([
          dispatch(getProducts()),
          dispatch(getCategories()),
          dispatch(loadFeaturedProducts()),
        ]);

        setLoadingProgress(80);

        console.log("✅ Todos los datos cargados exitosamente");

        // Timing mínimo mejorado
        const elapsedTime = Date.now() - loadingStartTime.current;
        const minLoadingTime = 1500; // Un poco más para mejor UX

        if (elapsedTime < minLoadingTime) {
          const remainingTime = minLoadingTime - elapsedTime;
          await new Promise((resolve) => setTimeout(resolve, remainingTime));
        }

        setLoadingProgress(100);

        // Pequeño delay para mostrar el 100%
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      } catch (error) {
        console.error("❌ Error cargando datos iniciales:", error);

        // Manejo de error más elegante
        setTimeout(() => {
          setIsLoading(false);
        }, 1200);
      }
    };

    loadInitialData();
  }, [dispatch]);

  // ✅ VERIFICAR AUTENTICACIÓN MEJORADO
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          await dispatch(StartChecking());
        } catch (error) {
          console.error("Error verificando autenticación:", error);
          dispatch(checkingFinish());
        }
      } else {
        dispatch(checkingFinish());
      }
    };

    if (!isLoading) {
      verifyAuth();
    }
  }, [dispatch, isLoading]); // Dependencia de isLoading

  // ✅ REDIRIGIR SI ESTÁ AUTENTICADO
  useEffect(() => {
    if (auth.isLoggedIn && !auth.checking) {
      console.log("🔄 Usuario autenticado, redirigiendo a admin...");
      setCurrentView("admin");
      setShowLoginForm(false);
    }
  }, [auth.isLoggedIn, auth.checking]);

  // ✅ MANEJAR LOGIN
  const handleLogin = async (username, password) => {
    try {
      await dispatch(StartLogin(username, password));
    } catch (error) {
      console.error("Error en login:", error);
      // El error ya se maneja en la action
    }
  };

  // ✅ MANEJAR LOGOUT
  const handleLogout = () => {
    setCurrentView("client");
    // Limpiar estado local si es necesario
  };

  // ✅ MANEJAR CAMBIO DE VISTA
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // ✅ MOSTRAR LOADING PRINCIPAL
  if (isLoading) {
    return <SpiralLoading />;
  }

  // ✅ MOSTRAR LOADING DE VERIFICACIÓN DE SESIÓN (solo si no estamos en loading principal)
  if (auth.checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verificando sesión...</p>
          <p className="text-sm text-gray-500 mt-2">
            {appConfig?.app_name || "Minimarket App"}
          </p>
        </div>
      </div>
    );
  }

  // ✅ RENDERIZAR INTERFAZ PRINCIPAL
  return (
    <div className="font-sans antialiased">
      {currentView === "client" ? (
        <ClientInterface
          currentView={currentView}
          onViewChange={handleViewChange}
          onShowLoginForm={() => setShowLoginForm(true)}
        />
      ) : (
        <AdminInterface
          onLogout={handleLogout}
          onSwitchToClient={() => setCurrentView("client")}
        />
      )}

      {/* Modal de Login */}
      {showLoginForm && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setShowLoginForm(false)}
          isLoading={auth.loading}
        />
      )}

      {/* Estado de carga global (opcional) */}
      {auth.loading && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Procesando...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
