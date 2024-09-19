//import { Link, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import React from 'react';
import Layout from '../components/Layout/Layout';
//import useFetchAllActivities from '../hooks/useFetchAllActivities';
import { Text } from '@chakra-ui/react';

const ActivityListPage: React.FC = () => {
	//const activities = useFetchAllActivities();

	return (
		<Layout>
			<Text>WIP</Text>
			{/* <Text fontSize={'4xl'}>Activities</Text>
			<UnorderedList>
				{activities.map((activity) => (
					<ListItem key={activity.id}>
						<Link href={`/activity/${activity.id}`}>{activity.fileName}</Link>
					</ListItem>
				))}
				;
			</UnorderedList> */}
		</Layout>
	);
};

export default ActivityListPage;
