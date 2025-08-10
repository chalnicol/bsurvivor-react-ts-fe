interface DetailProps {
	label: string;
	children: React.ReactNode;
}
const Detail = ({ label, children }: DetailProps) => {
	return (
		<div className="flex space-x-1.5">
			<div className="flex-none min-w-30 flex">
				<span className="flex-1">{label}</span>
				<span>:</span>
			</div>
			<div>{children}</div>
		</div>
	);
};
export default Detail;
