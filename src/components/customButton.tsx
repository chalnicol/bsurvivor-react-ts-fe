import { useCallback } from "react";
import type { ColorType } from "../data/adminData";

interface CustomButtonProps {
	label: string;
	size?: "sm" | "lg" | "xl";
	color?: ColorType;
	onClick: () => void;
	className?: string;
	disabled?: boolean;
}
const CustomButton = ({
	className,
	size,
	color,
	disabled,
	label,
	onClick,
}: CustomButtonProps) => {
	const clrClass = useCallback((): string => {
		const btnClr = color ? color : "gray";
		if (disabled) {
			return `bg-gray-400 opacity-40`;
		}
		if (btnClr == "sky") {
			return `bg-sky-500 hover:bg-sky-400 cursor-pointer`;
		}
		if (btnClr == "green") {
			return `bg-green-500 hover:bg-green-400 cursor-pointer`;
		}
		if (btnClr == "red") {
			return `bg-red-500 hover:bg-red-400 cursor-pointer`;
		}
		if (btnClr == "yellow") {
			return `bg-yellow-500 hover:bg-yellow-400 cursor-pointer`;
		}
		if (btnClr == "blue") {
			return `bg-blue-500 hover:bg-blue-400 cursor-pointer`;
		}
		if (btnClr == "teal") {
			return `bg-teal-500 hover:bg-teal-400 cursor-pointer`;
		}
		if (btnClr == "amber") {
			return `bg-amber-500 hover:bg-amber-400 cursor-pointer`;
		}

		return `bg-gray-500 hover:bg-gray-400 cursor-pointer`;
	}, [color, disabled]);

	const sizeClass = useCallback((): string => {
		switch (size) {
			case "sm":
				return "text-xs px-2 py-0.5";
			case "lg":
				return "text-lg px-4 py-2";
			case "xl":
				return "text-xl px-6 py-3";
			default:
				return "text-sm px-3 py-1";
		}
	}, [size]);

	if (disabled) {
		return (
			<p
				className={`inline-block select-none text-white font-bold rounded ${clrClass()} ${sizeClass()} ${className}`}
			>
				{label}
			</p>
		);
	}

	return (
		<button
			className={`text-white font-bold rounded ${clrClass()} ${sizeClass()} ${className}`}
			onClick={onClick}
		>
			{label}
		</button>
	);
};
export default CustomButton;
