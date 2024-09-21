// ActivityDetailPage.tsx
//import { Box, Button, Divider, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import {
	Box,
	Button,
	Divider,
	Flex,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import ActivitySummary from '../components/ActivitySummary';
import AnalysisComponent from '../components/Charts/AnalysisComponent';
import Layout from '../components/Layout/Layout';
import useFetchSingleActivity from '../hooks/useFetchSingleActivity';
import {
	combineLatLng,
	fillUndefinedValues,
	getAllRecords,
	smoothArray,
	speedToPaceDecimal,
} from '../utils/AnalysisUtils';

interface MetricData {
	values: number[];
	color: string;
	unit: string;
}

const AnalysisPage: React.FC = () => {
	const { activityId } = useParams<{ activityId: string }>();
	const { activity, loading, error } = useFetchSingleActivity(activityId);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const navigate = useNavigate();

	const chartBorderColors = useColorModeValue('#dfdfe8', '#000000');

	if (loading) {
		return <Text>Loading...</Text>; // Show a loading state
	}

	if (error) {
		return <Text color="red.500">Error: {error}</Text>; // Show an error message
	}

	if (!activity) {
		return <Text>No activity found</Text>; // Show a message if activity is not found
	}

	// Function to check if a records array has valid data
	const hasValidData = (arr: number[]) => arr.length > 0 && arr.some((value) => value !== undefined && value !== null);

	const records = getAllRecords(activity);
	const latitudes = fillUndefinedValues(records.map((record) => record.position_lat));
	const longitudes = fillUndefinedValues(records.map((record) => record.position_long));
	const positions = combineLatLng(latitudes, longitudes);
	const sportType = activity.parsedData.activity.sessions[0].sport;

	// Need to convert speed first so any undefined values are cleaned up
	const speed = fillUndefinedValues(records.map((record) => record.speed));
	const paceDecimal = speed.map((value) => speedToPaceDecimal(value));
	const smoothPaceDecimal = smoothArray(paceDecimal, 20); // Smooth mile pace by 20 seconds, reduces spikes

	// Build the data object dynamically
	const data: Record<string, MetricData> = {};

	console.log(activity);

	// Define all metrics here
	const metrics: Record<string, MetricData> = {
		Distance: {
			values: fillUndefinedValues(records.map((record) => record.distance)),
			color: 'orange',
			unit: 'none,',
		},
		Altitude: {
			values: fillUndefinedValues(records.map((record) => record.altitude * 5280)),
			color: 'gray',
			unit: 'ft',
		},
		Pace: {
			values: smoothPaceDecimal,
			color: '#34ace4',
			unit: '/mi',
		},
		Speed: {
			values: fillUndefinedValues(records.map((record) => record.speed)),
			color: 'blue',
			unit: 'mph',
		},
		Power: {
			values: fillUndefinedValues(records.map((record) => record.power)),
			color: 'purple',
			unit: 'W',
		},
		Heartrate: {
			values: fillUndefinedValues(records.map((record) => record.heart_rate)),
			color: 'red',
			unit: 'bpm',
		},
		Cadence: {
			values: fillUndefinedValues(records.map((record) => record.cadence)),
			color: '#ee4af2',
			unit: 'rpm',
		},
		Temp: {
			values: fillUndefinedValues(records.map((record) => record.temperature)),
			color: '#c9a678',
			unit: '°F',
		},
	};

	// Iterate over the metrics and only include the ones with populated values
	for (const key in metrics) {
		if (hasValidData(metrics[key].values)) {
			if (key === 'Pace' && sportType === 'running') {
				data.Pace = metrics.Pace;
			} else if (key === 'Pace' && sportType !== 'running') {
				continue;
			} else {
				data[key] = metrics[key];
			}
		}
	}

	const brickHeight = 120; // Height of each individual metric chart

	return (
		<>
			<Layout>
				<Flex direction={'column'} align={'center'}>
					<Flex w="75vw" direction={'column'} backgroundColor={'#ffffff'} mb={5}>
						{/* Activity menu bar */}
						<Box
							h={'45px'}
							backgroundColor={'#f7f7fa'}
							borderColor={'#dfdfe8'}
							borderWidth={1}
							borderBottom={'0px'}
							fontSize={'xl'}
							pl={4}
							display={'flex'}
							alignItems={'center'}
							justifyContent="space-between"
						>
							{activity.baseFileName}
							<Menu>
								<MenuButton
									as={IconButton}
									aria-label="Options"
									icon={<FiMoreHorizontal size={'1.5em'} />}
									variant="ghost"
									_hover={{ backgroundColor: 'transparent', color: 'gray.600', border: '1px solid transparent' }}
									_focus={{ boxShadow: 'none', outline: 'none' }}
								/>
								<MenuList>
									<MenuItem
										onClick={onOpen}
										_hover={{ backgroundColor: 'gray.100', border: '1px solid transparent' }}
										_focus={{ boxShadow: 'none', outline: 'none' }}
									>
										Delete Activity
									</MenuItem>
								</MenuList>
							</Menu>
						</Box>
						{/* Activity Summary */}
						<ActivitySummary activity={activity} />
					</Flex>

					{/* Confirmation Modal */}
					<Modal isOpen={isOpen} onClose={onClose}>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>Delete Activity</ModalHeader>
							<ModalCloseButton />
							<ModalBody>Are you sure you want to delete this activity? This action cannot be undone.</ModalBody>
							<ModalFooter>
								<Button variant="ghost" onClick={onClose} mr={3}>
									Cancel
								</Button>
								{/* <Button colorScheme="red" onClick={handleDelete} isLoading={deleting} loadingText="Deleting">
									OK
								</Button> */}
							</ModalFooter>
						</ModalContent>
					</Modal>

					{/* Interactive map and metrics area charts */}
					<Box w="75vw" h="100%" borderColor={chartBorderColors} borderWidth={1} backgroundColor={'#ffffff'} mb={5}>
						<AnalysisComponent data={data} brickHeight={brickHeight} latlng={positions} />
					</Box>
					<Divider />
					<Flex w={'100vw'} pl={4}>
						<Button mt={5} mb={5} onClick={() => navigate('/')} justifyContent={'flex-start'}>
							Return Home
						</Button>
					</Flex>
				</Flex>
			</Layout>
		</>
	);
};

export default AnalysisPage;
