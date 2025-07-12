// src/components/Dropdown.tsx
import React, { useState } from "react";
import { useOutsideClick } from "../hooks/useOutsideClick"; // Adjust path if needed

interface DropdownProps {
	label: string;
	children: React.ReactNode;
	className?: string;
}

const Dropdown = ({ label, children, className }: DropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);

	// Use the custom hook, passing a callback to close the dropdown
	const dropdownRef = useOutsideClick<HTMLDivElement>(() => {
		if (isOpen) {
			// Only close if it's currently open
			setIsOpen(false);
		}
	});

	const handleButtonClick = () => {
		setIsOpen((prev) => !prev); // Toggle the dropdown state
	};

	const handleContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
		const target = event.target as HTMLElement;
		console.log("as", target);
		// // Check if the clicked element is an <a> tag or a <button>
		// // You can extend this to other interactive elements as needed
		// if (target.tagName === "A" || target.tagName === "BUTTON") {
		// 	setIsOpen(false);
		// }
		// Optional: If you also want to close when a specific data attribute is present
		if (target.hasAttribute("data-close-dropdown")) {
			setIsOpen(false);
		}
	};

	return (
		<div className={`relative ${className}`} ref={dropdownRef}>
			<button
				className="inline-flex items-center cursor-pointer "
				onClick={handleButtonClick}
			>
				{label}
				<svg
					className="w-2.5 h-2.5 ms-2.5"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 10 6"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m1 1 4 4 4-4"
					/>
				</svg>
			</button>

			{isOpen && (
				<div
					className="absolute bg-white rounded min-w-36 text-gray-600 mt-2 shadow-lg right-0 overflow-hidden"
					onClick={handleContentClick}
				>
					{children}
				</div>
			)}
		</div>
	);
};

export default Dropdown;
