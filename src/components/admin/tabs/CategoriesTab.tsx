import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Tag,
  Check,
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Gamepad2,
  Shield,
  Cpu,
  Zap,
  Home,
} from 'lucide-react';
import { Category, CategoryId } from '../../../types';
import { GalleryImagePicker } from '../common/GalleryImagePicker';
import { sanitizeImageUrl, PHONE_IMAGE } from '../../../data/mockData';

export const CategoriesTab: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, products, showToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Smartphone');
  const [imageUrl, setImageUrl] = useState('');
  const [subcategoriesStr, setSubcategoriesStr] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setId('');
    setDescription('');
    setIconName('Smartphone');
    setImageUrl('');
    setSubcategoriesStr('Pro, Lite, Plus');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setId(c.id);
    setDescription(c.description);
    setIconName(c.iconName);
    setImageUrl(c.image || '');
    setSubcategoriesStr(c.subcategories ? c.subcategories.join(', ') : '');
    setIsActive(c.isActive !== false);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Category name is required.', 'error');
      return;
    }

    const cleanId = (id.trim() || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')) as CategoryId;
    const subcats = subcategoriesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: name.trim(),
        description: description.trim(),
        iconName,
        image: imageUrl.trim() || undefined,
        subcategories: subcats,
        isActive,
      });
    } else {
      addCategory({
        id: cleanId,
        name: name.trim(),
        description: description.trim(),
        productCount: 0,
        iconName,
        image: imageUrl.trim() || undefined,
        subcategories: subcats,
        isActive,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Categories & Taxonomies</h1>
          <p className="text-xs text-slate-400">
            Structure hardware groupings, upload navigation imagery, and configure subcategories.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => {
          const liveProductCount = products.filter((p) => p.category === c.id).length;

          return (
            <div
              key={c.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={sanitizeImageUrl(c.image) || PHONE_IMAGE}
                      alt={c.name}
                      onError={(e) => {
                        if (e.currentTarget.src !== PHONE_IMAGE) {
                          e.currentTarget.src = PHONE_IMAGE;
                        }
                      }}
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-white text-sm">{c.name}</h3>
                      <span className="font-mono text-[10px] text-slate-500 uppercase">
                        ID: {c.id}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Active
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>

                {c.subcategories && c.subcategories.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-3">
                    {c.subcategories.map((sub) => (
                      <span
                        key={sub}
                        className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  {liveProductCount} active devices
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                    title="Edit category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete category "${c.name}"?`)) {
                        deleteCategory(c.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 text-white space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">
                {editingCategory ? `Edit: ${editingCategory.name}` : 'Create Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Smart Watches"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  URL Slug / ID (auto-generated if empty)
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="e.g. smart-watches"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description for storefront category cards..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Subcategories (comma separated)
                </label>
                <input
                  type="text"
                  value={subcategoriesStr}
                  onChange={(e) => setSubcategoriesStr(e.target.value)}
                  placeholder="Flagship, Budget, Gaming, Pro"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <GalleryImagePicker
                  single
                  image={imageUrl}
                  onImageChange={setImageUrl}
                  label="Category Cover Image (Device Gallery & Media Library)"
                  helperText="Upload photo from your phone/computer gallery or select from the store media library. No URL needed."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
