interface ErrorDisplayProps {
	errors: string[];
}

const ErrorDisplay = ({ errors }: ErrorDisplayProps) => {
	return (
		<div className="text-red-500 text-xs mt-1.5">
			<ul className="list-inside space-y-0.5">
				{errors.map((msg, i) => (
					<li key={i}>{msg}</li> // Render each error message for this field
				))}
			</ul>
		</div>
	);
};
export default ErrorDisplay;
