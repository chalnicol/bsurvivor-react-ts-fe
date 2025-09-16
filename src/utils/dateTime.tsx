export const displayLocalDate = (dateString: string): string => {
	// const utcMidnightDateString = dateString + "T00:00:00.000Z";
	const date = new Date(dateString);

	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

// checkHasStarted: Determines if the current date is on or after the start date.
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

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export const getRelativeTime = (dateString: string) => {
	const date = new Date(dateString);
	const now = new Date();
	const seconds = Math.round((date.getTime() - now.getTime()) / 1000);
	const minutes = Math.round(seconds / 60);
	const hours = Math.round(minutes / 60);
	const days = Math.round(hours / 24);
	const weeks = Math.round(days / 7);
	const months = Math.round(days / 30.436875); // Average days in a month
	const years = Math.round(days / 365.25);

	if (Math.abs(seconds) < 60) return rtf.format(seconds, "second");
	if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
	if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
	if (Math.abs(days) < 7) return rtf.format(days, "day");
	if (Math.abs(weeks) < 4) return rtf.format(weeks, "week"); // Limit weeks for compactness
	if (Math.abs(months) < 12) return rtf.format(months, "month");
	return rtf.format(years, "year");
};

export const convertDateToFormFormat = (timestamp: string): string => {
	//const timestamp = "2025-09-16T00:00:00.000000Z";

	// Create a new Date object from the timestamp
	const date = new Date(timestamp);

	// Extract the year, month, and day
	const year = date.getFullYear();
	// Add 1 to get the correct month (Date.getMonth() is 0-indexed)
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");

	// Format the date into the required "yyyy-MM-dd" string
	return `${year}-${month}-${day}`;
};
