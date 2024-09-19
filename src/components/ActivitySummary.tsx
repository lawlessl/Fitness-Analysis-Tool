import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Text } from '@chakra-ui/react';

interface MetricData {
	values: number[];
	color: string;
	unit: string;
}

interface ChartData {
	[key: string]: MetricData;
}

interface ActivitySummaryProps {
	data: ChartData;
}

// This component is a placeholder for the activity summary section of the activity detail page.
// Legitimate data will be parsed from the data component and populated in the grid. This is a work in progress.
const ActivitySummary: React.FC<ActivitySummaryProps> = ({ data }) => {
	return (
		<Box w={'100%'} p={6} bg="white" borderColor={'#dfdfe8'} borderWidth={1} m="auto">
			<Box mb={8} textAlign="center">
				<Heading size="lg" color="teal.600">
					Activity Summary (WIP)
				</Heading>
				<Text fontSize="md" color="gray.500">
					A breakdown of your activity performance
				</Text>
			</Box>

			<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
				{/* Performance Stats */}
				<Stat>
					<StatLabel>Average Speed</StatLabel>
					<StatNumber>20.5 mph</StatNumber>
				</Stat>

				<Stat>
					<StatLabel>Coasting Time</StatLabel>
					<StatNumber>45 minutes</StatNumber>
				</Stat>

				<Stat>
					<StatLabel>Vertical Ft Climbed</StatLabel>
					<StatNumber>2,300 ft</StatNumber>
				</Stat>

				{/* Heart Rate Stats */}
				<Stat>
					<StatLabel>Average Heart Rate</StatLabel>
					<StatNumber>135 bpm</StatNumber>
				</Stat>

				<Stat>
					<StatLabel>Max Heart Rate</StatLabel>
					<StatNumber>180 bpm</StatNumber>
				</Stat>

				<Stat>
					<StatLabel>Heart Rate Recovery</StatLabel>
					<StatNumber>25 bpm</StatNumber>
				</Stat>

				{/* Power & Cadence Stats */}
				<Stat>
					<StatLabel>Normalized Power</StatLabel>
					<StatNumber>220 W</StatNumber>
				</Stat>

				<Stat>
					<StatLabel>Average Power</StatLabel>
					<StatNumber>210 W</StatNumber>
				</Stat>

				<Stat>
					<StatLabel>Power Variability</StatLabel>
					<StatNumber>1.05</StatNumber>
				</Stat>

				<Stat>
					<StatLabel>Power/HR</StatLabel>
					<StatNumber>1.6</StatNumber>
				</Stat>

				<Stat>
					<StatLabel>Average Cadence</StatLabel>
					<StatNumber>85 rpm</StatNumber>
				</Stat>

				{/* Energy Stats */}
				<Stat>
					<StatLabel>Training Stress Score</StatLabel>
					<StatNumber>150 TSS</StatNumber>
				</Stat>

				<Stat>
					<StatLabel>Kilocalories Burned</StatLabel>
					<StatNumber>1,200 kcal</StatNumber>
				</Stat>

				<Stat>
					<StatLabel>Work (kJ)</StatLabel>
					<StatNumber>1,000 kJ</StatNumber>
				</Stat>

				{/* Fitness Metrics */}
				<Stat>
					<StatLabel>Fitness</StatLabel>
					<StatNumber>75</StatNumber>
				</Stat>

				<Stat>
					<StatLabel>Fatigue</StatLabel>
					<StatNumber>50</StatNumber>
				</Stat>

				<Stat>
					<StatLabel>Form</StatLabel>
					<StatNumber>25</StatNumber>
				</Stat>
			</SimpleGrid>
		</Box>
	);
};

export default ActivitySummary;
