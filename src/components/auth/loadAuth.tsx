import logo from "../../assets/bsurvivor.png";

const LoadAuth = () => {
	return (
		<div className="fixed top-0 left-0 w-full h-dvh flex items-center justify-center bg-gray-700 z-60">
			<div className="px-4 py-3 bg-gray-800 rounded-lg shadow-lg border border-gray-600">
				<img
					src={logo}
					alt="bsurvivor"
					className="w-full max-w-44 object-contain mx-auto"
				/>
				<div className="text-sm text-white text-center mt-2 font-semibold">
					LOADING AUTHENTICATION...
				</div>
			</div>
		</div>
	);
};

export default LoadAuth;
