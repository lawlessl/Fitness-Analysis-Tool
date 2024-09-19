// useFetchSingleActivity.tsx
import { doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { db, storage } from '../firebaseConfig';
import { ActivityInterface } from '../interfaces/ActivityData'; // Ensure ParsedData is imported
import parseFitFile from '../utils/FitFileParser';
import useUser from './useUser';

const useFetchSingleActivity = (activityId: string | undefined) => {
	const [activity, setActivity] = useState<ActivityInterface | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const user = useUser();

	useEffect(() => {
		const fetchActivity = async () => {
			if (user && activityId) {
				try {
					const activityDocRef = doc(db, 'users', user.uid, 'activities', activityId);
					const docSnapshot = await getDoc(activityDocRef);

					if (docSnapshot.exists()) {
						const data = docSnapshot.data();
						const storageRefPath = data.storageRef;

						// Download the raw file and parse it
						const fileRef = ref(storage, storageRefPath);
						const fileURL = await getDownloadURL(fileRef);
						const response = await fetch(fileURL);
						const fileArrayBuffer = await response.arrayBuffer();
						const fileUint8Array = new Uint8Array(fileArrayBuffer);
						const parsedDataObject = await parseFitFile(fileUint8Array);

						// No localStorage caching
						const activityData: ActivityInterface = {
							id: docSnapshot.id,
							fileName: data.fileName,
							baseFileName: data.baseFileName,
							fileType: data.fileType,
							parsedData: parsedDataObject,
							uploadedAt: data.uploadedAt,
						};
						setActivity(activityData);
					} else {
						setError('Activity not found');
					}
				} catch (error) {
					console.error('Error fetching activity:', error);
					setError('Failed to fetch activity');
				} finally {
					setLoading(false);
				}
			}
		};

		fetchActivity();
	}, [user, activityId]);

	return { activity, loading, error };
};

export default useFetchSingleActivity;
