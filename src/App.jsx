// App.js - VERSIÓN QUE SÍ ACTIVA MODO MANTENIMIENTO
import { useState, useEffect } from "react";
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
import { loadAppConfig, loadDefaultConfig } from "./actions/appConfigActions";
import SpiralLoading from "./components/common/SpiralLoading/SpiralLoading";
import MaintenanceMode from "./components/common/MaintenanceMode/MaintenanceMode";

const App = () => {
  const [currentView, setCurrentView] = useState("client");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState("Iniciando aplicación...");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionFailed, setConnectionFailed] = useState(false); // ✅ NUEVO: Para forzar modo mantenimiento

  const dispatch = useDispatch();

  // ✅ SELECTORES
  const auth = useSelector((state) => state.auth);
  const appConfig = useSelector((state) => state.appConfig.config);
  const products = useSelector((state) => state.products.products);
  const categories = useSelector((state) => state.categories.categories);
  const authLoading = useSelector((state) => state.auth.loading);

  // ✅ VERIFICAR SI TODOS LOS DATOS ESENCIALES ESTÁN CARGADOS
  const areEssentialDataLoaded = () => {
    if (maintenanceMode || connectionFailed) return false;

    const hasAppConfig = appConfig && appConfig.app_name;
    const hasProducts = products.length > 0;
    const hasCategories = categories.length > 0;

    return hasAppConfig && hasProducts && hasCategories;
  };

  // ✅ VERIFICAR AUTENTICACIÓN EN SEGUNDO PLANO
  const verifyAuthentication = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await dispatch(StartChecking());
      } else {
        dispatch(checkingFinish());
      }
    } catch (error) {
      console.error("❌ Error verificando autenticación:", error);
      dispatch(checkingFinish());
    }
  };

  // ✅ REINTENTAR CONEXIÓN DESDE MODO MANTENIMIENTO
  const handleRetryConnection = () => {
    console.log("🔄 Reintentando conexión desde modo mantenimiento...");
    setMaintenanceMode(false);
    setConnectionFailed(false);
    setRetryCount(0);
    setIsLoading(true);
    loadInitialData();
  };

  // ✅ CARGAR DATOS INICIALES CON LÓGICA SIMPLIFICADA
  const loadInitialData = async () => {
    try {
      console.log(
        `🚀 Iniciando carga de datos (Intento ${retryCount + 1}/2)...`
      );
      setLoadingStatus("Conectando con el servidor...");

      // ✅ VERIFICAR AUTENTICACIÓN EN PARALELO
      verifyAuthentication();

      // ✅ INTENTAR CARGAR DESDE EL SERVIDOR PRIMERO
      setLoadingStatus("Cargando configuración...");
      await dispatch(loadAppConfig());

      setLoadingStatus("Cargando productos...");
      await dispatch(getProducts());

      setLoadingStatus("Cargando categorías...");
      await dispatch(getCategories());

      // ✅ CARGAR PRODUCTOS DESTACADOS (OPCIONAL)
      try {
        setLoadingStatus("Cargando productos destacados...");
        await dispatch(loadFeaturedProducts());
      } catch (featuredError) {
        console.warn("⚠️ Productos destacados no cargados:", featuredError);
      }

      console.log("✅ Todos los datos cargados exitosamente desde el servidor");
      setRetryCount(0);
      setConnectionFailed(false);
    } catch (error) {
      console.error("❌ Error cargando datos del servidor:", error);

      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);

      // ✅ SI ES EL SEGUNDO INTENTO FALLIDO, USAR DATOS LOCALES
      if (newRetryCount >= 2) {
        console.log("🚨 Segundo intento fallido, usando datos locales...");
        setConnectionFailed(true);

        try {
          setLoadingStatus("Cargando datos locales...");

          // ✅ CARGAR CONFIGURACIÓN LOCAL
          await dispatch(loadDefaultConfig());

          // ✅ PARA PRODUCTOS Y CATEGORÍAS, DEJAR LOS ARRAYS VACÍOS
          // (asumiendo que Redux ya los inicializa como arrays vacíos)

          console.log("✅ Datos locales cargados");

          // ✅ ESPERAR UN POCO Y QUITAR LOADING
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        } catch (fallbackError) {
          console.error("❌ Error incluso con datos locales:", fallbackError);

          // ✅ SI FALLAN LOS DATOS LOCALES TAMBIÉN, ACTIVAR MODO MANTENIMIENTO
          setTimeout(() => {
            setMaintenanceMode(true);
            setIsLoading(false);
          }, 1000);
        }
        return;
      }

      // ✅ REINTENTAR AUTOMÁTICAMENTE
      console.log(`🔄 Reintentando en 2 segundos... (${newRetryCount}/2)`);
      setLoadingStatus(`Reintentando conexión... (${newRetryCount}/2)`);

      setTimeout(() => {
        if (!maintenanceMode && !connectionFailed) {
          loadInitialData();
        }
      }, 2000);
    }
  };

  // ✅ EFECTO PRINCIPAL PARA CARGAR DATOS
  useEffect(() => {
    loadInitialData();
  }, []);

  // ✅ EFECTO PARA QUITAR LOADING CUANDO TODO ESTÉ LISTO
  useEffect(() => {
    if (areEssentialDataLoaded() && !maintenanceMode) {
      console.log(
        "🎯 Todos los datos esenciales cargados, quitando loading..."
      );

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [appConfig, products, categories, maintenanceMode, connectionFailed]);

  // ✅ EFECTO PARA ACTIVAR MODO MANTENIMIENTO SI NO HAY CONEXIÓN DESPUÉS DE UN TIEMPO
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        isLoading &&
        retryCount >= 1 &&
        !maintenanceMode &&
        !connectionFailed
      ) {
        console.log(
          "⏰ Timeout: No hay conexión, activando modo mantenimiento"
        );
        setMaintenanceMode(true);
        setIsLoading(false);
      }
    }, 10000); // 10 segundos de timeout

    return () => clearTimeout(timeout);
  }, [isLoading, maintenanceMode, retryCount, connectionFailed]);

  // ✅ REDIRIGIR SI ESTÁ AUTENTICADO
  useEffect(() => {
    if (!isLoading && auth.isLoggedIn && !auth.checking && !maintenanceMode) {
      console.log("🔄 Usuario autenticado, redirigiendo a admin...");
      setCurrentView("admin");
      setShowLoginForm(false);
    }
  }, [auth.isLoggedIn, auth.checking, isLoading, maintenanceMode]);

  // ✅ MANEJAR LOGIN
  const handleLogin = async (username, password) => {
    try {
      await dispatch(StartLogin(username, password));
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  // ✅ MANEJAR LOGOUT
  const handleLogout = () => {
    setCurrentView("client");
  };

  // ✅ RENDERIZAR MODO MANTENIMIENTO
  if (maintenanceMode) {
    return <MaintenanceMode onRetry={handleRetryConnection} />;
  }

  // ✅ RENDERIZAR LOADING PRINCIPAL
  if (isLoading) {
    return (
      <div className="relative">
        <SpiralLoading />

        {/* Status de carga */}
        <div className="fixed bottom-10 left-0 right-0 text-center z-50">
          <div className="bg-black bg-opacity-70 text-white inline-block px-6 py-3 rounded-full shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="font-medium">{loadingStatus}</span>
              {retryCount > 0 && !connectionFailed && (
                <span className="text-yellow-300 text-sm">
                  (Intento {retryCount}/2)
                </span>
              )}
              {connectionFailed && (
                <span className="text-orange-300 text-sm">• Modo local</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  // ✅ AGREGAR ESTA FUNCIÓN FALTANTE
  const handleViewChange = (view) => {
    setCurrentView(view);
  };
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
          isLoading={authLoading}
        />
      )}

      {/* Estado de carga global */}
      {authLoading && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Procesando...</span>
          </div>
        </div>
      )}

      {/* ✅ OVERLAY DE MODO LOCAL */}
      {connectionFailed && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm">
              Modo local - Sin conexión al servidor
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
