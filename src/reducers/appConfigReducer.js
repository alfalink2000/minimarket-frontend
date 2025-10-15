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
      "Bienvenido a nuestro minimarket. Ofrecemos productos de calidad con el mejor servicio. ¡Estamos aquí para ayudarte!", // ✅ NUEVO CAMPO
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
