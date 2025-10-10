// components/admin/CategoryManager/CategoryManager.jsx
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

  // Filtrar categorías
  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      onAddCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  const handleStartEdit = (category) => {
    setEditingCategory(category);
    setEditValue(category);
  };

  const handleSaveEdit = () => {
    if (editValue.trim() && editValue.trim() !== editingCategory) {
      onUpdateCategory(editingCategory, editValue.trim());
    }
    setEditingCategory(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
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
          placeholder="Nueva categoría"
          className="category-manager__input"
          onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
        />
        <button
          onClick={handleAddCategory}
          className="category-manager__add-button"
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
      </div>

      {/* Lista de categorías */}
      <div className="category-manager__list">
        {filteredCategories
          .filter((cat) => cat !== "Todos")
          .map((category) => (
            <div key={category} className="category-manager__item">
              {editingCategory === category ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="category-manager__edit-input"
                    autoFocus
                  />
                  <div className="category-manager__edit-actions">
                    <button
                      onClick={handleSaveEdit}
                      className="category-manager__save-button"
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
                  <span>{category}</span>
                  <div className="category-manager__actions">
                    <button
                      onClick={() => handleStartEdit(category)}
                      className="category-manager__edit-button"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteCategory(category)}
                      className="category-manager__delete-button"
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
    </div>
  );
};

export default CategoryManager;
