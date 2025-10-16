// components/common/CartModal/CartModal.jsx
import React from "react";
import {
  FiX,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiPhone,
  FiShoppingCart,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  selectIsCartOpen,
} from "../../../selectors/cartSelectors";
import {
  updateCartQuantity,
  removeFromCart,
  toggleCartModal,
  clearCart,
} from "../../../actions/cartActions";
import "./CartModal.css";

const CartModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsCartOpen);
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const appConfig = useSelector((state) => state.appConfig.config);

  console.log("🛒 CartModal - isOpen:", isOpen);

  const handleClose = () => {
    dispatch(toggleCartModal());
  };

  const handleQuantityChange = (productId, change) => {
    const item = cartItems.find((item) => item.id === productId);
    const newQuantity = Math.max(0, (item?.quantity || 0) + change);

    if (newQuantity === 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateCartQuantity(productId, newQuantity));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleWhatsAppOrder = () => {
    const phoneNumber = appConfig?.whatsapp_number || "5491112345678";
    const itemsText = cartItems
      .map(
        (item) =>
          `• ${item.name} x${item.quantity} - $${(
            parseFloat(item.price) * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    const message = `¡Hola! Me gustaría hacer el siguiente pedido:\n\n${itemsText}\n\nTotal: $${total.toFixed(
      2
    )}\n\n¿Podrían ayudarme con este pedido?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  // ✅ USAR ESTA VERSIÓN - con la clase condicional
  return (
    <div className={`cart-modal ${isOpen ? "cart-modal--open" : ""}`}>
      <div className="cart-modal__overlay" onClick={handleClose} />

      <div className="cart-modal__content">
        {/* Header */}
        <div className="cart-modal__header">
          <div className="cart-modal__title">
            <FiShoppingCart className="cart-modal__icon" />
            <h2>Mi Carrito</h2>
            {cartItems.length > 0 && (
              <span className="cart-modal__count">({cartItems.length})</span>
            )}
          </div>
          <button className="cart-modal__close" onClick={handleClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-modal__body">
          {cartItems.length === 0 ? (
            <div className="cart-modal__empty">
              <FiShoppingCart size={48} className="empty-icon" />
              <h3>Tu carrito está vacío</h3>
              <p>Agrega algunos productos para continuar</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="cart-item__image"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/60x60?text=Imagen";
                      }}
                    />

                    <div className="cart-item__info">
                      <h4 className="cart-item__name">{item.name}</h4>
                      <p className="cart-item__price">
                        ${parseFloat(item.price).toFixed(2)} c/u
                      </p>
                    </div>

                    <div className="cart-item__controls">
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>

                      <div className="cart-item__total">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Eliminar producto"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-modal__footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">${total.toFixed(2)}</span>
                </div>

                <div className="cart-actions">
                  <button className="clear-cart-btn" onClick={handleClearCart}>
                    Vaciar Carrito
                  </button>
                  <button
                    className="whatsapp-order-btn"
                    onClick={handleWhatsAppOrder}
                  >
                    <FiPhone className="whatsapp-icon" />
                    Pedir por WhatsApp
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
