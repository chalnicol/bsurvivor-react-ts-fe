import { useEffect, useRef } from "react";
import gsap from "gsap";

interface FormRulesProps {
	rules: string[];
	className?: string;
	isOpen: boolean;
	onClick: () => void;
}
const FormRules = ({ rules, isOpen, onClick, className }: FormRulesProps) => {
	const contRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen && contRef.current) {
			gsap.fromTo(
				contRef.current,
				{
					height: 0,
				},
				{ height: "auto", ease: "power4.out", duration: 0.2 }
			);
		}
		return () => {
			if (contRef.current) {
				gsap.killTweensOf(contRef.current);
			}
		};
	}, [isOpen]);

	return (
		<div className={`${className}`}>
			<button
				type="button"
				className="text-xs bg-gray-500 hover:bg-gray-400 mb-0.5 px-1.5 text-white font-bold cursor-pointer block"
				onClick={onClick}
			>
				{isOpen ? "HIDE RULES" : "VIEW RULES"}
			</button>
			{isOpen && (
				<div
					ref={contRef}
					className="px-3 py-1.5 rounded rounded border border-gray-400 bg-gray-100 overflow-hidden"
				>
					<ul className="list-disc text-xs list-inside text-left space-y-0.5">
						{rules.map((rule) => (
							<li key={rule}>{rule}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};
export default FormRules;
