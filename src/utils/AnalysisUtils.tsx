import { LatLngTuple } from 'leaflet';
import { ActivityInterface, Laps, Sessions } from '../interfaces/ActivityData';

/**
 * Flattens the laps object in the activity data to get all records.
 *
 * @param activity - The activity data object.
 * @returns An array of all records in the activity.
 */
export const getAllRecords = (activity: ActivityInterface) => {
	return activity.parsedData.activity.sessions.flatMap((session: Sessions) =>
		session.laps.flatMap((lap: Laps) => lap.records)
	);
};

/**
 * Replaces undefined values with the average of the closest integer on either side of the
 * undefined value to maintain record array size
 *
 * @param arr - The array of numbers to fill.
 * @returns A new array with undefined values replaced by the average of the nearest defined values.
 */
export const fillUndefinedValues = (arr: (number | undefined)[]) => {
	// @ts-expect-error This should be typed to number[]
	const result: number[] = [...arr];

	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === undefined) {
			let prevIndex = i - 1;
			let nextIndex = i + 1;

			// Find nearest defined value before
			while (prevIndex >= 0 && arr[prevIndex] === undefined) {
				prevIndex--;
			}

			// Find nearest defined value after
			while (nextIndex < arr.length && arr[nextIndex] === undefined) {
				nextIndex++;
			}

			const prevValue = prevIndex >= 0 ? arr[prevIndex] : undefined;
			const nextValue = nextIndex < arr.length ? arr[nextIndex] : undefined;

			if (prevValue !== undefined && nextValue !== undefined) {
				result[i] = (prevValue + nextValue) / 2;
			} else if (prevValue !== undefined) {
				result[i] = prevValue;
			} else if (nextValue !== undefined) {
				result[i] = nextValue;
			}
		}
	}

	return result;
};

/**
 * Combines latitude and longitude arrays into an array of LatLngTuple objects.
 *
 * @param latitudes Array of latitude values.
 * @param longitudes Array of longitude values.
 * @returns An array of LatLngTuple objects.
 */
export function combineLatLng(latitudes: number[], longitudes: number[]): LatLngTuple[] {
	if (latitudes.length !== longitudes.length) {
		throw new Error('Latitudes and longitudes arrays must have the same length.');
	}

	const latLngTuples: LatLngTuple[] = latitudes.map((lat, index) => {
		const lng = longitudes[index];
		return [lat, lng] as LatLngTuple;
	});

	return latLngTuples;
}

/**
 * Rounds a number to a specified number of decimal places.
 * If the input is undefined, returns '---'.
 *
 * @param value - The number to round, or undefined.
 * @param decimals - The number of decimal places to round to.
 * @returns The rounded number as a string or '---' if the input is undefined.
 */
export function roundToDecimal(value: number | undefined | null, decimals: number): string {
	if (value === undefined || value === null) {
		return '---';
	}

	// Ensure the decimals parameter is a non-negative integer
	const factor = Math.pow(10, decimals);
	return (Math.round(value * factor) / factor).toFixed(decimals);
}

/**
 * Converts speed in mph to pace in minutes per mile as a decimal value.
 *
 * @param speed - Speed in mph.
 * @returns - Pace in minutes per mile.
 */
export function speedToPaceDecimal(speed: number): number {
	const MIN_SPEED_THRESHOLD = 1; // Minimum threshold for speed
	const DEFAULT_PACE = 45; // Default pace for very low speeds (in decimal minutes per mile)

	if (speed <= MIN_SPEED_THRESHOLD) {
		return DEFAULT_PACE;
	}
	return 60 / speed; // Converts speed to pace in minutes per mile
}

/**
 * Converts a pace in decimal minutes to a string in mm:ss format.
 *
 * @param decimalMinutes - Pace in decimal minutes (e.g., 4.25 for 4 minutes 15 seconds).
 * @returns A string representing the pace in mm:ss format.
 */
export function decimalToPace(decimalMinutes: number): string {
	const minutes = Math.floor(decimalMinutes);
	const seconds = Math.round((decimalMinutes - minutes) * 60);
	const formattedSeconds = seconds.toString().padStart(2, '0');

	// Return formatted string
	return `${minutes}:${formattedSeconds}`;
}

/**
 * Formats the StatNumber value based on given metric. e.g. Speed, Pace, Power, etc.
 *
 * @param key The metric key.
 * @param value The metric value.
 * @returns The metric value formatted appropriately for better viewing.
 */
export const formatStatNumber = (key: string, value: number | undefined | null): string => {
	if (value === undefined || value === null) return '---'; // Handle undefined case

	switch (key) {
		case 'Speed':
			return roundToDecimal(value, 1);
		case 'Pace':
			return decimalToPace(Number(roundToDecimal(value, 2))); // Ensure pace is handled properly
		default:
			return roundToDecimal(value, 0); // Default case
	}
};

/**
 * Smooths an array of integers over a given range of seconds (window size).
 * Each index in the array represents 1 second.
 *
 * @param data - The array of integers to smooth.
 * @param rangeInSeconds - The number of seconds (window size) over which to smooth the data.
 * @returns A new array where each value is the average of the values in the range.
 */
export const smoothArray = (data: number[], rangeInSeconds: number): number[] => {
	if (rangeInSeconds <= 1) return data; // No smoothing if range is less than or equal to 1

	const smoothedData = [];
	const halfWindow = Math.floor(rangeInSeconds / 2);

	for (let i = 0; i < data.length; i++) {
		let sum = 0;
		let count = 0;

		// Calculate the average over the window centered on the current index
		for (let j = i - halfWindow; j <= i + halfWindow; j++) {
			if (j >= 0 && j < data.length) {
				sum += data[j];
				count++;
			}
		}

		smoothedData.push(sum / count);
	}

	return smoothedData;
};

/**
 * Calculates the total elevation gain from the altitude data in the workout.
 *
 * @param altitude - The altitude data from the workout.
 * @returns The total elevation gain in feet.
 */
export const calculateTotalElevationGain = (altitude: number[]): number => {
	let totalElevationGain = 0;
	let previousAltitude = altitude[0]; // Initialize with the first altitude value

	for (let i = 1; i < altitude.length; i++) {
		const currentAltitude = altitude[i];

		if (currentAltitude > previousAltitude) {
			totalElevationGain += currentAltitude - previousAltitude;
		}

		previousAltitude = currentAltitude; // Update for the next iteration
	}

	return totalElevationGain;
};

/**
 * Calculates the maximum average of a subarray of length `n` in an array of numbers.
 *
 * @param nums Array of numbers.
 * @param n Length of the subarray.
 * @returns An object containing the maximum average and the segment that produced it.
 */
export function maxAverageSubarray(nums: number[], n: number): { average: number; segment: number[] } | null {
	if (nums.length < n) {
		return null; // Not enough elements
	}

	// Calculate the sum of the first `n` elements
	let currentSum = 0;
	for (let i = 0; i < n; i++) {
		currentSum += nums[i];
	}

	let maxSum = currentSum;
	let startIndex = 0;

	// Slide the window across the array
	for (let i = n; i < nums.length; i++) {
		currentSum += nums[i] - nums[i - n];
		if (currentSum > maxSum) {
			maxSum = currentSum;
			startIndex = i - n + 1;
		}
	}

	// Calculate the maximum average
	const maxAverage = maxSum / n;
	const segment = nums.slice(startIndex, startIndex + n);

	return { average: maxAverage, segment: segment };
}
