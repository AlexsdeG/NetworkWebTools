import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Layout } from './components/layout/Layout';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            {/* Placeholder routes for future phases */}
            <Route path="scan" element={<div className="p-4">Port Scanner (Coming Soon)</div>} />
            <Route path="ip" element={<div className="p-4">IP Info (Coming Soon)</div>} />
            <Route path="smtp" element={<div className="p-4">SMTP Tester (Coming Soon)</div>} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;