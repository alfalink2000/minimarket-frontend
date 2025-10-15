import { HiOutlineInformationCircle } from "react-icons/hi";
import "./Header.css";

const Header = ({ title, children, onInfoClick, showInfoButton = false }) => (
  <header className="header">
    <div className="header__container">
      <div className="header__left">{title}</div>
      <div className="header__center">
        {/* Elementos centrales innovadores */}
        <div className="header__status">
          <span className="status-indicator"></span>
          <span className="status-text">En línea • Listo para atenderte</span>
        </div>
      </div>
      <div className="header__right">
        {/* Botón de información para móvil */}
        {showInfoButton && onInfoClick && (
          <button
            className="header__info-btn mobile-only"
            onClick={onInfoClick}
            title="Información de la tienda"
          >
            <HiOutlineInformationCircle className="header__info-icon" />
          </button>
        )}

        {children && <div className="header__actions">{children}</div>}
      </div>
    </div>
  </header>
);

export default Header;
