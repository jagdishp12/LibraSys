import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Settings, RefreshCw, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';

const CacheControl = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchStats = () => {
    setLoading(true);
    setError('');
    api.get('/admin/cache/stats')
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch cache statistics.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleEvictCache = async (name) => {
    setError('');
    setSuccess('');
    try {
      const res = await api.delete(`/admin/cache/evict/${name}`);
      setSuccess(res.data.message || `Cache '${name}' evicted successfully.`);
      fetchStats();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || `Failed to evict cache '${name}'.`);
    }
  };

  const handleEvictAll = async () => {
    if (window.confirm('Are you sure you want to flush ALL Redis caches? This might temporarily degrade performance.')) {
      setError('');
      setSuccess('');
      try {
        const res = await api.delete('/admin/cache/evict-all');
        setSuccess(res.data.message || 'All caches evicted successfully.');
        fetchStats();
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to evict all caches.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="h-6 w-6 text-indigo-600" />
            Redis Cache Manager
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Administrator dashboard to monitor active caches and clear memory blocks.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchStats}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh stats
          </button>
          <button
            onClick={handleEvictAll}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Flush All Caches
          </button>
        </div>
      </div>

      {success && (
        <div className="rounded-lg bg-green-50 p-3.5 text-sm text-green-700 border border-green-100 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-3.5 text-sm text-red-700 border border-red-100 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-3 mb-4">Memory Blocks</h2>
            <div className="divide-y divide-slate-100">
              {stats?.caches?.map((cache, idx) => (
                <div key={idx} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700">{cache.name}</h4>
                    <span className="inline-block rounded bg-green-50 text-[10px] font-bold text-green-700 px-2 py-0.5 mt-1 uppercase tracking-wide">
                      {cache.status}
                    </span>
                  </div>
                  <button
                    onClick={() => handleEvictCache(cache.name)}
                    className="rounded-lg bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 text-xs font-bold transition-colors"
                  >
                    Evict
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-3 mb-4">System Information</h2>
              <ul className="space-y-3.5 text-sm text-slate-600 font-medium">
                <li className="flex justify-between">
                  <span className="text-slate-400">Total Registered Caches:</span>
                  <span className="text-slate-800 font-bold">{stats?.totalCaches || 0}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-400">Engine Type:</span>
                  <span className="text-slate-800 font-bold">Redis Cache Manager</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-400">Degradation:</span>
                  <span className="text-green-600 font-bold">Graceful Failover Active</span>
                </li>
              </ul>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-6 border-t border-slate-50 pt-4">
              Tip: The system automatically invalidates search results caching when new books are created, and evicts reference details on checkout transactions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CacheControl;
