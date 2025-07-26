interface AdminThumbsProps {
	children: React.ReactNode;
	title: string;
	description: string;
	bgColor: string;
}
const AdminThumbs = ({
	children,
	title,
	description,
	bgColor,
}: AdminThumbsProps) => {
	// const backgroundClr: string = `bg-orange-100`;

	const backgroundClr = () => {
		switch (bgColor) {
			case "orange":
				return "bg-orange-100";
			case "blue":
				return "bg-blue-100";
			case "green":
				return "bg-green-100";
			case "yellow":
				return "bg-yellow-100";
			default:
				return "bg-gray-100";
		}
	};

	return (
		<div
			className={`p-3 border rounded-lg shadow border-gray-400 flex flex-col ${backgroundClr()}`}
		>
			<div>
				<h2 className="font-semibold">{title}</h2>
				<p className="text-sm text-gray-500">{description}</p>
			</div>

			<div className="flex-1"></div>
			<div className="mt-5 space-x-2">{children}</div>
		</div>
	);
};

export default AdminThumbs;
