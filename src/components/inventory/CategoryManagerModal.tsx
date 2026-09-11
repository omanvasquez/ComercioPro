import React, { useState } from 'react';
import { X, Tags, Plus, Trash2, Edit2, Check, AlertCircle } from 'lucide-react';
import { Category, Product } from '../../types';
import { useInventory } from '../../context/InventoryContext';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#2563eb', // Blue
  '#f59e0b', // Amber / Gold
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#ef4444', // Red
  '#64748b', // Slate
];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useInventory();

  const [newName, setNewName] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(PRESET_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [editingColor, setEditingColor] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const trimmed = newName.trim();
    if (!trimmed) return;

    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg('Ya existe una categoría con este nombre.');
      return;
    }

    addCategory(trimmed, selectedColor);
    setNewName('');
  };

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
    setEditingColor(cat.color || PRESET_COLORS[0]);
    setErrorMsg('');
  };

  const handleSaveEdit = (id: string) => {
    const trimmed = editingName.trim();
    if (!trimmed) return;

    if (
      categories.some(
        (c) => c.id !== id && c.name.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      setErrorMsg('Ya existe otra categoría con este nombre.');
      return;
    }

    updateCategory(id, trimmed, editingColor);
    setEditingId(null);
  };

  const handleDelete = (cat: Category) => {
    const count = products.filter((p) => p.category === cat.name).length;
    if (count > 0) {
      if (
        !window.confirm(
          `La categoría "${cat.name}" tiene ${count} producto(s) asignado(s). ¿Seguro que deseas eliminarla? Los productos mantendrán su nombre de categoría.`
        )
      ) {
        return;
      }
    }
    deleteCategory(cat.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-md">
              <Tags className="w-5 h-5 font-bold" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white">
                Categorías de Artículos
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Personaliza las secciones según tu tipo de negocio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Add Category Form */}
          <form
            onSubmit={handleAdd}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
          >
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Agregar Nueva Categoría
            </span>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ej. Tornillos, Bebidas, Papelería..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-xs transition shadow-sm flex items-center space-x-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar</span>
              </button>
            </div>

            {/* Color selector for new category */}
            <div className="flex items-center space-x-2 pt-1">
              <span className="text-[11px] text-slate-500 font-medium">Color:</span>
              <div className="flex items-center space-x-1.5">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-5 h-5 rounded-full transition transform ${
                      selectedColor === color
                        ? 'ring-2 ring-offset-2 ring-slate-900 scale-110'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center space-x-1.5 text-xs text-rose-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </form>

          {/* Categories List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Categorías Actuales ({categories.length})
              </span>
            </div>

            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
              {categories.map((cat) => {
                const isEditing = editingId === cat.id;
                const productCount = products.filter(
                  (p) => p.category === cat.name
                ).length;

                return (
                  <div
                    key={cat.id}
                    className="p-3 sm:px-4 flex items-center justify-between hover:bg-slate-50/70 transition"
                  >
                    {isEditing ? (
                      <div className="flex items-center space-x-2 flex-1 mr-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-xl border border-blue-500 text-xs font-bold text-slate-900 focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(cat.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(cat.id)}
                          className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color || '#2563eb' }}
                        />
                        <div className="truncate">
                          <span className="text-sm font-bold text-slate-800 block truncate">
                            {cat.name}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {productCount} {productCount === 1 ? 'producto' : 'productos'}
                          </span>
                        </div>
                      </div>
                    )}

                    {!isEditing && (
                      <div className="flex items-center space-x-1 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(cat)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                          title="Editar nombre"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          title="Eliminar categoría"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
