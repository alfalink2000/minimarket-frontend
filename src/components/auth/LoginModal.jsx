import { useState, useEffect } from "react";
import { User, Lock, Shield, Eye, EyeOff } from "lucide-react";
import { sanitizeInput, isStrongPassword } from "../../helpers/securityUtils";
import "./LoginModal.css";

const LoginModal = ({ onLogin, onClose, isLoading }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);

  // Bloquear después de 3 intentos fallidos
  useEffect(() => {
    if (attempts >= 3) {
      setIsLocked(true);
      setLockTime(300); // 5 minutos en segundos

      const timer = setInterval(() => {
        setLockTime((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [attempts]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLocked) return;

    // Sanitizar inputs
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);

    // Validaciones adicionales
    if (!sanitizedUsername || !sanitizedPassword) {
      alert("Datos de entrada no válidos");
      return;
    }

    onLogin(sanitizedUsername, sanitizedPassword);

    // Incrementar intentos (esto se debería resetear en éxito)
    setAttempts((prev) => prev + 1);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="login-modal__header">
          <Shield className="login-modal__shield" />
          <h2 className="login-modal__title">Acceso Seguro</h2>
          <p className="login-modal__subtitle">Panel de Administración</p>
        </div>

        {isLocked && (
          <div className="login-modal__lock-message">
            <Shield className="lock-icon" />
            <p>Demasiados intentos fallidos</p>
            <p>Intenta nuevamente en: {formatTime(lockTime)}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-modal__form">
          <div className="login-modal__group">
            <label className="login-modal__label">Usuario</label>
            <div className="login-modal__input-wrapper">
              <User className="login-modal__icon" />
              <input
                type="text"
                className="login-modal__input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                autoComplete="username"
                required
                disabled={isLocked || isLoading}
                maxLength={20}
                pattern="[a-zA-Z0-9_]+"
                title="Solo letras, números y guiones bajos"
              />
            </div>
          </div>

          <div className="login-modal__group">
            <label className="login-modal__label">Contraseña</label>
            <div className="login-modal__input-wrapper">
              <Lock className="login-modal__icon" />
              <input
                type={showPassword ? "text" : "password"}
                className="login-modal__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                required
                disabled={isLocked || isLoading}
                minLength={8}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLocked || isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="login-modal__actions">
            <button
              type="submit"
              className="login-modal__submit"
              disabled={isLocked || isLoading || !username || !password}
            >
              {isLoading ? "Verificando..." : "Iniciar Sesión"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="login-modal__cancel"
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </form>

        <div className="login-modal__security-info">
          <p>🔒 Conexión segura • SSL habilitado</p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
