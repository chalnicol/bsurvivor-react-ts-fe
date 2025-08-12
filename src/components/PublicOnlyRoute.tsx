import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/AuthProvider";
import LoadAuth from "./auth/loadAuth";
// import { useLocation } from "react-router-dom";
const PublicOnlyRoute: React.FC = () => {
	const { isAuthenticated, authLoading } = useAuth();

	// If still loading auth state, render nothing or a loader
	// This prevents flickering or premature redirection
	if (authLoading) {
		return <LoadAuth />;
	}

	// If authenticated, redirect to the home page (or dashboard)
	// `replace` prop ensures the user can't navigate back to the login/register page using the browser's back button
	if (isAuthenticated) {
		return <Navigate to="/" replace />; // Redirect to your main home page or dashboard
	}

	// If not authenticated, render the child routes (e.g., login form, register form)
	return <Outlet />;
};

export default PublicOnlyRoute;
