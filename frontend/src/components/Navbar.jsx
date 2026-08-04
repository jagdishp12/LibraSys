import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <BookOpen className="h-7 w-7 text-indigo-600 animate-pulse" />
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
          LibraSys
        </span>
        <span className="hidden rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 sm:inline-block">
          Smart Library
        </span>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="flex items-center gap-2.5 border-r border-slate-200 pr-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-semibold shadow-inner">
                <User className="h-4.5 w-4.5" />
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-700 leading-tight">{user.fullName}</p>
                <p className="text-xs font-medium text-indigo-500 uppercase tracking-wider leading-none mt-0.5">{user.role}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
