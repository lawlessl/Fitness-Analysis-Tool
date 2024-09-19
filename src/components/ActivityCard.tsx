import { Box, HStack, Link, Text, useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import { forwardRef } from 'react';
import useFetchSingleActivity from '../hooks/useFetchSingleActivity';
import { getAllRecords } from '../utils/AnalysisUtils';
import { convertSecondsToTime, timestampToDateStr } from '../utils/DateTime';
import { default as MapComponent } from './MapTile';

interface ActivityCardProps {
	id: string;
	fileName: string;
	baseFileName: string;
}

const ActivityCard = forwardRef<HTMLDivElement, ActivityCardProps>(({ id, baseFileName }, ref) => {
	const cardWidth = useBreakpointValue({ base: '100%', md: '40%' });
	const { activity, loading, error } = useFetchSingleActivity(id);
	const bgColor = useColorModeValue('#ffffff', '#141414');

	if (loading) {
		return <Text>Loading...</Text>; // Show a loading state
	}

	if (error) {
		return <Text color="red.500">Error: {error}</Text>; // Show an error message
	}

	if (!activity) {
		return <Text>No activity found</Text>; // Show a message if activity is not found
	}

	// Define the activity session which provides totals, averages, and maximums
	const session = activity.parsedData.activity.sessions?.[0];
	const events = activity.parsedData.activity.events;

	const totalDistanceKm = session.total_distance; // Total distance traveled during activity
	const activityDate = events[0].timestamp;

	const records = getAllRecords(activity);

	return (
		<Box
			ref={ref}
			width={cardWidth}
			borderWidth="1px"
			borderRadius="md"
			overflow="hidden"
			padding="4"
			boxShadow="sm"
			marginBottom="1"
			textAlign="center"
			backgroundColor={bgColor}
		>
			<Box pl={1} pb={4}>
				<Text align={'left'}>
					<Link href={`/activity/${id}`} _hover={{ textDecoration: 'none' }} fontWeight={'bold'} fontSize={'xl'}>
						{baseFileName}
					</Link>
				</Text>
				<Text fontSize={'xs'} align={'left'} color={'dark gray'}>
					{timestampToDateStr(activityDate)}
				</Text>
				<HStack h={'50px'} spacing={7} direction={'row'} align={'center'} justify="center" mt={2}>
					<Box>
						<Text fontSize={'sm'}>Distance</Text>
						<Text>{totalDistanceKm.toFixed(2)}mi</Text>
					</Box>
					<Box width="1px" height="100%" bg="gray.200" mx={2} />
					{/* {session.avg_power ? (
						<>
							<Box>
								<Text fontSize={'sm'}>Avg Power</Text>
								<Text>{session.avg_power}</Text>
							</Box>
							<Box width="1px" height="100%" bg="gray.200" mx={2} />
						</>
					) : null} */}
					<Box>
						<Text fontSize="sm">Elapsed Time</Text>
						<Text>{convertSecondsToTime(session.total_elapsed_time)}</Text>
					</Box>
					<Box width="1px" height="100%" bg="gray.200" mx={2} />
					<Box>
						<Text fontSize="sm">Moving Time</Text>
						<Text>{convertSecondsToTime(session.total_timer_time)}</Text>
					</Box>
				</HStack>
			</Box>
			<MapComponent records={records} />
		</Box>
	);
});

ActivityCard.displayName = 'ActivityCard'; // Helps with debugging

export default ActivityCard;
