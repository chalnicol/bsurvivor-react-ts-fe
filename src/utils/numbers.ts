export const formatNumberShorthand = (num: number): string => {
	if (num < 1000) {
		return num.toString();
	}

	const si = [
		{ value: 1, symbol: "" },
		{ value: 1e3, symbol: "K" }, // Thousand
		{ value: 1e6, symbol: "M" }, // Million
		// You can extend this for B (billion), T (trillion) etc. if needed
		// { value: 1E9, symbol: "B" },
	];

	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	let i;
	for (i = si.length - 1; i > 0; i--) {
		if (num >= si[i].value) {
			break;
		}
	}

	// Calculate the value and format it to one decimal place if necessary
	const formattedValue = (num / si[i].value).toFixed(1).replace(rx, "$1");

	return formattedValue + si[i].symbol;
};
