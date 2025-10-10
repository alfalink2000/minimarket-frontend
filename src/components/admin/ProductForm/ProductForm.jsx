// components/ProductForm/ProductForm.jsx
import { useState, useEffect } from "react";
import "./ProductForm.css";

const ProductForm = ({ product, categories, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    status: "available",
    stock_quantity: 1, // Cambiado de 0 a 1 por defecto
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price ? product.price.toString() : "",
        category_id: product.category_id ? product.category_id.toString() : "",
        status: product.status || "available",
        stock_quantity: product.stock_quantity || 0,
      });
      if (product.image_url) {
        setImagePreview(product.image_url);
      }
    }
  }, [product]);

  // ✅ NUEVO: Sincronizar status con stock_quantity
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };

      // ✅ SINCRONIZACIÓN AUTOMÁTICA: Si status cambia a "outOfStock", poner stock a 0
      if (name === "status" && value === "outOfStock") {
        newFormData.stock_quantity = 0;
      }
      // ✅ Si status cambia a "available" y stock es 0, poner stock a 1
      else if (
        name === "status" &&
        value === "available" &&
        prev.stock_quantity === 0
      ) {
        newFormData.stock_quantity = 1;
      }
      // ✅ Si stock_quantity cambia a 0, poner status a "outOfStock"
      else if (name === "stock_quantity" && parseInt(value) === 0) {
        newFormData.status = "outOfStock";
      }
      // ✅ Si stock_quantity cambia a >0 y status es "outOfStock", poner status a "available"
      else if (
        name === "stock_quantity" &&
        parseInt(value) > 0 &&
        prev.status === "outOfStock"
      ) {
        newFormData.status = "available";
      }

      return newFormData;
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona un archivo de imagen válido");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen debe ser menor a 5MB");
        return;
      }

      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ DEBUG: Ver datos antes de enviar
    console.log("📤 Enviando datos del formulario:", formData);

    const submitFormData = new FormData();

    Object.keys(formData).forEach((key) => {
      submitFormData.append(key, formData[key]);
    });

    if (imageFile) {
      submitFormData.append("image", imageFile);
    }

    if (product) {
      submitFormData.append("id", product.id);
    }

    onSubmit(submitFormData);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    const fileInput = document.querySelector(".product-form__file-input");
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="product-form-overlay">
      <div className="product-form">
        <div className="product-form__header">
          <h2 className="product-form__title">
            {product ? "Editar Producto" : "Agregar Producto"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="product-form__content">
          <div className="product-form__group">
            <label className="product-form__label">Nombre *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="product-form__input"
              required
              placeholder="Nombre del producto"
            />
          </div>

          <div className="product-form__group">
            <label className="product-form__label">Descripción *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="product-form__textarea"
              required
              placeholder="Descripción del producto"
            />
          </div>

          <div className="product-form__group">
            <label className="product-form__label">Precio ($) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="product-form__input"
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className="product-form__group">
            <label className="product-form__label">Categoría *</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              className="product-form__select"
              required
            >
              <option value="">Seleccionar categoría</option>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="product-form__group">
            <label className="product-form__label">Stock *</label>
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleInputChange}
              className="product-form__input"
              min="0"
              required
              placeholder="0"
            />
            <small className="product-form__help">
              ✅ Stock se sincroniza automáticamente con el estado
            </small>
          </div>

          {/* Campo para subir imagen */}
          <div className="product-form__group">
            <label className="product-form__label">Imagen del Producto</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="product-form__file-input"
            />
            <small className="product-form__help">
              Formatos: JPG, PNG, GIF. Máximo 5MB.
            </small>

            {imagePreview && (
              <div className="product-form__image-preview">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="product-form__preview-image"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="product-form__remove-image"
                >
                  × Eliminar
                </button>
              </div>
            )}
          </div>

          <div className="product-form__group">
            <label className="product-form__label">Estado</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="product-form__select"
            >
              <option value="available">Disponible</option>
              <option value="outOfStock">Agotado</option>
            </select>
            <small className="product-form__help">
              ✅ Estado se sincroniza automáticamente con el stock
            </small>
          </div>

          {/* ✅ DEBUG: Mostrar estado actual */}
          <div
            className="product-form__debug"
            style={{
              padding: "10px",
              background: "#f5f5f5",
              borderRadius: "4px",
              fontSize: "12px",
              marginBottom: "15px",
            }}
          >
            <strong>Estado actual:</strong>
            <br />
            Status:{" "}
            <span
              style={{
                color: formData.status === "available" ? "green" : "red",
              }}
            >
              {formData.status}
            </span>
            <br />
            Stock:{" "}
            <span
              style={{ color: formData.stock_quantity > 0 ? "green" : "red" }}
            >
              {formData.stock_quantity}
            </span>
          </div>

          <div className="product-form__actions">
            <button type="submit" className="product-form__submit">
              {product ? "Guardar Cambios" : "Agregar Producto"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="product-form__cancel"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
