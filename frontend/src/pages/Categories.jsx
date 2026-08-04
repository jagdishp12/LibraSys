import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Plus, Edit2, Trash2, X, Tags } from 'lucide-react';

const Categories = () => {
  const { user } = useContext(AuthContext);
  const isAdminOrLibrarian = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';
  const isAdmin = user?.role === 'ADMIN';

  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCategories = () => {
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch categories.');
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ name: '', description: '' });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setIsEditing(true);
    setCurrentCategoryId(cat.id);
    setFormData({
      name: cat.name,
      description: cat.description || ''
    });
    setError('');
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isEditing) {
        await api.put(`/categories/${currentCategoryId}`, formData);
        setSuccess('Category updated.');
      } else {
        await api.post('/categories', formData);
        setSuccess('Category created successfully.');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while saving category.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This will affect books in this category.')) {
      try {
        await api.delete(`/categories/${id}`);
        setSuccess('Category deleted successfully.');
        fetchCategories();
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to delete category.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage book genres and thematic classifications.</p>
        </div>

        {isAdminOrLibrarian && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 self-start rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        )}
      </div>

      {success && (
        <div className="rounded-lg bg-green-50 p-3.5 text-sm text-green-700 border border-green-100">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-3.5 text-sm text-red-700 border border-red-100">
          {error}
        </div>
      )}

      {/* Categories grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center col-span-full">No categories registered yet.</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                  <Tags className="h-4 w-4 text-indigo-500" />
                  {cat.name}
                </h3>
                <p className="text-slate-500 text-xs mt-2 line-clamp-3 leading-relaxed">
                  {cat.description || <span className="italic text-slate-350">No description details.</span>}
                </p>
              </div>

              {isAdminOrLibrarian && (
                <div className="flex justify-end gap-2.5 mt-5 border-t border-slate-50 pt-3">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-all"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Form modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Tags className="h-5 w-5 text-indigo-600" />
              {isEditing ? 'Edit Category' : 'Create New Category'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Computer Science"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-500 transition-colors h-24 resize-none"
                  placeholder="Thematic description..."
                />
              </div>

              <div className="flex gap-2.5 justify-end mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
                >
                  {isEditing ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
