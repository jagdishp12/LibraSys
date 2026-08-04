import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  Book,
  Users,
  Tags,
  Receipt,
  Sparkles,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const isAdminOrLibrarian = user.role === 'ADMIN' || user.role === 'LIBRARIAN';

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'LIBRARIAN', 'STUDENT']
    },
    {
      name: 'Books Catalog',
      path: '/books',
      icon: Book,
      roles: ['ADMIN', 'LIBRARIAN', 'STUDENT']
    },
    {
      name: 'Authors Directory',
      path: '/authors',
      icon: Users,
      roles: ['ADMIN', 'LIBRARIAN']
    },
    {
      name: 'Categories',
      path: '/categories',
      icon: Tags,
      roles: ['ADMIN', 'LIBRARIAN']
    },
    {
      name: 'Transactions Logs',
      path: '/transactions',
      icon: Receipt,
      roles: ['ADMIN', 'LIBRARIAN', 'STUDENT']
    },
    {
      name: 'Smart Matches',
      path: '/recommendations',
      icon: Sparkles,
      roles: ['STUDENT']
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] flex flex-col p-4">
      <div className="space-y-1">
        {menuItems
          .filter(item => item.roles.includes(user.role))
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold border-l-4 border-indigo-600 pl-3'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
      </div>
      
      {user.role === 'ADMIN' && (
        <div className="mt-auto border-t border-slate-100 pt-4">
          <NavLink
            to="/cache-control"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold border-l-4 border-indigo-600 pl-3'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Settings className="h-5 w-5 shrink-0" />
            <span>Cache Manager</span>
          </NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
