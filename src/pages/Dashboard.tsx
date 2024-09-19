// import { VStack } from '@chakra-ui/react';
// import React from 'react';
// import ActivityCard from '../components/ActivityCard';
// import Layout from '../components/Layout/Layout';
// import useFetchAllActivities from '../hooks/useFetchAllActivities';

// const Dashboard: React.FC = () => {
// 	const activities = useFetchAllActivities();

// 	return (
// 		<Layout>
// 			<VStack>
// 				{activities.map((activity) => {
// 					return (
// 						<ActivityCard
// 							key={activity.id}
// 							fileName={activity.fileName}
// 							baseFileName={activity.baseFileName}
// 							id={activity.id}
// 						/>
// 					);
// 				})}
// 			</VStack>
// 		</Layout>
// 	);
// };

// export default Dashboard;

// Dashboard.tsx
import { Button, Spinner, VStack } from '@chakra-ui/react';
import React from 'react';
import ActivityCard from '../components/ActivityCard';
import Layout from '../components/Layout/Layout';
import useFetchAllActivities from '../hooks/useFetchAllActivities';

const Dashboard: React.FC = () => {
	const { activities, fetchMoreActivities, hasMore, loading } = useFetchAllActivities();

	return (
		<Layout>
			<VStack spacing={2}>
				{activities.map((activity) => (
					<ActivityCard
						key={activity.id}
						fileName={activity.fileName}
						baseFileName={activity.baseFileName}
						id={activity.id}
					/>
				))}
				{loading && <Spinner size="lg" />} {/* Show loading spinner */}
				{hasMore && !loading && <Button onClick={fetchMoreActivities}>Load More Activities</Button>}
			</VStack>
		</Layout>
	);
};

export default Dashboard;
