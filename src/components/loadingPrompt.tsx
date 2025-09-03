import { useEffect, useState } from "react";
import Icon from "./icon";

interface LoadingPromptProps {
	prompt?: string;
	className?: string;
}

const LoadingPrompt = ({ prompt, className }: LoadingPromptProps) => {
	const [ellipsis, setEllipsis] = useState<string>(".");
	useEffect(() => {
		let tmp = "";
		const timer = setInterval(() => {
			tmp += ".";
			setEllipsis(tmp);
			if (tmp.length > 3) {
				tmp = "";
			}
		}, 300);

		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<div
			className={`space-y-1 px-4 py-3 rounded-lg w-38 shadow bg-gray-900 border border-gray-700 ${className}`}
		>
			<Icon className="w-full object-contain mx-auto" />
			<div className="flex justify-center text-white font-semibold">
				<p>{prompt || "LOADING"}</p>
				<p className="w-4 text-left">{ellipsis}</p>
			</div>
		</div>
	);
};

export default LoadingPrompt;
