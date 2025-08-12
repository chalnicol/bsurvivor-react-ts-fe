interface MainContentBaseProps {
	children: React.ReactNode;
	className?: string;
}
const ContentBase = ({ children, className }: MainContentBaseProps) => {
	return (
		<div
			className={`relative min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-92px)] ${className}`}
		>
			{children}
		</div>
	);
};

export default ContentBase;
