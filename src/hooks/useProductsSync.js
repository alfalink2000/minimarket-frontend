// hooks/useProductsSync.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getProducts } from "../actions/productsActions";

export const useProductsSync = (interval = 30000) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // ✅ Siempre forzar refresh inicial
    dispatch(getProducts(true));

    // Configurar polling - siempre forzar refresh
    const pollInterval = setInterval(() => {
      dispatch(getProducts(true));
    }, interval);

    return () => clearInterval(pollInterval);
  }, [dispatch, interval]);
};
