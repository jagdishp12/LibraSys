import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Sparkles, BookOpen, Star, HelpCircle } from 'lucide-react';

const Recommendations = () => {
  const { user } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecommendations = () => {
    setLoading(true);
    setError('');
    api.get(`/recommendations/user/${user.id}`, { params: { limit } })
      .then((res) => {
        setRecommendations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not fetch recommendations.');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user?.id) {
      fetchRecommendations();
    }
  }, [user, limit]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-500 animate-spin" style={{ animationDuration: '3s' }} />
            Smart Matches
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Rule-based matches compiled from category preferences and peers borrowing details.</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Show Limit</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white outline-none focus:border-indigo-500"
          >
            <option value={3}>3 Matches</option>
            <option value={5}>5 Matches</option>
            <option value={10}>10 Matches</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-lg mx-auto shadow-sm">
          <HelpCircle className="h-12 w-12 text-indigo-350 mx-auto mb-4" />
          <h3 className="font-bold text-slate-700 text-base">No matches found</h3>
          <p className="text-slate-400 text-xs mt-2 leading-relaxed">
            Borrow some books from the catalog to build up your profile history. Our smart system will then match books matching your favorite category groups.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((book) => (
            <div key={book.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md hover:border-indigo-200 transition-all duration-200 relative group overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 h-16 w-16 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition-colors"></div>
              
              <div className="relative z-10">
                <span className="inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-4">
                  {book.category.name}
                </span>

                <h3 className="font-bold text-slate-800 text-lg leading-tight line-clamp-2 pr-4">{book.title}</h3>
                <p className="text-slate-400 text-xs font-semibold mt-1">{book.author.name}</p>

                <div className="mt-6 border-t border-slate-50 pt-4 flex gap-4 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    <span>Rack: {book.locationRack || 'Shelf'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-slate-600">Smart Pick</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 flex justify-between items-center relative z-10">
                <span className={`text-xs font-bold ${
                  book.availableCopies > 0 ? 'text-green-600' : 'text-red-500'
                }`}>
                  {book.availableCopies > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className="text-[10px] font-mono text-slate-350">{book.isbn}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
