interface DetailProps {
	label: string;
	children: React.ReactNode;
}
const Detail = ({ label, children }: DetailProps) => {
	return (
		<div className="flex items-center space-x-1.5">
			<span className="flex-none w-34 bg-gray-600 ps-1">{label}</span>
			<div>{children}</div>
		</div>
	);
};
export default Detail;
