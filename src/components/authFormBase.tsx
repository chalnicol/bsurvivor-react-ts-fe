interface AuthFormBaseProps {
	children: React.ReactNode;
}
const AuthFormBase = ({ children }: AuthFormBaseProps) => {
	return (
		<div className="w-full h-[calc(100dvh-56px)] p-4 flex overflow-y-auto">
			{children}
		</div>
	);
};

export default AuthFormBase;
