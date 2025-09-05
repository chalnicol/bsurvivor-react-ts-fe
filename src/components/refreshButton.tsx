import { useEffect, useState } from "react";
import CustomButton from "./customButton";
import type { ColorType } from "../data/adminData";

interface RefreshButtonProps {
	label: string;
	delay?: number;
	size?: "sm" | "lg" | "xl";
	color?: ColorType;
	onClick: () => void;
	disabled?: boolean;
	className?: string;
}
const RefreshButton = ({
	label,
	delay,
	color,
	size,
	className,
	disabled,
	onClick,
}: RefreshButtonProps) => {
	const [isDisabled, setIsDisabled] = useState<boolean>(false);

	const timeDelay = delay ? delay : 10;

	const addedProps = { label, className, size, color };

	useEffect(() => {
		let timer: number;
		if (isDisabled) {
			timer = setTimeout(() => setIsDisabled(false), timeDelay * 1000);
		}
		return () => {
			clearTimeout(timer);
		};
	}, [isDisabled]);

	const handleClick = () => {
		onClick();
		setIsDisabled(true);
	};

	return (
		<CustomButton
			{...addedProps}
			onClick={handleClick}
			disabled={disabled || isDisabled}
		/>
	);
};
export default RefreshButton;
