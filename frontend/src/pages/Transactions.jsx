import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Plus, Check, Clock, Calendar, AlertCircle, X, Search, RefreshCw } from 'lucide-react';

const Transactions = () => {
  const { user } = useContext(AuthContext);
  const isAdminOrLibrarian = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

  const [transactions, setTransactions] = useState([]);
  const [booksList, setBooksList] = useState([]); // for selection helper
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  
  // Filtering & Pagination (for admin)
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('desc');
  const [viewOverdueOnly, setViewOverdueOnly] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Form states
  const [issueData, setIssueData] = useState({
    userId: '',
    bookId: '',
    daysToKeep: 14
  });

  const [returnId, setReturnId] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTransactions = () => {
    setLoading(true);
    setError('');

    if (isAdminOrLibrarian) {
      const endpoint = viewOverdueOnly ? '/transactions/overdue' : '/transactions';
      
      const params = viewOverdueOnly ? {} : {
        pageNo: page,
        pageSize: size,
        sortBy,
        sortDir
      };

      api.get(endpoint, { params })
        .then((res) => {
          if (viewOverdueOnly) {
            setTransactions(res.data);
            setTotalPages(1);
            setTotalElements(res.data.length);
          } else {
            setTransactions(res.data.content);
            setTotalPages(res.data.totalPages);
            setTotalElements(res.data.totalElements);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to fetch transactions list.');
          setLoading(false);
        });
    } else {
      // Student fetches only their own logs
      api.get(`/transactions/user/${user.id}`)
        .then((res) => {
          setTransactions(res.data);
          setTotalPages(1);
          setTotalElements(res.data.length);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to fetch your transaction history.');
          setLoading(false);
        });
    }
  };

  const loadBooksHelper = () => {
    if (isAdminOrLibrarian) {
      api.get('/books', { params: { pageSize: 100 } })
        .then(res => setBooksList(res.data.content))
        .catch(err => console.error(err));
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, size, sortBy, sortDir, viewOverdueOnly]);

  useEffect(() => {
    loadBooksHelper();
  }, [isAdminOrLibrarian]);

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/transactions/issue', {
        userId: Number(issueData.userId),
        bookId: Number(issueData.bookId),
        daysToKeep: Number(issueData.daysToKeep)
      });
      setSuccess('Book issued successfully.');
      setShowIssueModal(false);
      fetchTransactions();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while issuing book.');
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/transactions/return', {
        transactionId: Number(returnId)
      });
      const fine = res.data.fineAmount;
      if (fine > 0) {
        setSuccess(`Book returned successfully. Overdue fine incurred: Rs. ${fine}`);
      } else {
        setSuccess('Book returned successfully.');
      }
      setShowReturnModal(false);
      fetchTransactions();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while returning book.');
    }
  };

  const initiateReturn = (id) => {
    setReturnId(id);
    setShowReturnModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Borrow & Returns logs</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track active issuances, check overdue statuses, and calculate fines.</p>
        </div>

        {isAdminOrLibrarian && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIssueData({ userId: '', bookId: '', daysToKeep: 14 });
                setError('');
                setShowIssueModal(true);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Issue Book
            </button>
            <button
              onClick={() => {
                setReturnId('');
                setError('');
                setShowReturnModal(true);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Check className="h-4 w-4" />
              Return Book
            </button>
          </div>
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

      {/* Admin Filters */}
      {isAdminOrLibrarian && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setViewOverdueOnly(!viewOverdueOnly);
                setPage(0);
              }}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-all duration-200 ${
                viewOverdueOnly
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {viewOverdueOnly ? 'Showing Overdue Only' : 'Show Overdue List'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchTransactions}
              className="rounded-lg p-2 hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-5">Transaction ID</th>
                <th className="py-4 px-5">Reader Name</th>
                <th className="py-4 px-5">Book Title</th>
                <th className="py-4 px-5">Issue Date</th>
                <th className="py-4 px-5">Due Date</th>
                <th className="py-4 px-5 text-center">Status</th>
                <th className="py-4 px-5 text-right">Fine Incurred</th>
                {isAdminOrLibrarian && <th className="py-4 px-5 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={isAdminOrLibrarian ? 8 : 7} className="text-center py-8 text-slate-400">
                    Loading borrow logs...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={isAdminOrLibrarian ? 8 : 7} className="text-center py-8 text-slate-400">
                    No transactions recorded.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isOverdue = tx.status === 'ISSUED' && new Date(tx.dueDate) < new Date();
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-5 font-mono text-xs text-slate-400">#TX-{tx.id}</td>
                      <td className="py-4 px-5 font-semibold text-slate-700">
                        {tx.user.fullName} <span className="text-xs text-slate-400 font-normal">({tx.user.email})</span>
                      </td>
                      <td className="py-4 px-5 text-slate-500">{tx.book.title}</td>
                      <td className="py-4 px-5 text-slate-550 font-medium">{tx.issueDate}</td>
                      <td className="py-4 px-5 text-slate-550 font-medium">{tx.dueDate}</td>
                      <td className="py-4 px-5 text-center">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          tx.status === 'RETURNED'
                            ? 'bg-green-50 text-green-700'
                            : isOverdue
                              ? 'bg-red-150 bg-red-50 text-red-700 animate-pulse'
                              : 'bg-amber-50 text-amber-700'
                        }`}>
                          {tx.status === 'RETURNED' ? 'Returned' : isOverdue ? 'Overdue' : 'Issued'}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right font-semibold text-slate-700">
                        {tx.fineAmount > 0 ? `Rs. ${tx.fineAmount}` : 'Rs. 0.00'}
                      </td>
                      {isAdminOrLibrarian && (
                        <td className="py-4 px-5 text-right">
                          {tx.status === 'ISSUED' && (
                            <button
                              onClick={() => initiateReturn(tx.id)}
                              className="rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 text-xs transition-colors"
                            >
                              Return
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (only for paginated admin view) */}
        {isAdminOrLibrarian && !viewOverdueOnly && totalPages > 1 && (
          <div className="flex justify-between items-center bg-slate-50 px-5 py-4 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-semibold">
              Showing page {page + 1} of {totalPages} ({totalElements} total logs)
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

      {/* Issue Book Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 relative">
            <button
              onClick={() => setShowIssueModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              Issue Book Record
            </h3>

            <form onSubmit={handleIssueSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Reader (User ID)</label>
                <input
                  type="number"
                  required
                  placeholder="Enter User ID (e.g. 1)"
                  value={issueData.userId}
                  onChange={(e) => setIssueData({ ...issueData, userId: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-700 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Book</label>
                <select
                  value={issueData.bookId}
                  onChange={(e) => setIssueData({ ...issueData, bookId: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-700 bg-white outline-none focus:border-indigo-500 transition-colors"
                  required
                >
                  <option value="">Select a book...</option>
                  {booksList.map(b => (
                    <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
                      {b.title} ({b.availableCopies > 0 ? `${b.availableCopies} available` : 'Out of Stock'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Days to Keep
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={30}
                  value={issueData.daysToKeep}
                  onChange={(e) => setIssueData({ ...issueData, daysToKeep: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-700 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex gap-2.5 justify-end mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Book Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 relative">
            <button
              onClick={() => setShowReturnModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Check className="h-5 w-5 text-indigo-600" />
              Return Book Action
            </h3>

            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Transaction ID</label>
                <input
                  type="number"
                  required
                  placeholder="Enter Transaction ID (e.g. 1)"
                  value={returnId}
                  onChange={(e) => setReturnId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-700 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex gap-2.5 justify-end mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
                >
                  Process Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
