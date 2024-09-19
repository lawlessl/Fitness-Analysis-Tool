// //useFetchAllActivities.tsx
// import { collection, getDocs } from 'firebase/firestore';
// import { ReactNode, useEffect, useState } from 'react';
// import { db } from '../firebaseConfig';
// import useUser from './useUser';

// interface ActivityData {
// 	id: string;
// 	fileName: string;
// 	fileType: string;
// 	baseFileName: string;
// 	sessions?: ReactNode;
// 	sports?: ReactNode;
// }

// const useFetchAllActivities = () => {
// 	const [activities, setActivities] = useState<ActivityData[]>([]);
// 	const user = useUser();

// 	useEffect(() => {
// 		const fetchActivities = async () => {
// 			if (user) {
// 				try {
// 					const activitiesCollectionRef = collection(db, 'users', user.uid, 'activities');
// 					const querySnapshot = await getDocs(activitiesCollectionRef);

// 					const activityData = querySnapshot.docs.map((doc) => ({
// 						id: doc.id,
// 						fileName: doc.data().fileName,
// 						baseFileName: doc.data().baseFileName,
// 						fileType: doc.data().fileType,
// 						sessions: doc.data().parsedData.activity.sessions,
// 						sports: doc.data().parsedData.activity.sports,
// 					}));

// 					setActivities(activityData);
// 				} catch (error) {
// 					console.error('Error fetching activities:', error);
// 				}
// 			}
// 		};

// 		fetchActivities();
// 	}, [user]);

// 	return activities;
// };

// export default useFetchAllActivities;

//useFetchAllActivities.tsx;
import { collection, getDocs, limit, query, startAfter } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import useUser from './useUser';

interface ActivityData {
	id: string;
	fileName: string;
	fileType: string;
	baseFileName: string;
}

const useFetchAllActivities = () => {
	const [activities, setActivities] = useState<ActivityData[]>([]);
	const [lastVisible, setLastVisible] = useState<unknown>(null);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);
	const user = useUser();

	const fetchMoreActivities = useCallback(async () => {
		if (user && hasMore) {
			setLoading(true); // Start loading
			try {
				const activitiesCollectionRef = collection(db, 'users', user.uid, 'activities');
				const activitiesQuery = lastVisible
					? query(activitiesCollectionRef, startAfter(lastVisible), limit(10))
					: query(activitiesCollectionRef, limit(10));
				const querySnapshot = await getDocs(activitiesQuery);

				if (!querySnapshot.empty) {
					const newActivities = querySnapshot.docs.map((doc) => ({
						id: doc.id,
						fileName: doc.data().fileName,
						baseFileName: doc.data().baseFileName,
						fileType: doc.data().fileType,
					}));

					// Ensure unique activities in state
					setActivities((prevActivities) => {
						const existingIds = new Set(prevActivities.map((activity) => activity.id));
						const filteredNewActivities = newActivities.filter((activity) => !existingIds.has(activity.id));
						return [...prevActivities, ...filteredNewActivities];
					});

					setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
					if (querySnapshot.docs.length < 10) {
						setHasMore(false);
					}
				} else {
					setHasMore(false);
				}
			} catch (error) {
				console.error('Error fetching activities:', error);
			} finally {
				setLoading(false); // Stop loading
			}
		}
	}, [user, hasMore, lastVisible]);

	useEffect(() => {
		fetchMoreActivities();
	}, [fetchMoreActivities]);

	return { activities, fetchMoreActivities, hasMore, loading };
};

export default useFetchAllActivities;
