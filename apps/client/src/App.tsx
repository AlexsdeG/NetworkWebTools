import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Scanner } from './pages/Scanner';
import { IpInfo } from './pages/IpInfo';
import { Smtp } from './pages/Smtp';
import { PrivateLayout } from './components/layout/PrivateLayout';
import { Toaster } from './components/ui/Toaster';
import { queryClient } from './lib/queryClient';

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<PrivateLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/scan" element={<Scanner />} />
              <Route path="/ip" element={<IpInfo />} />
              <Route path="/smtp" element={<Smtp />} />
            </Route>
          </Routes>
        </HashRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;