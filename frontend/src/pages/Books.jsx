import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Search, Plus, Edit2, Trash2, ArrowUpDown, X, BookOpen, MapPin, Hash } from 'lucide-react';

const Books = () => {
  const { user } = useContext(AuthContext);
  const isAdminOrLibrarian = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';
  const isAdmin = user?.role === 'ADMIN';

  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Pagination & Filters State
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [keyword, setKeyword] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Modal form states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    categoryId: '',
    authorId: '',
    totalCopies: 1,
    locationRack: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch books catalog
  const fetchBooks = () => {
    api.get('/books', {
      params: {
        pageNo: page,
        pageSize: size,
        sortBy,
        sortDir,
        keyword: keyword || undefined
      }
    })
    .then((res) => {
      setBooks(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    })
    .catch((err) => {
      console.error(err);
      setError('Failed to fetch books.');
    });
  };

  // Fetch helpers for dropdowns
  const fetchDropdownData = () => {
    if (isAdminOrLibrarian) {
      Promise.all([api.get('/authors'), api.get('/categories')])
        .then(([authorsRes, categoriesRes]) => {
          setAuthors(authorsRes.data);
          setCategories(categoriesRes.data);
        })
        .catch(err => console.error('Failed to load metadata', err));
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, size, sortBy, sortDir]);

  useEffect(() => {
    fetchDropdownData();
  }, [isAdminOrLibrarian]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchBooks();
  };

  const handleSort = (field) => {
    const isAsc = sortBy === field && sortDir === 'asc';
    setSortDir(isAsc ? 'desc' : 'asc');
    setSortBy(field);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      title: '',
      isbn: '',
      categoryId: categories[0]?.id || '',
      authorId: authors[0]?.id || '',
      totalCopies: 1,
      locationRack: ''
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (book) => {
    setIsEditing(true);
    setCurrentBookId(book.id);
    setFormData({
      title: book.title,
      isbn: book.isbn,
      categoryId: book.category.id,
      authorId: book.author.id,
      totalCopies: book.totalCopies,
      locationRack: book.locationRack || ''
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
        await api.put(`/books/${currentBookId}`, formData);
        setSuccess('Book updated successfully.');
      } else {
        await api.post('/books', formData);
        setSuccess('Book added to collection.');
      }
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while saving book.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${id}`);
        setSuccess('Book removed successfully.');
        fetchBooks();
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to delete book.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Books Collection</h1>
          <p className="text-slate-500 text-sm mt-0.5">Explore catalog, search resources and filter items.</p>
        </div>

        {isAdminOrLibrarian && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 self-start rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Book
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

      {/* Filter and search bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            placeholder="Search by title, author or ISBN..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-500 transition-colors"
          />
        </form>

        <div className="flex gap-2">
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(0);
            }}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 bg-white outline-none focus:border-indigo-500"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-5">Title</th>
                <th className="py-4 px-5">Author</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('isbn')}>
                  <div className="flex items-center gap-1">ISBN <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-4 px-5 text-center cursor-pointer hover:bg-slate-100" onClick={() => handleSort('availableCopies')}>
                  <div className="flex items-center justify-center gap-1">Copies <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-4 px-5">Location</th>
                {isAdminOrLibrarian && <th className="py-4 px-5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {books.length === 0 ? (
                <tr>
                  <td colSpan={isAdminOrLibrarian ? 7 : 6} className="text-center py-8 text-slate-400">
                    No books found in the collection.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-5 font-semibold text-slate-700">{book.title}</td>
                    <td className="py-4 px-5 text-slate-500">{book.author.name}</td>
                    <td className="py-4 px-5 text-slate-500">{book.category.name}</td>
                    <td className="py-4 px-5 font-mono text-xs text-slate-400">{book.isbn}</td>
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        book.availableCopies > 0
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {book.availableCopies} / {book.totalCopies}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-500 font-medium">
                      {book.locationRack || <span className="italic text-slate-300">Unassigned</span>}
                    </td>
                    {isAdminOrLibrarian && (
                      <td className="py-4 px-5 text-right">
                        <div className="flex justify-end gap-2.5">
                          <button
                            onClick={() => openEditModal(book)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-all"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(book.id)}
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center bg-slate-50 px-5 py-4 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-semibold">
              Showing page {page + 1} of {totalPages} ({totalElements} total books)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(prev => prev - 1)}
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages - 1}
                onClick={() => setPage(prev => prev + 1)}
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-100 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              {isEditing ? 'Update Book Record' : 'Register New Book'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Book Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Mastering Spring Boot 3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Author</label>
                  <select
                    value={formData.authorId}
                    onChange={(e) => setFormData({ ...formData, authorId: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-700 bg-white outline-none focus:border-indigo-500 transition-colors"
                  >
                    {authors.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-700 bg-white outline-none focus:border-indigo-500 transition-colors"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <Hash className="h-3.5 w-3.5" /> ISBN Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="978-3-16-148410-0"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Total Copies</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.totalCopies}
                    onChange={(e) => setFormData({ ...formData, totalCopies: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-700 outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> Location Rack
                </label>
                <input
                  type="text"
                  value={formData.locationRack}
                  onChange={(e) => setFormData({ ...formData, locationRack: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Shelf A-3"
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
                  {isEditing ? 'Save Changes' : 'Register Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
