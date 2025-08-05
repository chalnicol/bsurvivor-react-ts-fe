import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth/AuthProvider";

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
	const { isAuthenticated, loading, hasRole, can } = useAuth();
	const location = useLocation();

	if (loading) {
		// return <div className="py-3">Loading authentication...</div>; // Or a spinner/loading component
		return (
			<div className="py-7 min-h-[calc(100dvh-57px)] flex items-center justify-center">
				<p className="font-medium xl:text-lg border border-gray-400 rounded px-4 py-2 shadow">
					Loading Authentication...
				</p>
			</div>
		);
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
