// utils/themeManager.js
export const themes = {
  blue: {
    "--primary-blue": "#2563eb",
    "--primary-blue-dark": "#1d4ed8",
    "--primary-blue-light": "#dbeafe",
    "--accent-teal": "#0d9488",
    "--accent-teal-light": "#ccfbf1",
    "--success": "#059669",
    "--primary-green": "#059669",
    "--primary-green-dark": "#047857",
    "--primary-green-light": "#d1fae5",
  },
  green: {
    "--primary-blue": "#059669",
    "--primary-blue-dark": "#047857",
    "--primary-blue-light": "#d1fae5",
    "--accent-teal": "#0d9488",
    "--accent-teal-light": "#ccfbf1",
    "--success": "#059669",
    "--primary-green": "#059669",
    "--primary-green-dark": "#047857",
    "--primary-green-light": "#d1fae5",
  },
  purple: {
    "--primary-blue": "#7c3aed",
    "--primary-blue-dark": "#6d28d9",
    "--primary-blue-light": "#ede9fe",
    "--accent-teal": "#a855f7",
    "--accent-teal-light": "#f3e8ff",
    "--success": "#10b981",
    "--primary-green": "#10b981",
    "--primary-green-dark": "#059669",
    "--primary-green-light": "#d1fae5",
  },
  orange: {
    "--primary-blue": "#ea580c",
    "--primary-blue-dark": "#c2410c",
    "--primary-blue-light": "#ffedd5",
    "--accent-teal": "#dc2626",
    "--accent-teal-light": "#fef2f2",
    "--success": "#ea580c",
    "--primary-green": "#ea580c",
    "--primary-green-dark": "#c2410c",
    "--primary-green-light": "#ffedd5",
  },
  rose: {
    "--primary-blue": "#db2777",
    "--primary-blue-dark": "#be185d",
    "--primary-blue-light": "#fce7f3",
    "--accent-teal": "#ec4899",
    "--accent-teal-light": "#fdf2f8",
    "--success": "#db2777",
    "--primary-green": "#db2777",
    "--primary-green-dark": "#be185d",
    "--primary-green-light": "#fce7f3",
  },
};

export const applyTheme = (themeName) => {
  const theme = themes[themeName] || themes.blue;
  const root = document.documentElement;

  // Aplicar todas las variables del tema
  Object.entries(theme).forEach(([variable, value]) => {
    root.style.setProperty(variable, value);
  });

  console.log(`🎨 Tema aplicado: ${themeName}`);
};

export const getThemePreview = (themeName) => {
  return themes[themeName] || themes.blue;
};
