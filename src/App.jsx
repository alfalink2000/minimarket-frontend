// App.js - VERSIÓN CON VERIFICACIÓN EN SEGUNDO PLANO
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
import { loadAppConfig } from "./actions/appConfigActions";
import SpiralLoading from "./components/common/SpiralLoading/SpiralLoading";

const App = () => {
  const [currentView, setCurrentView] = useState("client");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState("Iniciando aplicación...");
  const [loadingError, setLoadingError] = useState(null);
  const [authVerified, setAuthVerified] = useState(false); // ✅ NUEVO: Controla si la auth ya se verificó

  const dispatch = useDispatch();

  // ✅ SELECTORES PARA VERIFICAR ESTADO DE CARGA
  const auth = useSelector((state) => state.auth);
  const appConfig = useSelector((state) => state.appConfig.config);
  const products = useSelector((state) => state.products.products);
  const categories = useSelector((state) => state.categories.categories);
  const authLoading = useSelector((state) => state.auth.loading);

  // ✅ VERIFICAR SI TODOS LOS DATOS ESENCIALES ESTÁN CARGADOS
  const areEssentialDataLoaded = () => {
    const hasAppConfig = appConfig && appConfig.app_name;
    const hasProducts = products.length > 0;
    const hasCategories = categories.length > 0;
    const hasAuthVerified = authVerified; // ✅ Usar nuestro estado local

    console.log("📊 Estado de carga:", {
      appConfig: hasAppConfig,
      products: hasProducts ? `${products.length} productos` : "sin productos",
      categories: hasCategories
        ? `${categories.length} categorías`
        : "sin categorías",
      authVerified: hasAuthVerified,
    });

    return hasAppConfig && hasProducts && hasCategories && hasAuthVerified;
  };

  // ✅ PING PARA MANTENER SERVIDOR ACTIVO
  useEffect(() => {
    const keepAlive = () => {
      fetch("https://minimarket-backend-6z9m.onrender.com/api/health")
        .then(() => console.log("✅ Ping enviado"))
        .catch(() => console.log("❌ Error en ping"));
    };

    const interval = setInterval(keepAlive, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ VERIFICAR AUTENTICACIÓN EN SEGUNDO PLANO
  const verifyAuthentication = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        console.log("🔐 Verificando token...");
        setLoadingStatus("Verificando sesión...");
        await dispatch(StartChecking());
        console.log("✅ Verificación de auth completada - Usuario autenticado");
      } else {
        console.log("🔐 No hay token, continuando como invitado");
        dispatch(checkingFinish());
      }
    } catch (error) {
      console.error("❌ Error verificando autenticación:", error);
      dispatch(checkingFinish());
    } finally {
      // ✅ MARCAR QUE LA VERIFICACIÓN TERMINÓ (ÉXITO O FALLO)
      setAuthVerified(true);
      console.log("✅ Proceso de verificación de auth finalizado");
    }
  };

  // ✅ CARGAR DATOS INICIALES CON VERIFICACIÓN DE AUTH
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log("🚀 Iniciando carga de datos esenciales...");

        // ✅ INICIAR VERIFICACIÓN DE AUTH EN SEGUNDO PLANO
        verifyAuthentication();

        // ✅ CARGAR CONFIGURACIÓN
        setLoadingStatus("Cargando configuración...");
        await dispatch(loadAppConfig());
        console.log("✅ Configuración cargada");

        // ✅ CARGAR PRODUCTOS Y CATEGORÍAS EN PARALELO
        setLoadingStatus("Cargando productos...");
        const productsPromise = dispatch(getProducts());

        setLoadingStatus("Cargando categorías...");
        const categoriesPromise = dispatch(getCategories());

        // Esperar a que ambos terminen
        await Promise.all([productsPromise, categoriesPromise]);
        console.log("✅ Productos y categorías cargados");

        // ✅ CARGAR PRODUCTOS DESTACADOS (OPCIONAL)
        try {
          setLoadingStatus("Cargando productos destacados...");
          await dispatch(loadFeaturedProducts());
          console.log("✅ Productos destacados cargados");
        } catch (featuredError) {
          console.warn("⚠️ Productos destacados no cargados:", featuredError);
        }

        console.log("✅ Todos los datos cargados exitosamente");
      } catch (error) {
        console.error("❌ Error cargando datos iniciales:", error);
        setLoadingError(`Error: ${error.message}`);

        // ✅ REINTENTAR DESPUÉS DE 5 SEGUNDOS
        setTimeout(() => {
          if (!areEssentialDataLoaded()) {
            setLoadingStatus("Reintentando carga...");
            window.location.reload();
          }
        }, 5000);
      }
    };

    loadInitialData();
  }, [dispatch]);

  // ✅ EFECTO PARA QUITAR LOADING CUANDO TODO ESTÉ LISTO
  useEffect(() => {
    if (areEssentialDataLoaded()) {
      console.log(
        "🎯 Todos los datos esenciales cargados, quitando loading..."
      );

      const timer = setTimeout(() => {
        setIsLoading(false);
        setLoadingStatus("¡Listo!");
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [appConfig, products, categories, authVerified]); // ✅ INCLUIR authVerified

  // ✅ REDIRIGIR SI ESTÁ AUTENTICADO (DESPUÉS DE QUITAR LOADING)
  useEffect(() => {
    if (!isLoading && auth.isLoggedIn && !auth.checking) {
      console.log("🔄 Usuario autenticado, redirigiendo a admin...");
      setCurrentView("admin");
      setShowLoginForm(false);
    }
  }, [auth.isLoggedIn, auth.checking, isLoading]);

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

  // ✅ MANEJAR CAMBIO DE VISTA
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // ✅ MOSTRAR LOADING PRINCIPAL HASTA QUE TODOS LOS DATOS ESTÉN LISTOS
  if (isLoading) {
    return (
      <div className="relative">
        <SpiralLoading />

        {/* Status de carga - AHORA INCLUYE LA VERIFICACIÓN DE AUTH */}
        <div className="fixed bottom-10 left-0 right-0 text-center z-50">
          <div className="bg-black bg-opacity-70 text-white inline-block px-6 py-3 rounded-full shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="font-medium">{loadingStatus}</span>
            </div>
          </div>
        </div>

        {/* Error overlay */}
        {loadingError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg text-center max-w-sm mx-4">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Error de Carga
              </h3>
              <p className="text-gray-600 mb-4">{loadingError}</p>
              <p className="text-sm text-gray-500">
                Reintentando automáticamente...
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ✅ ELIMINADO: Ya no mostramos el loading de verificación de sesión por separado
  // El código que tenías aquí ha sido movido al loading principal

  // ✅ RENDERIZAR INTERFAZ PRINCIPAL (SOLO CUANDO TODOS LOS DATOS ESTÉN LISTOS)
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

      {/* Estado de carga global (opcional) */}
      {authLoading && (
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
