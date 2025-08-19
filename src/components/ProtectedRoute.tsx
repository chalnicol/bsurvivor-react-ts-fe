import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth/AuthProvider";
import LoadAuth from "./auth/loadAuth";

interface ProtectedRouteProps {
	// Optional: A single role or an array of roles required
	requiredRoles?: string | string[];
	// Optional: A single permission or an array of permissions required
	requiredPermissions?: string | string[];
}

const ProtectedRoute = ({
	requiredRoles,
	requiredPermissions,
}: ProtectedRouteProps) => {
	const { authLoading, isAuthenticated, toVerifyEmail, hasRole, can } =
		useAuth();
	const location = useLocation();

	if (authLoading) {
		// return <div className="py-3">Loading authentication...</div>; // Or a spinner/loading component
		return <LoadAuth />;
	}

	if (toVerifyEmail) {
		return <Navigate to="/email-verification-notice" replace />;
	}

	if (!isAuthenticated) {
		// return <Navigate to="/login" replace />;
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (requiredRoles) {
		const rolesArray = Array.isArray(requiredRoles)
			? requiredRoles
			: [requiredRoles];
		const userHasRequiredRole = rolesArray.some((role) => hasRole(role));

		if (!userHasRequiredRole) {
			// Redirect to a home page, unauthorized page, or show an error
			// You could also render a specific "Access Denied" component here
			return <Navigate to="/unauthorized" replace />; // Or to a /unauthorized page
		}
	}

	if (requiredPermissions) {
		const permissionsArray = Array.isArray(requiredPermissions)
			? requiredPermissions
			: [requiredPermissions];
		const userHasRequiredPermission = permissionsArray.some((permission) =>
			can(permission)
		);

		if (!userHasRequiredPermission) {
			// Redirect to a home page, unauthorized page, or show an error
			return <Navigate to="/unauthorized" replace />; // Or to a /unauthorized page
		}
	}

	// If all checks pass, render the Outlet (which will render the matched child route)
	return <Outlet />;
};

export default ProtectedRoute;
