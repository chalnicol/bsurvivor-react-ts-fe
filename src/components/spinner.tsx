interface SpinnerProps {
	className?: string;
}
const Spinner = ({ className }: SpinnerProps) => {
	return (
		<div
			className={`w-full h-full flex items-center justify-center ${className}`}
		>
			<div>
				<div className="w-7 h-7 mx-auto rounded-full border-5 border-gray-400 border-t-gray-600 animate-spin"></div>
				<span className="text-xs font-semibold">LOADING</span>
			</div>
		</div>
	);
};
export default Spinner;
