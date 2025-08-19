import type { SlotModeType } from "../data/adminData";

export const getSlotBgClass = (mode: SlotModeType): string => {
	switch (mode) {
		case "correct":
			return "bg-green-700 border-green-600";
		case "incorrect":
			return "bg-red-800 border-red-700";
		case "selected":
			return "bg-yellow-600 border-yellow-500";
		case "void":
			return "bg-yellow-900 border-yellow-800";
		default:
			return "bg-gray-600 border-gray-500";
	}
};
