// DateTime.tsx
// DateTime related helper functions

export function convertSecondsToTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = Math.round(seconds % 60);

	const hoursDisplay = hours > 0 ? `${hours}h ` : '';
	const minutesDisplay = minutes > 0 ? `${minutes}m ` : '';

	// Only show seconds if time is less than 1 hour
	const secondsDisplay = hours === 0 ? `${remainingSeconds}s` : '';

	return (hoursDisplay + minutesDisplay + secondsDisplay).trim();
}

export function convertSecondsToHHMMSS(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = Math.round(seconds % 60);

	const hoursDisplay = hours > 0 ? (hours >= 10 ? `${hours}:` : `0${hours}:`) : '';
	const minutesDisplay = minutes > 0 ? (minutes >= 10 ? `${minutes}:` : `0${minutes}:`) : '';
	const secondsDisplay = remainingSeconds >= 10 ? `${remainingSeconds}` : `0${remainingSeconds}`;

	return (hoursDisplay + minutesDisplay + secondsDisplay).trim();
}

export function timestampToDateStr(timestamp: string): string {
	// Create a Date object from the ISO string
	const date = new Date(timestamp);

	// Format the date to a user-friendly string
	// Example format: "August 30, 2024, 10:15:30 AM"
	return date.toLocaleString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	});
}
