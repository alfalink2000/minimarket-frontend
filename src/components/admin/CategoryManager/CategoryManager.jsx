// components/admin/CategoryManager/CategoryManager.jsx - VERSIÓN MEJORADA
import { useState, useMemo } from "react";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import SearchFilter from "../SearchFilter/SearchFilter";
import "./CategoryManager.css";

const CategoryManager = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ CORREGIDO: Convertir array de objetos a array de strings para el render
  const categoryNames = useMemo(() => {
    return categories.map((cat) => cat.name);
  }, [categories]);

  // ✅ CORREGIDO: Filtrar por nombres de categorías
  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleAddCategory = () => {
    const trimmedName = newCategory.trim();

    if (!trimmedName) {
      return;
    }

    // ✅ VERIFICAR DUPLICADOS
    if (categoryNames.includes(trimmedName)) {
      alert("Ya existe una categoría con ese nombre");
      return;
    }

    // ✅ VERIFICAR LONGITUD
    if (trimmedName.length > 100) {
      alert("El nombre de la categoría no puede tener más de 100 caracteres");
      return;
    }

    onAddCategory(trimmedName);
    setNewCategory("");
  };

  const handleStartEdit = (category) => {
    setEditingCategory(category);
    setEditValue(category.name);
  };

  const handleSaveEdit = () => {
    const trimmedValue = editValue.trim();

    if (!trimmedValue) {
      alert("El nombre de la categoría no puede estar vacío");
      return;
    }

    if (trimmedValue === editingCategory.name) {
      setEditingCategory(null);
      setEditValue("");
      return;
    }

    // ✅ VERIFICAR DUPLICADOS AL EDITAR
    if (
      categoryNames.includes(trimmedValue) &&
      trimmedValue !== editingCategory.name
    ) {
      alert("Ya existe una categoría con ese nombre");
      return;
    }

    onUpdateCategory(editingCategory.name, trimmedValue);
    setEditingCategory(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditValue("");
  };

  const handleDeleteCategory = (category) => {
    // ✅ LA CONFIRMACIÓN Y VALIDACIÓN ESTÁ EN LA ACTION
    onDeleteCategory(category.name);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      if (action === "add") {
        handleAddCategory();
      } else if (action === "edit") {
        handleSaveEdit();
      }
    } else if (e.key === "Escape") {
      if (action === "edit") {
        handleCancelEdit();
      }
    }
  };

  return (
    <div className="category-manager">
      <h3 className="category-manager__title">Gestión de Categorías</h3>

      {/* Filtro de búsqueda */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Buscar categorías..."
      />

      {/* Agregar nueva categoría */}
      <div className="category-manager__add">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nueva categoría (máx. 100 caracteres)"
          className="category-manager__input"
          onKeyPress={(e) => handleKeyPress(e, "add")}
          maxLength={100}
        />
        <button
          onClick={handleAddCategory}
          className="category-manager__add-button"
          disabled={!newCategory.trim()}
        >
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </div>

      {/* Contador de resultados */}
      <div className="category-manager__info">
        <span className="category-manager__count">
          {filteredCategories.length} de {categories.length} categorías
        </span>
        {searchTerm && (
          <span className="category-manager__search-term">
            Buscando: "{searchTerm}"
          </span>
        )}
      </div>

      {/* Lista de categorías */}
      <div className="category-manager__list">
        {filteredCategories
          .filter((cat) => cat.name !== "Todos")
          .map((category) => (
            <div key={category.id} className="category-manager__item">
              {editingCategory?.id === category.id ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, "edit")}
                    className="category-manager__edit-input"
                    autoFocus
                    maxLength={100}
                  />
                  <div className="category-manager__edit-actions">
                    <button
                      onClick={handleSaveEdit}
                      className="category-manager__save-button"
                      disabled={!editValue.trim()}
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="category-manager__cancel-button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="category-manager__name">
                    {category.name}
                  </span>
                  <div className="category-manager__actions">
                    <button
                      onClick={() => handleStartEdit(category)}
                      className="category-manager__edit-button"
                      title="Editar categoría"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="category-manager__delete-button"
                      title="Eliminar categoría"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
      </div>

      {filteredCategories.length === 0 && categories.length > 0 && (
        <div className="category-manager__empty">
          <p>No se encontraron categorías con el término de búsqueda</p>
        </div>
      )}

      {categories.length === 0 && (
        <div className="category-manager__empty">
          <p>No hay categorías disponibles. Agrega una nueva categoría.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
