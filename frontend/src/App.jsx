import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Authors from './pages/Authors';
import Categories from './pages/Categories';
import Transactions from './pages/Transactions';
import Recommendations from './pages/Recommendations';
import CacheControl from './pages/CacheControl';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private Shared Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute allowedRoles={['ADMIN', 'LIBRARIAN', 'STUDENT']}>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/books"
        element={
          <PrivateRoute allowedRoles={['ADMIN', 'LIBRARIAN', 'STUDENT']}>
            <MainLayout>
              <Books />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <PrivateRoute allowedRoles={['ADMIN', 'LIBRARIAN', 'STUDENT']}>
            <MainLayout>
              <Transactions />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Admin & Librarian Routes */}
      <Route
        path="/authors"
        element={
          <PrivateRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
            <MainLayout>
              <Authors />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <PrivateRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
            <MainLayout>
              <Categories />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Student Only Routes */}
      <Route
        path="/recommendations"
        element={
          <PrivateRoute allowedRoles={['STUDENT']}>
            <MainLayout>
              <Recommendations />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Admin Only Routes */}
      <Route
        path="/cache-control"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <MainLayout>
              <CacheControl />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
