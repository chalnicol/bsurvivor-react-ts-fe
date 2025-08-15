import { Link } from "react-router-dom";

interface FailPromptProps {
	message: string;
}
const FailPrompt = ({ message }: FailPromptProps) => {
	return (
		<div className="bg-gray-300 rounded h-34 flex flex-col justify-center items-center space-y-3">
			<div className="font-medium">{message}</div>
			<Link
				to="/"
				className="font-bold px-3 py-2 rounded bg-gray-500 text-white w-30 text-center hover:bg-gray-400"
			>
				HOME
			</Link>
		</div>
	);
};

export default FailPrompt;
