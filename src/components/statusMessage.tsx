import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

interface StatusMessageProps {
	message: string;
	type?: string;
	onClose: () => void;
	fixed?: boolean;
	children?: React.ReactNode;
}

gsap.registerPlugin(ScrollToPlugin);

const StatusMessage = ({
	message,
	type,
	children,
	onClose,
	fixed,
}: StatusMessageProps) => {
	const containerRef = useRef<HTMLDivElement>(null);

	const bgClr = () => {
		switch (type) {
			case "success":
				return "bg-green-600";
			case "error":
				return "bg-red-600";
			default:
				return "bg-gray-600";
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

	const scrollAnim = () => {
		if (containerRef.current) {
			gsap.to(window, {
				scrollTo: { y: containerRef.current.offsetTop, offsetY: 10 },
				duration: 0.5,
				ease: "power4.out",
			});
		}
	};

	useEffect(() => {
		if (!message) return;

		openAnim();
		scrollAnim();
		let timer = fixed ? null : setTimeout(() => closeAnim(), 5000);

		return () => {
			if (timer) {
				clearTimeout(timer);
			}
			if (containerRef.current) {
				gsap.killTweensOf(containerRef.current);
			}
		};
	}, [message]);

	return (
		<div
			ref={containerRef}
			className={`w-full my-2 relative flex items-center justify-between gap-x-2 text-white font-semibold px-3 py-2 rounded ${bgClr()}`}
		>
			<div className="md:flex items-center w-full space-y-1 md:space-y-0">
				<p className="flex-1">{message}</p>
				{children}
			</div>
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
