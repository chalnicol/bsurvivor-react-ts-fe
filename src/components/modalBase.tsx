interface ModalBaseProps {
	children: React.ReactNode;
}
const ModalBase = ({ children }: ModalBaseProps) => {
	return (
		<div className="fixed left-0 bottom-0 w-full min-h-[calc(100dvh-56px)] z-10">
			<div className="absolute top-0 left-0 bg-gray-900 opacity-70 w-full h-full pointer-events-auto"></div>
			<div className="absolute top-0 left-0 flex items-center justify-center h-full w-full">
				{children}
			</div>
		</div>
	);
};
export default ModalBase;
