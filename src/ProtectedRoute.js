import React from 'react';
import { useAuth } from "react-oidc-context";
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const auth = useAuth();

    if (auth.isLoading) {
        return <div className="loading-container"><div>Loading...</div></div>;
    }

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
