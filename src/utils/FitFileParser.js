import FitParser from 'fit-file-parser';

// Function to parse a FIT file
const parseFitFile = (fileUint8Array) => {
	return new Promise((resolve, reject) => {
		const fitParser = new FitParser({
			force: true,
			speedUnit: 'mph',
			lengthUnit: 'mi',
			temperatureUnit: 'fahrenheit',
			elapsedRecordField: true,
			mode: 'cascade',
		});

		fitParser.parse(fileUint8Array.buffer, (error, data) => {
			if (error) {
				reject(error);
			} else {
				resolve(data);
			}
		});
	});
};

export default parseFitFile;
