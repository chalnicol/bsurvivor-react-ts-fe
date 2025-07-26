interface ErrorDisplayProps {
	errors: string[];
}

const ErrorDisplay = ({ errors }: ErrorDisplayProps) => {
	return (
		<div className="text-red-500 text-xs mt-1.5">
			{errors.map((msg, i) => (
				<p key={i}>{msg}</p> // Render each error message for this field
			))}
		</div>
	);
};
export default ErrorDisplay;
