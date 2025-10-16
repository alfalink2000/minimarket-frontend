// components/common/Header/Header.jsx - VERSIÓN CON DEBUG
import { HiOutlineInformationCircle } from "react-icons/hi";
import { FiShoppingCart } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItemsCount,
  selectIsCartOpen,
} from "../../../selectors/cartSelectors";
import { toggleCartModal } from "../../../actions/cartActions";
import "./Header.css";

const Header = ({ title, children, onInfoClick, showInfoButton = false }) => {
  const dispatch = useDispatch();
  const cartItemsCount = useSelector(selectCartItemsCount);
  const isCartOpen = useSelector(selectIsCartOpen);

  console.log("🛒 Header - cartItemsCount:", cartItemsCount);
  console.log("🛒 Header - isCartOpen:", isCartOpen);

  const handleCartClick = () => {
    console.log("🛒 Botón del carrito CLICKEADO");
    dispatch(toggleCartModal());
    console.log("🛒 Acción toggleCartModal dispatchada");
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">{title}</div>

        <div className="header__center">
          <div className="header__status">
            <span className="status-indicator"></span>
            <span className="status-text">En línea • Listo para atenderte</span>
          </div>
        </div>

        <div className="header__right">
          {/* Icono del carrito */}
          <button
            className="header__cart-btn header-action header-action--icon"
            onClick={handleCartClick}
            title="Ver carrito"
          >
            <FiShoppingCart className="header__cart-icon header-action__icon" />
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </button>

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
};

export default Header;
