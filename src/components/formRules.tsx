import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useOutsideClick } from "../hooks/useOutsideClick";

interface FormRulesProps {
	rules: string[];
	className?: string;
}
const FormRules = ({ rules, className }: FormRulesProps) => {
	const [showDialog, setShowDialog] = useState(false);

	const contRef = useRef<HTMLDivElement>(null);

	const parentRef = useOutsideClick<HTMLDivElement>(() => {
		// 2. Callback function: close the dropdown when an outside click occurs
		setShowDialog(false);
	});

	useEffect(() => {
		if (showDialog && contRef.current) {
			gsap.fromTo(
				contRef.current,
				{
					scale: 0,
				},
				{
					scale: 1,
					ease: "elastic.out(1, 0.6)",
					duration: 0.4,
					transformOrigin: "top left",
				}
			);
		}
		return () => {
			if (contRef.current) {
				gsap.killTweensOf(contRef.current);
			}
		};
	}, [showDialog]);

	return (
		<div ref={parentRef} className={`relative ${className}`}>
			<button
				type="button"
				className="cursor-pointer text-gray-800"
				onClick={() => setShowDialog((prev) => !prev)}
				tabIndex={-1}
			>
				<FontAwesomeIcon icon="circle-question" size="sm" />
			</button>
			{showDialog && (
				<div
					ref={contRef}
					className="z-10 px-4 py-2.5 rounded rounded border border-gray-400 font-semibold bg-gray-800/70 text-white top-full left-0 absolute shadow-lg overflow-hidden"
				>
					<ul className="list-disc text-xs list-inside text-left space-y-1 whitespace-nowrap min-w-47">
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
