const Spinner = () => {
	return (
		<div className="w-full h-full flex items-center justify-center text-white">
			<div>
				<div className="w-7 h-7 mx-auto rounded-full border-5 border-gray-300 border-t-gray-600 animate-spin"></div>
				<span className="text-xs">LOADING..</span>
			</div>
		</div>
	);
};
export default Spinner;
