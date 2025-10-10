import "./Header.css";

const Header = ({ title, children }) => (
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
        {children && <div className="header__actions">{children}</div>}
      </div>
    </div>
  </header>
);

export default Header;
