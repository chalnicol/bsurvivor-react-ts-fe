export const displayLocalDate = (dateString: string): string => {
	const utcMidnightDateString = dateString + "T00:00:00.000Z";

	const date = new Date(utcMidnightDateString);

	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

// checkHasStarted: Determines if the current date is on or after the start date.
// Assumes dateString is in "YYYY-MM-DD" format.
export const checkHasStarted = (dateString: string): boolean => {
	// Create a Date object for the start of the specified day (in UTC)
	const startDate = new Date(dateString + "T00:00:00Z");
	// Get the current date at the start of the day for a fair comparison
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	// Has it started if today's date is on or after the start date?
	return today >= startDate;
};

// checkHasEnded: Determines if the current date is after the end date.
// Assumes dateString is in "YYYY-MM-DD" format.
export const checkHasEnded = (dateString: string): boolean => {
	// Create a Date object for the day *after* the specified end date
	const endDate = new Date(dateString + "T23:59:59Z");

	// Has it ended if the current time is after the end of the end date?
	const now = new Date();
	return now > endDate;
};

export const checkIsActive = (
	startDateString: string,
	endDateString: string
): boolean => {
	// Create Date objects for the start and end of the challenge period
	const startDate = new Date(startDateString + "T00:00:00Z");
	const endDate = new Date(endDateString + "T23:59:59Z");
	// Get the current date and time
	const now = new Date();
	// The challenge is active if the current time is on or after the start date
	// AND on or before the end date.
	return now >= startDate && now <= endDate;
};
