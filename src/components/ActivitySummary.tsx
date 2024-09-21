import {
	Box,
	Divider,
	Grid,
	GridItem,
	Stat,
	StatLabel,
	StatNumber,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import { ActivityInterface } from '../interfaces/ActivityData';
import {
	calculateTotalElevationGain,
	fillUndefinedValues,
	getAllRecords,
	roundToDecimal,
} from '../utils/AnalysisUtils';
import { convertSecondsToHHMMSS } from '../utils/DateTime';

interface ActivitySummaryProps {
	activity: ActivityInterface;
}

// This component is a placeholder for the activity summary section of the activity detail page.
// Legitimate data will be parsed from the data component and populated in the grid. This is a work in progress.
const ActivitySummary: React.FC<ActivitySummaryProps> = ({ activity }) => {
	const sessions = activity.parsedData.activity.sessions[0];
	const records = getAllRecords(activity);
	const altitude = fillUndefinedValues(records.map((record) => record.altitude * 5280));
	const totatlElevationGain = roundToDecimal(calculateTotalElevationGain(altitude), 0);

	return (
		<Box borderColor={'#dfdfe8'} borderWidth={1}>
			<Grid templateColumns="repeat(4, 1fr)" gap={10} p={2} pl={5} display={'flex'} justifyContent={'left'}>
				<GridItem>
					<Stat>
						<StatNumber display={'flex'} justifyContent={'center'} fontWeight={'normal'}>
							{roundToDecimal(sessions.total_distance, 2)} mi
						</StatNumber>
						<StatLabel display={'flex'} justifyContent={'center'} fontSize={'xs'} color={'#82828b'}>
							Distance
						</StatLabel>
					</Stat>
				</GridItem>
				<GridItem>
					<Stat>
						<StatNumber display={'flex'} justifyContent={'center'} fontWeight={'normal'}>
							{convertSecondsToHHMMSS(sessions.total_timer_time)}
						</StatNumber>
						<StatLabel display={'flex'} justifyContent={'center'} fontSize={'xs'} color={'#82828b'}>
							Moving Time
						</StatLabel>
					</Stat>
				</GridItem>
				<GridItem>
					<Stat>
						<StatNumber display={'flex'} justifyContent={'center'} fontWeight={'normal'}>
							{totatlElevationGain} ft
						</StatNumber>
						<StatLabel display={'flex'} justifyContent={'center'} fontSize={'xs'} color={'#82828b'}>
							Total Ascent
						</StatLabel>
					</Stat>
				</GridItem>
				<GridItem>
					<Stat>
						<StatNumber display={'flex'} justifyContent={'center'} fontWeight={'normal'}>
							TBD
						</StatNumber>
						<StatLabel display={'flex'} justifyContent={'center'} fontSize={'xs'} color={'#82828b'}>
							Relative Effort
						</StatLabel>
					</Stat>
				</GridItem>
			</Grid>
			<Divider borderColor={'#2589fb'} />
			<Grid
				templateColumns="repeat(4, 1fr)"
				gap={10}
				p={2}
				pl={5}
				backgroundColor={'#f7f7fa'}
				display={'flex'}
				justifyContent={'left'}
			>
				{sessions.normalized_power ? (
					<GridItem>
						<Stat>
							<StatNumber display={'flex'} justifyContent={'center'} fontWeight={'normal'}>
								{sessions.normalized_power}
							</StatNumber>
							<StatLabel display={'flex'} justifyContent={'center'} fontSize={'xs'} color={'#82828b'}>
								NP
							</StatLabel>
						</Stat>
					</GridItem>
				) : null}
				{sessions.total_work ? (
					<GridItem>
						<Stat>
							<StatNumber display={'flex'} justifyContent={'center'} fontWeight={'normal'}>
								{roundToDecimal(sessions.total_work / 1000, 0)} kJ
							</StatNumber>
							<StatLabel display={'flex'} justifyContent={'center'} fontSize={'xs'} color={'#82828b'}>
								Work
							</StatLabel>
						</Stat>
					</GridItem>
				) : null}
				<GridItem>
					<Stat>
						<StatNumber display={'flex'} justifyContent={'center'} fontWeight={'normal'}>
							TBD
						</StatNumber>
						<StatLabel display={'flex'} justifyContent={'center'} fontSize={'xs'} color={'#82828b'}>
							Training Load
						</StatLabel>
					</Stat>
				</GridItem>
				{sessions.normalized_power ? (
					<GridItem>
						<Stat>
							<StatNumber display={'flex'} justifyContent={'center'} fontWeight={'normal'}>
								{roundToDecimal((sessions.normalized_power / sessions.threshold_power) * 100, 0)}%
							</StatNumber>
							<StatLabel display={'flex'} justifyContent={'center'} fontSize={'xs'} color={'#82828b'}>
								Intensity
							</StatLabel>
						</Stat>
					</GridItem>
				) : null}
			</Grid>
			<Grid
				templateColumns="repeat(5, 1fr)"
				gap={10}
				p={2}
				pl={5}
				backgroundColor={'#f7f7fa'}
				display={'flex'}
				justifyContent={'left'}
			>
				{sessions.intensity_factor ? (
					<GridItem>
						<Stat>
							<StatNumber display={'flex'} justifyContent={'center'} fontWeight={'normal'}>
								{sessions.intensity_factor}
							</StatNumber>
							<StatLabel display={'flex'} justifyContent={'center'} fontSize={'xs'} color={'#82828b'}>
								IF
							</StatLabel>
						</Stat>
					</GridItem>
				) : null}
				{sessions.training_stress_score ? (
					<GridItem>
						<Stat>
							<StatNumber display={'flex'} justifyContent={'center'} fontWeight={'normal'}>
								{sessions.training_stress_score}
							</StatNumber>
							<StatLabel display={'flex'} justifyContent={'center'} fontSize={'xs'} color={'#82828b'}>
								TSS
							</StatLabel>
						</Stat>
					</GridItem>
				) : null}
				{sessions.threshold_power ? (
					<GridItem>
						<Stat>
							<StatNumber display={'flex'} justifyContent={'center'} fontWeight={'normal'}>
								{sessions.threshold_power}
							</StatNumber>
							<StatLabel display={'flex'} justifyContent={'center'} fontSize={'xs'} color={'#82828b'}>
								FTP
							</StatLabel>
						</Stat>
					</GridItem>
				) : null}
				{activity.parsedData.user_profile.weight ? (
					<GridItem>
						<Stat>
							<StatNumber display={'flex'} justifyContent={'center'} fontWeight={'normal'}>
								{roundToDecimal(activity.parsedData.user_profile.weight * 2.2046, 0)} lbs
							</StatNumber>
							<StatLabel display={'flex'} justifyContent={'center'} fontSize={'xs'} color={'#82828b'}>
								Weight
							</StatLabel>
						</Stat>
					</GridItem>
				) : null}
				{sessions.total_calories ? (
					<GridItem>
						<Stat>
							<StatNumber display={'flex'} justifyContent={'center'} fontWeight={'normal'}>
								{sessions.total_calories}
							</StatNumber>
							<StatLabel display={'flex'} justifyContent={'center'} fontSize={'xs'} color={'#82828b'}>
								kcal
							</StatLabel>
						</Stat>
					</GridItem>
				) : null}
			</Grid>
			<Divider borderColor={'#2589fb'} />
			<Table variant="unstyled" size="md" display={'flow'}>
				<Thead>
					<Tr>
						<Th></Th>
						<Th textAlign="center" fontSize={'14'}>
							Avg
						</Th>
						<Th textAlign="center" fontSize={'14'}>
							Max
						</Th>
					</Tr>
				</Thead>
				<Tbody>
					<Tr>
						<Td p={2}>Speed</Td>
						<Td textAlign="center" p={2}>
							{roundToDecimal(sessions.avg_speed, 1)} mi/h
						</Td>
						<Td textAlign="center" p={2}>
							{roundToDecimal(sessions.max_speed, 1)} mi/h
						</Td>
					</Tr>
					{sessions.avg_heart_rate ? (
						<Tr>
							<Td p={2}>Heart Rate</Td>
							<Td textAlign="center" p={2}>
								{sessions.avg_heart_rate} bpm
							</Td>
							<Td textAlign="center" p={2}>
								{sessions.max_heart_rate} bpm
							</Td>
						</Tr>
					) : null}
					{sessions.avg_cadence ? (
						<Tr>
							<Td p={2}>Cadence</Td>
							<Td textAlign="center" p={2}>
								{sessions.avg_cadence} rpm
							</Td>
							<Td textAlign="center" p={2}>
								{sessions.max_cadence} rpm
							</Td>
						</Tr>
					) : null}
					{sessions.avg_power ? (
						<Tr>
							<Td p={2}>Power</Td>
							<Td textAlign="center" p={2}>
								{sessions.avg_power} W
							</Td>
							<Td textAlign="center" p={2}>
								{sessions.max_power} W
							</Td>
						</Tr>
					) : null}
					{sessions.total_calories ? (
						<Tr>
							<Td p={2}>Calories</Td>
							<Td textAlign="center" p={2}>
								{sessions.total_calories} kcal
							</Td>
						</Tr>
					) : null}
					{sessions.avg_temperature ? (
						<Tr>
							<Td p={2}>Temperature</Td>
							<Td textAlign="center" p={2}>
								{roundToDecimal(sessions.avg_temperature, 0)}°F
							</Td>
						</Tr>
					) : null}
					<Tr>
						<Td p={2}>Elapsed Time</Td>
						<Td textAlign="center" p={2}>
							{convertSecondsToHHMMSS(sessions.total_elapsed_time)}
						</Td>
					</Tr>
				</Tbody>
			</Table>
		</Box>
	);
};

export default ActivitySummary;
