interface DetailProps {
	label: string;
	children: React.ReactNode;
	className?: string;
}
const Detail = ({ label, children, className }: DetailProps) => {
	return (
		<div className={`flex items-center space-x-1.5 ${className}`}>
			<span className="flex-none w-34 bg-gray-600 ps-1">{label}</span>
			<div>{children}</div>
		</div>
	);
};
export default Detail;
