// components/admin/CategoryManager/CategoryManager.jsx - VERSIÓN CORREGIDA
import { useState, useMemo } from "react";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import SearchFilter from "../SearchFilter/SearchFilter";
import "./CategoryManager.css";

const CategoryManager = ({
  categories, // ✅ Ahora espera array de objetos: {id, name, ...}
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  console.log("🔍 [DEBUG] CategoryManager - Props recibidas:", {
    categories,
    hasAdd: !!onAddCategory,
    hasUpdate: !!onUpdateCategory,
    hasDelete: !!onDeleteCategory,
  });

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
    console.log("🔄 [DEBUG] handleAddCategory - Llamado con:", newCategory);

    // ✅ CORREGIDO: Verificar duplicados usando los nombres
    if (newCategory.trim() && !categoryNames.includes(newCategory.trim())) {
      onAddCategory(newCategory.trim());
      setNewCategory("");
    } else {
      console.warn(
        "⚠️ [DEBUG] handleAddCategory - Categoría inválida o duplicada"
      );
      // Opcional: Mostrar alerta al usuario
      if (categoryNames.includes(newCategory.trim())) {
        alert("Ya existe una categoría con ese nombre");
      }
    }
  };

  const handleStartEdit = (category) => {
    console.log("🔄 [DEBUG] handleStartEdit - Editando:", category);
    setEditingCategory(category);
    setEditValue(category.name); // ✅ CORREGIDO: Usar category.name
  };

  const handleSaveEdit = () => {
    console.log("🔄 [DEBUG] handleSaveEdit - Guardando:", {
      editingCategory,
      editValue,
    });

    if (editValue.trim() && editValue.trim() !== editingCategory.name) {
      onUpdateCategory(editingCategory.name, editValue.trim());
    }
    setEditingCategory(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    console.log("🔄 [DEBUG] handleCancelEdit - Cancelando edición");
    setEditingCategory(null);
    setEditValue("");
  };

  const handleDeleteCategory = (category) => {
    console.log("🔄 [DEBUG] handleDeleteCategory - Eliminando:", category);
    onDeleteCategory(category.name); // ✅ CORREGIDO: Pasar el nombre
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
          .filter((cat) => cat.name !== "Todos") // ✅ CORREGIDO: Usar cat.name
          .map((category) => (
            <div key={category.id} className="category-manager__item">
              {" "}
              {/* ✅ CORREGIDO: Usar category.id como key */}
              {editingCategory?.id === category.id ? ( // ✅ CORREGIDO: Comparar por ID
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
                  <span>{category.name}</span>{" "}
                  {/* ✅ CORREGIDO: Mostrar category.name */}
                  <div className="category-manager__actions">
                    <button
                      onClick={() => handleStartEdit(category)}
                      className="category-manager__edit-button"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category)}
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

      {categories.length === 0 && (
        <div className="category-manager__empty">
          <p>No hay categorías disponibles. Agrega una nueva categoría.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
