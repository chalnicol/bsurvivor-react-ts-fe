export const formatNumberShorthand = (num: number): string => {
	if (num < 1000) {
		return num.toString();
	}

	const units = [
		{ value: 1e3, symbol: "K" }, // Thousand
		{ value: 1e6, symbol: "M" }, // Million
		{ value: 1e9, symbol: "B" }, // Billion
		{ value: 1e12, symbol: "T" }, // Trillion
	];

	const threshold = 0.9995; // Adjust this value to control rounding behavior

	for (let i = units.length - 1; i >= 0; i--) {
		const unit = units[i];
		if (num >= unit.value * threshold) {
			let formattedValue = (num / unit.value).toFixed(1);

			// Check for rounding up to the next unit
			if (parseFloat(formattedValue) >= 1000 && i < units.length - 1) {
				// If it rounds up to the next unit, use that unit instead
				const nextUnit = units[i + 1];
				formattedValue = (num / nextUnit.value).toFixed(1);
				return formattedValue.replace(/\.0+$/, "") + nextUnit.symbol;
			}

			return formattedValue.replace(/\.0+$/, "") + unit.symbol;
		}
	}

	return num.toString();
};
