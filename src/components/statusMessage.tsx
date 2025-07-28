import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface StatusMessageProps {
	message: string;
	type?: string;
	onClose: () => void;
}

const StatusMessage = ({ message, type, onClose }: StatusMessageProps) => {
	const containerRef = useRef<HTMLDivElement>(null);

	const bgClr = () => {
		switch (type) {
			case "success":
				return "bg-green-600";
			case "error":
				return "bg-red-600";
			default:
				return "bg-green-600";
		}
	};

	const openAnim = () => {
		if (containerRef.current) {
			gsap.fromTo(
				containerRef.current,
				{ scaleY: 0 },
				{ scaleY: 1, duration: 0.3, ease: "elastic.out(1, 0.8)" }
			);
		}
	};

	const closeAnim = () => {
		if (containerRef.current) {
			gsap.fromTo(
				containerRef.current,
				{ scaleY: 1 },
				{
					scaleY: 0,
					duration: 0.3,
					ease: "elastic.in(1, 0.8)",
					onComplete: onClose,
				}
			);
		}
	};

	useEffect(() => {
		if (!message) return;

		openAnim();

		let timer = setTimeout(() => closeAnim(), 5000);

		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	}, [message]);

	return (
		<div
			ref={containerRef}
			className={`w-full my-2 relative flex justify-between items-center text-white font-semibold px-3 py-2 rounded ${bgClr()}`}
		>
			<p>{message}</p>
			<button
				className={`px-1 cursor-pointer  ${
					type == "success" ? "hover:bg-green-300" : "hover:bg-red-300"
				}`}
				onClick={closeAnim}
			>
				<FontAwesomeIcon icon="xmark" />
			</button>
		</div>
	);
};

export default StatusMessage;
