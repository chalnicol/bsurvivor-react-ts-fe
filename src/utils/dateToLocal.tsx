export const displayLocalDate = (dateString: string): string => {
	const utcMidnightDateString = dateString + "T00:00:00.000Z";

	const date = new Date(utcMidnightDateString);

	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};
