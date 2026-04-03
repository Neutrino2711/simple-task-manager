import React, { useEffect } from 'react';
import { useAuth } from "react-oidc-context";

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';
import AuthPage from './AuthPage';
import './App.css';

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div className="loading-container"><div>Loading authentication...</div></div>;
  }

  if (auth.error) {
    return <div className="error-container">Error: {auth.error.message}</div>;
  }

  // If user is authenticated, show dashboard routes
  if (auth.isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    );
  }

  // If user is not authenticated, show authentication page
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
