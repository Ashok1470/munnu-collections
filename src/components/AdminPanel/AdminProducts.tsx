import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Star, Zap, Image as ImageIcon, AlertTriangle, CheckCircle2, X, Sparkles } from 'lucide-react';
import { Product, ProductCategory } from '../../types';
import { api } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ALL_CATEGORIES, getProductDepartment, getProductFieldLabels } from '../../utils/productHelpers';

interface AdminProductsProps {
  initialAddNew?: boolean;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ initialAddNew = false }) => {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<'all' | 'sarees' | 'handbags' | 'jewellery'>('all');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(initialAddNew);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'Silk Sarees' as ProductCategory,
    price: '',
    originalPrice: '',
    description: '',
    fabric: 'Pure Mulberry Silk',
    blouseIncluded: true,
    length: '6.3 Meters (with blouse)',
    images: [''],
    stock: '10',
    isFeatured: false,
    isNewArrival: true,
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const activeFieldLabels = getProductFieldLabels(formData.category);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.getProducts();
      setProducts(res.products);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddForm = (defaultCategory: ProductCategory = 'Silk Sarees') => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: defaultCategory,
      price: '',
      originalPrice: '',
      description: '',
      fabric: defaultCategory.includes('Handbag') || defaultCategory.includes('Clutch') || defaultCategory.includes('Bag')
        ? 'Embroidered Velvet & Vegan Leather'
        : defaultCategory.includes('Jewel') || defaultCategory.includes('Necklace') || defaultCategory.includes('Earring')
        ? '24K Gold Micron Plated Brass with Kundan Stones'
        : 'Pure Mulberry Silk',
      blouseIncluded: true,
      length: defaultCategory.includes('Handbag') || defaultCategory.includes('Clutch') || defaultCategory.includes('Bag')
        ? '26cm × 18cm × 7cm'
        : defaultCategory.includes('Jewel') || defaultCategory.includes('Necklace') || defaultCategory.includes('Earring')
        ? 'Adjustable Fit'
        : '6.3 Meters (with blouse)',
      images: [''],
      stock: '10',
      isFeatured: false,
      isNewArrival: true,
    });
    setFormError('');
    setFormSuccess('');
    setIsFormOpen(true);
  };

  const openEditForm = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      price: String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : '',
      description: p.description,
      fabric: p.fabric || '',
      blouseIncluded: Boolean(p.blouseIncluded),
      length: p.length || '',
      images: p.images && p.images.length > 0 ? p.images : [''],
      stock: String(p.stock),
      isFeatured: Boolean(p.isFeatured),
      isNewArrival: Boolean(p.isNewArrival),
    });
    setFormError('');
    setFormSuccess('');
    setIsFormOpen(true);
  };

  const handleImageChange = (index: number, value: string) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData({ ...formData, images: updated });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index: number) => {
    if (formData.images.length === 1) return;
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updated });
  };

  // Image Upload helper (supports uploading direct image files via base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleImageChange(index, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.name.trim()) {
      setFormError('Product name is required');
      return;
    }

    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Please enter a valid price');
      return;
    }

    const validImages = formData.images.filter((img) => img.trim() !== '');
    if (validImages.length === 0) {
      setFormError('Please provide or upload at least one product photo');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      price: priceNum,
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      description: formData.description.trim(),
      fabric: formData.fabric.trim() || 'Premium Quality',
      blouseIncluded: Boolean(formData.blouseIncluded),
      length: formData.length.trim() || 'Standard Size',
      images: validImages,
      stock: Number(formData.stock) || 0,
      isFeatured: Boolean(formData.isFeatured),
      isNewArrival: Boolean(formData.isNewArrival),
    };

    setSubmitting(true);

    try {
      if (editingProduct) {
        await api.adminUpdateProduct(editingProduct.id, payload, token);
        setFormSuccess('Product updated successfully!');
      } else {
        await api.adminAddProduct(payload, token);
        setFormSuccess('Product added to catalog successfully!');
      }

      await fetchProducts();
      setTimeout(() => {
        setIsFormOpen(false);
        setFormSuccess('');
      }, 1000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.adminDeleteProduct(id, token);
      setDeleteConfirmId(null);
      await fetchProducts();
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  const filteredProducts = products.filter((p) => {
    const dept = getProductDepartment(p.category);
    const matchesDept = departmentFilter === 'all' || dept === departmentFilter;
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.fabric && p.fabric.toLowerCase().includes(q));
    return matchesDept && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-zinc-100">
            Catalog Management (Sarees, Handbags & Jewellery)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Add, update pricing, upload images, manage stock, and highlight featured products
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button
            id="admin-add-saree-btn"
            onClick={() => openAddForm('Silk Sarees')}
            className="py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-[#d4af37] via-[#f1d06e] to-[#aa820a] hover:brightness-110 text-black shadow-lg shadow-[#d4af37]/20 flex items-center gap-1.5 uppercase tracking-wider transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Saree</span>
          </button>
          <button
            id="admin-add-handbag-btn"
            onClick={() => openAddForm('Luxury Handbags')}
            className="py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-[#e83e8c] to-[#c2185b] hover:brightness-110 text-white shadow-lg shadow-[#e83e8c]/20 flex items-center gap-1.5 uppercase tracking-wider transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Handbag</span>
          </button>
          <button
            id="admin-add-jewellery-btn"
            onClick={() => openAddForm('Bridal Jewellery Sets')}
            className="py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-800 hover:brightness-110 text-amber-100 shadow-lg shadow-amber-700/20 flex items-center gap-1.5 uppercase tracking-wider transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Jewellery</span>
          </button>
        </div>
      </div>

      {/* Department Tabs & Filters */}
      <div className="space-y-3 bg-[#121216] border border-zinc-800 p-4 rounded-2xl">
        {/* Department Switcher */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto">
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold mr-2">Department:</span>
          {[
            { id: 'all', label: 'All Items' },
            { id: 'sarees', label: '🥻 Sarees' },
            { id: 'handbags', label: '👜 Handbags' },
            { id: 'jewellery', label: '💎 Jewellery' },
          ].map((dept) => (
            <button
              key={dept.id}
              onClick={() => {
                setDepartmentFilter(dept.id as any);
                setCategoryFilter('All');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                departmentFilter === dept.id
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black shadow-md'
                  : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {dept.label}
            </button>
          ))}
        </div>

        {/* Search & Subcategory filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name, fabric, material, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setCategoryFilter('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === 'All' ? 'bg-[#d4af37] text-black font-bold' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              All Subcategories ({products.length})
            </button>
            {ALL_CATEGORIES.flatMap((g) => g.items).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  categoryFilter === cat ? 'bg-[#d4af37] text-black font-bold' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product List Table / Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#121216] border border-zinc-800 rounded-3xl p-6">
          <p className="text-zinc-400 text-sm">No products found matching your filter criteria.</p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => openAddForm('Silk Sarees')}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-[#fceda6] rounded-xl"
            >
              + Add Saree
            </button>
            <button
              onClick={() => openAddForm('Luxury Handbags')}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-[#ff85c0] rounded-xl"
            >
              + Add Handbag
            </button>
            <button
              onClick={() => openAddForm('Bridal Jewellery Sets')}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-amber-300 rounded-xl"
            >
              + Add Jewellery
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const isDeleting = deleteConfirmId === product.id;
            const dept = getProductDepartment(product.category);

            return (
              <div
                key={product.id}
                className="bg-[#121216] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg"
              >
                <div>
                  {/* Thumbnail & Badges */}
                  <div className="relative aspect-[4/3] bg-black overflow-hidden">
                    <img
                      src={product.images[0] || ''}
                      alt={product.name}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {dept === 'handbags' ? (
                        <span className="bg-[#e83e8c] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                          👜 Handbag
                        </span>
                      ) : dept === 'jewellery' ? (
                        <span className="bg-amber-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                          💎 Jewellery
                        </span>
                      ) : (
                        <span className="bg-[#d4af37] text-black text-[9px] font-bold px-2 py-0.5 rounded shadow">
                          🥻 Saree
                        </span>
                      )}
                      {product.isFeatured && (
                        <span className="bg-zinc-900/90 border border-[#d4af37]/60 text-[#fceda6] text-[9px] font-bold px-2 py-0.5 rounded shadow">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-zinc-300 font-semibold">
                      Stock: {product.stock}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3.5 space-y-1">
                    <span className="text-[10px] text-[#e83e8c] uppercase font-bold tracking-wider">
                      {product.category}
                    </span>
                    <h4 className="font-serif-luxury text-sm font-bold text-zinc-100 line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-1">{product.fabric}</p>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="font-cinzel text-base font-bold text-[#fceda6]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-zinc-500 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-3 bg-zinc-950/80 border-t border-zinc-800">
                  {isDeleting ? (
                    <div className="space-y-2">
                      <p className="text-[11px] text-rose-300 font-medium text-center">
                        Are you sure you want to delete this product?
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openEditForm(product)}
                        className="py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(product.id)}
                        className="py-1.5 px-2 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#0f0f14] border border-[#d4af37]/40 rounded-3xl overflow-hidden shadow-2xl text-zinc-100 my-auto max-h-[90vh] flex flex-col">
            <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
                  {getProductDepartment(formData.category).toUpperCase()} COLLECTION
                </span>
                <h3 className="font-serif-luxury text-xl font-bold text-zinc-100">
                  {editingProduct ? `Edit ${editingProduct.name}` : `Add New ${formData.category} Item`}
                </h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {formError && (
                <div className="p-3 bg-red-950/60 border border-red-500/50 text-red-300 text-xs rounded-xl">
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Product Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={activeFieldLabels.namePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const newCat = e.target.value as ProductCategory;
                      setFormData({ ...formData, category: newCat });
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none"
                  >
                    {ALL_CATEGORIES.map((grp) => (
                      <optgroup key={grp.group} label={grp.group}>
                        {grp.items.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    {activeFieldLabels.materialLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={activeFieldLabels.materialPlaceholder}
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Price (₹) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="e.g. 4999"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Original / MRP Price (₹)
                  </label>
                  <input
                    type="number"
                    min={1}
                    placeholder="e.g. 7999 (for discount display)"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g. 10"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    {activeFieldLabels.lengthLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={activeFieldLabels.lengthPlaceholder}
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the craftsmanship, patterns, motifs, styling advice, and occasion suitability..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none"
                />
              </div>

              {/* Product Images List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Product Images (Direct File Upload or URLs) <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-xs text-[#d4af37] hover:underline font-semibold"
                  >
                    + Add Another Image
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.images.map((imgUrl, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Image URL or use Upload button"
                        value={imgUrl}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2 text-xs sm:text-sm text-zinc-100 focus:outline-none"
                      />
                      <label className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs cursor-pointer whitespace-nowrap">
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, index)}
                          className="hidden"
                        />
                      </label>
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="p-2 text-zinc-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions & Feature Flags */}
              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.blouseIncluded}
                    onChange={(e) => setFormData({ ...formData, blouseIncluded: e.target.checked })}
                    className="rounded text-[#d4af37] focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block">
                      {activeFieldLabels.extrasLabel}
                    </span>
                    <span className="text-[10px] text-zinc-400 block">
                      {activeFieldLabels.extrasDescription}
                    </span>
                  </div>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded text-[#d4af37] focus:ring-0"
                    />
                    <span className="text-xs font-semibold text-zinc-200">Featured Collection</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="rounded text-[#e83e8c] focus:ring-0"
                    />
                    <span className="text-xs font-semibold text-zinc-200">New Arrival</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2.5 px-6 rounded-xl text-xs font-bold bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 text-black uppercase tracking-wider"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
