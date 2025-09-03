import LoadingPrompt from "../loadingPrompt";

const LoadAuth = () => {
	return (
		<div className="fixed top-0 left-0 w-full h-dvh flex items-center justify-center bg-gray-800 z-60">
			<LoadingPrompt prompt="LOADING AUTHENTICATION" className="w-65" />
		</div>
	);
};

export default LoadAuth;
