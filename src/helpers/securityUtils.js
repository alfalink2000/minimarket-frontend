import CryptoJS from "crypto-js";
import DOMPurify from "dompurify";

// Encriptar datos sensibles antes de enviar
export const encryptData = (data, secretKey) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

// Desencriptar datos
export const decryptData = (encryptedData, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Sanitizar input para prevenir XSS
export const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No permitir ningún tag HTML
    ALLOWED_ATTR: [], // No permitir ningún atributo
  });
};

// Validar formato de email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar fortaleza de contraseña
export const isStrongPassword = (password) => {
  const strongRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};

// Ocultar datos sensibles en logs
export const safeLog = (
  data,
  sensitiveFields = ["password", "token", "email"]
) => {
  const maskedData = { ...data };
  sensitiveFields.forEach((field) => {
    if (maskedData[field]) {
      maskedData[field] = "***HIDDEN***";
    }
  });
  console.log("🔒 Safe Log:", maskedData);
};
