const LARAVEL_APP_BASE_URL = "http://localhost"; // Fallback for local dev

// Function to generate the correct image URL
export const getTeamLogoSrc = (logoPathFromApi: string) => {
	// if (!logoPathFromApi) {
	// 	// Handle cases where no logo is provided, return a placeholder or null
	// 	return "/images/default-team-logo.png"; // Path to a default logo in your React public folder
	// }
	if (logoPathFromApi === "") {
		return "/images/default-team-logo.png";
	}

	// Check if the logo string starts with http:// or https://
	// This indicates it's already an absolute URL (an external link)
	if (
		logoPathFromApi.startsWith("http://") ||
		logoPathFromApi.startsWith("https://")
	) {
		return logoPathFromApi; // Use the URL as is
	} else {
		// Otherwise, assume it's a relative path from our Laravel app (an uploaded file)
		return LARAVEL_APP_BASE_URL + logoPathFromApi;
	}
};
