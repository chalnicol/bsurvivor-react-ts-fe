import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
interface ToDeleteProps {
	name: string;
	onCancel: () => void;
	onConfirm: () => void;
}

gsap.registerPlugin(ScrollToPlugin);

const ToDelete = ({ name, onCancel, onConfirm }: ToDeleteProps) => {
	const containerRef = useRef<HTMLDivElement>(null);

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
					onComplete: onCancel,
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

	const handleResponse = (response: "cancel" | "confirm") => {
		if (response === "cancel") {
			closeAnim();
		} else if (response === "confirm") {
			onConfirm();
		}
	};

	useEffect(() => {
		openAnim();
		scrollAnim();

		// return () => {
		// 	if (containerRef.current) {
		// 		gsap.killTweensOf(containerRef.current);
		// 	}
		// };
	}, [name]);

	return (
		<div
			ref={containerRef}
			className="px-3 py-2 rounded border border-gray-300 shadow mt-2 text-sm bg-amber-200 md:flex items-center justify-between space-y-2 md:space-y-0"
		>
			<p className="">
				{name !== "" ? (
					<>Are you sure you want to delete "{name}"?</>
				) : (
					"Are you sure you want to delete?"
				)}
			</p>
			<div className="flex-none space-x-1 font-bold">
				<button
					className="px-2 py-1 rounded text-xs bg-gray-600 hover:bg-gray-500 text-white cursor-pointer"
					onClick={() => handleResponse("cancel")}
				>
					CANCEL
				</button>
				<button
					className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-500 text-white cursor-pointer"
					onClick={() => handleResponse("confirm")}
				>
					CONFIRM
				</button>
			</div>
		</div>
	);
};

export default ToDelete;
