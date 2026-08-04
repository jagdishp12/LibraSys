import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import {
  BookOpen,
  Users,
  Clock,
  CircleDollarSign,
  TrendingUp,
  Award,
  BookMarked,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdminOrLibrarian = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

  useEffect(() => {
    if (isAdminOrLibrarian) {
      api.get('/analytics/dashboard')
        .then((response) => {
          setData(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to fetch dashboard stats.');
          setLoading(false);
        });
    } else {
      // Student specific dashboard loading
      setLoading(false);
    }
  }, [isAdminOrLibrarian]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isAdminOrLibrarian) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Operational Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time statistics of books, activity and logs.</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Books</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{data?.totalBooks || 0}</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Readers</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{data?.totalUsers || 0}</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Borrows</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{data?.activeIssuesCount || 0}</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <CircleDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fines Collected</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">Rs. {data?.totalFineCollected || "0.00"}</h3>
            </div>
          </div>
        </div>

        {/* Popular Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Most Borrowed Books */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <h2 className="font-bold text-slate-800">Most Borrowed Books</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {data?.mostBorrowedBooks?.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">No borrowing data recorded yet.</p>
              ) : (
                data?.mostBorrowedBooks?.map((book, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                    <div className="pr-4">
                      <h4 className="text-sm font-semibold text-slate-700 line-clamp-1">{book.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{book.authorName} • <span className="italic">{book.categoryName}</span></p>
                    </div>
                    <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600">
                      {book.borrowCount} Borrows
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Popular Categories */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <Award className="h-5 w-5 text-indigo-600" />
              <h2 className="font-bold text-slate-800">Category Popularity</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {data?.categoryPopularity?.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">No data available.</p>
              ) : (
                data?.categoryPopularity?.map((cat, idx) => (
                  <div key={idx} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700">{cat.name}</h4>
                    </div>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600">
                      {cat.borrowCount} Issues
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student specific dashboard landing
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-2xl p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-64 w-64 bg-indigo-500 rounded-full opacity-20"></div>
        <div className="relative z-10 space-y-3 max-w-lg">
          <span className="rounded-full bg-indigo-500 bg-opacity-30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Student Account
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {user?.fullName}!</h1>
          <p className="text-indigo-100 text-sm">
            Search our digital collection, track borrow returns, and find matching recommendations based on your favorite books.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-44">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-4">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-800">Search Books</h3>
            <p className="text-slate-400 text-xs mt-1">Explore titles, authors and racks location.</p>
          </div>
          <Link to="/books" className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 mt-4 transition-colors">
            Open Catalog <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-44">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600 mb-4">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-800">Borrow History</h3>
            <p className="text-slate-400 text-xs mt-1">View active book issues, due dates and history.</p>
          </div>
          <Link to="/transactions" className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 mt-4 transition-colors">
            Check Logs <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-44">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 mb-4">
              <BookMarked className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-800">Smart Matches</h3>
            <p className="text-slate-400 text-xs mt-1">Personalized matching based on past borrow details.</p>
          </div>
          <Link to="/recommendations" className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 mt-4 transition-colors">
            View Matches <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
