interface DetailProps {
	label: string;
	children: React.ReactNode;
	className?: string;
	size?: "xs" | "sm";
}
const Detail = ({ label, size, children, className }: DetailProps) => {
	const getWidth = () => {
		switch (size) {
			case "xs":
				return "w-20";
			case "sm":
				return "w-27";
			default:
				return "w-34";
		}
	};
	return (
		<div className={`flex items-center space-x-1.5 ${className}`}>
			<span
				className={`flex-none bg-gray-600 ps-1 text-white ${getWidth()}`}
			>
				{label}
			</span>
			<div>{children}</div>
		</div>
	);
};
export default Detail;
