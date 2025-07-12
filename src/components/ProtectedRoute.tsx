import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/AuthProvider";

const ProtectedRoute: React.FC = () => {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return <div className="py-3">Loading authentication...</div>; // Or a spinner/loading component
	}

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
