// App.js - VERSIÓN QUE MANTIENE LOADING HASTA MANTENIMIENTO
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
  const [dataLoaded, setDataLoaded] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const authLoading = useSelector((state) => state.auth.loading);
  const appConfig = useSelector((state) => state.appConfig.config);
  const products = useSelector((state) => state.products.products);
  const categories = useSelector((state) => state.categories.categories);

  // ✅ VERIFICAR SI LOS DATOS ESENCIALES ESTÁN CARGADOS
  const areEssentialDataLoaded = () => {
    const hasAppConfig = appConfig && appConfig.app_name;
    const productsLoaded = Array.isArray(products);
    const categoriesLoaded = Array.isArray(categories);

    return hasAppConfig && productsLoaded && categoriesLoaded;
  };

  // ✅ CARGAR DATOS INICIALES
  const loadInitialData = async () => {
    try {
      console.log("🚀 Cargando datos iniciales...");
      setLoadingStatus("Conectando con el servidor...");

      // ✅ CARGAR CONFIGURACIÓN PRIMERO
      try {
        setLoadingStatus("Cargando configuración...");
        await dispatch(loadAppConfig());
        console.log("✅ Configuración cargada");
      } catch (configError) {
        console.error("❌ Error cargando configuración:", configError);
        setHasErrors(true);
        // ✅ INTENTAR CONFIGURACIÓN LOCAL
        await dispatch(loadDefaultConfig());
      }

      // ✅ CARGAR DATOS ADICIONALES
      setLoadingStatus("Cargando productos...");
      await dispatch(getProducts());

      setLoadingStatus("Cargando categorías...");
      await dispatch(getCategories());

      // ✅ CARGAR PRODUCTOS DESTACADOS (OPCIONAL)
      try {
        setLoadingStatus("Cargando datos adicionales...");
        await dispatch(loadFeaturedProducts());
      } catch (featuredError) {
        console.warn("⚠️ Productos destacados no cargados:", featuredError);
      }

      // ✅ VERIFICAR AUTENTICACIÓN
      const token = localStorage.getItem("token");
      if (token) {
        dispatch(StartChecking());
      } else {
        dispatch(checkingFinish());
      }

      console.log("✅ Todos los datos cargados exitosamente");
      setDataLoaded(true);
    } catch (error) {
      console.error("❌ Error crítico cargando datos:", error);
      setHasErrors(true);
    }
  };

  // ✅ EFECTO PRINCIPAL - CARGAR DATOS AL INICIAR
  useEffect(() => {
    loadInitialData();
  }, []);

  // ✅ EFECTO PARA MANEJAR LOS ESTADOS DE CARGA
  useEffect(() => {
    // ✅ CASO 1: DATOS CARGADOS EXITOSAMENTE - QUITAR LOADING INMEDIATO
    if (dataLoaded && areEssentialDataLoaded()) {
      console.log("🎯 Datos cargados exitosamente, quitando loading...");
      setIsLoading(false);
      return;
    }

    // ✅ CASO 2: HAY ERRORES PERO ALGUNOS DATOS CARGARON - ESPERAR A MANTENIMIENTO
    if (hasErrors && !areEssentialDataLoaded()) {
      console.log("⚠️ Hay errores, esperando a modo mantenimiento...");
      // NO quitamos el loading - seguimos mostrando SpiralLoading
      return;
    }

    // ✅ CASO 3: SIN ERRORES PERO DATOS INCOMPLETOS - ESPERAR TIMEOUT
    if (!hasErrors && !areEssentialDataLoaded()) {
      console.log("⏳ Datos incompletos, esperando...");
      // NO quitamos el loading - seguimos mostrando SpiralLoading
      return;
    }
  }, [dataLoaded, hasErrors, appConfig, products, categories]);

  // ✅ TIMEOUT PARA MODO MANTENIMIENTO (8 SEGUNDOS)
  useEffect(() => {
    const maintenanceTimeout = setTimeout(() => {
      if (isLoading) {
        console.log("🚨 Timeout de 8 segundos: Activando modo mantenimiento");
        setMaintenanceMode(true);
        setIsLoading(false);
      }
    }, 8000);

    return () => clearTimeout(maintenanceTimeout);
  }, [isLoading]);

  // ✅ REINTENTAR CONEXIÓN DESDE MODO MANTENIMIENTO
  const handleRetryConnection = () => {
    console.log("🔄 Reintentando conexión desde modo mantenimiento...");
    setMaintenanceMode(false);
    setHasErrors(false);
    setDataLoaded(false);
    setIsLoading(true);
    loadInitialData();
  };

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

  // ✅ FUNCIÓN PARA CAMBIAR VISTA
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // ✅ DEBUG: Estado actual
  console.log("🔍 Estado App:", {
    isLoading,
    maintenanceMode,
    hasErrors,
    dataLoaded,
    hasConfig: !!(appConfig && appConfig.app_name),
    productsLoaded: Array.isArray(products),
    categoriesLoaded: Array.isArray(categories),
    essentialDataLoaded: areEssentialDataLoaded(),
  });

  // ✅ RENDERIZAR MODO MANTENIMIENTO
  if (maintenanceMode) {
    return (
      <MaintenanceMode
        onRetry={handleRetryConnection}
        message="No se pudieron cargar los datos esenciales. Esto puede deberse a problemas de conexión o mantenimiento del servicio."
      />
    );
  }

  // ✅ RENDERIZAR LOADING PRINCIPAL (SIEMPRE HASTA QUE TODO ESTÉ LISTO O MANTENIMIENTO)
  if (isLoading) {
    return (
      <div className="relative">
        <SpiralLoading />
        <div className="fixed bottom-10 left-0 right-0 text-center z-50">
          <div className="bg-black bg-opacity-70 text-white inline-block px-6 py-3 rounded-full shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="font-medium">{loadingStatus}</span>
              {hasErrors && (
                <span className="text-orange-300 text-sm">
                  • Reconectando... (
                  {Math.round(
                    (Date.now() - window.performance.timing.navigationStart) /
                      1000
                  )}
                  s)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ RENDERIZAR INTERFAZ PRINCIPAL (SOLO SI LOS DATOS ESTÁN COMPLETOS)
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

      {/* ✅ OVERLAY DE MODO LOCAL (SOLO SI HAY ERRORES PERO LA APP CARGÓ) */}
      {hasErrors && !isLoading && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm">
              Modo local - Algunos datos pueden estar desactualizados
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
