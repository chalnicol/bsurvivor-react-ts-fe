interface MainContentBaseProps {
	children: React.ReactNode;
	className?: string;
}
const ContentBase = ({ children, className }: MainContentBaseProps) => {
	return (
		<div className={`h-full max-w-7xl mx-auto ${className}`}>{children}</div>
	);
};

export default ContentBase;
