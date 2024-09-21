import {
	Box,
	HStack,
	Link,
	Stat,
	StatLabel,
	StatNumber,
	Text,
	useBreakpointValue,
	useColorModeValue,
} from '@chakra-ui/react';
import { Bicycle, SneakerMove } from '@phosphor-icons/react';
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
	console.log(activity);
	const session = activity.parsedData.activity.sessions?.[0];
	const events = activity.parsedData.activity.events;

	const totalDistance = session.total_distance;
	const activitySport = session.sport;
	const activitySubSport = session.sub_sport;
	const activityDate = events[0].timestamp;

	const records = getAllRecords(activity);

	// Determine the icon based on the sport
	const getSportIcon = (sport: string, subSport: string) => {
		if (sport === 'cycling' && subSport === 'road') {
			return <Bicycle size={24} />;
		} else if (sport === 'running') {
			return <SneakerMove size={24} />;
		}
		return null;
	};

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
			minW={'400px'}
			position="relative" // Add relative positioning for the icon
		>
			<Box position="absolute" top="4" right="4">
				{getSportIcon(activitySport, activitySubSport)}
			</Box>
			<Box pl={1} pb={4}>
				<Text align={'left'}>
					<Link href={`/activity/${id}`} _hover={{ textDecoration: 'none' }} fontWeight={'bold'} fontSize={'xl'}>
						{baseFileName}
					</Link>
				</Text>
				<Text fontSize={'xs'} align={'left'} color={'dark gray'}>
					{timestampToDateStr(activityDate)}
				</Text>
				<HStack h={'50px'} spacing={4} direction={'row'} align={'center'} justify="center" mt={2}>
					<Stat>
						<StatNumber fontSize={'xl'}>{totalDistance.toFixed(2)}mi</StatNumber>
						<StatLabel fontSize={'xs'} color={'#5e5e5e'}>
							Distance
						</StatLabel>
					</Stat>
					<Box width="1px" height="100%" bg="gray.200" mx={2} />
					<Stat>
						<StatNumber fontSize={'xl'}>{convertSecondsToTime(session.total_elapsed_time)}</StatNumber>
						<StatLabel fontSize={'xs'} color={'#5e5e5e'}>
							Elapsed Time
						</StatLabel>
					</Stat>
					<Box width="1px" height="100%" bg="gray.200" mx={2} />
					<Stat>
						<StatNumber fontSize={'xl'}>{convertSecondsToTime(session.total_timer_time)}</StatNumber>
						<StatLabel fontSize={'xs'} color={'#5e5e5e'}>
							Moving Time
						</StatLabel>
					</Stat>
				</HStack>
			</Box>
			<MapComponent records={records} />
		</Box>
	);
});

ActivityCard.displayName = 'ActivityCard'; // Helps with debugging

export default ActivityCard;
