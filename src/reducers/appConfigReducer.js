// reducers/appConfigReducer.js
import { types } from "../types/types";

const initialState = {
  config: {
    app_name: "Minimarket Digital",
    app_description: "Tu tienda de confianza",
    theme: "blue",
    whatsapp_number: "+5491112345678",
    business_hours: "Lun-Vie: 8:00 - 20:00",
    business_address: "Av. Principal 123",
    initialinfo:
      "🌟 **Bienvenido a nuestro Minimarket Digital** 🌟\n\n¡Estamos encantados de tenerte aquí! En nuestro minimarket encontrarás productos de calidad, horario extendido y servicio personalizado.",
    show_initialinfo: true, // ✅ NUEVO CAMPO
    logo_url: null,
  },
  loading: false,
};

export const appConfigReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.appConfigLoad:
      return {
        ...state,
        config: { ...action.payload },
      };

    case types.appConfigUpdate:
      return {
        ...state,
        config: { ...action.payload },
      };

    default:
      return state;
  }
};
