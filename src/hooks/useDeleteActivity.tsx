// //useDeleteActivity.tsx
// import { deleteDoc, doc } from 'firebase/firestore';
// import { deleteObject, ref } from 'firebase/storage';
// import { useState } from 'react';
// import { db, storage } from '../firebaseConfig';
// import useUser from './useUser';

// const useDeleteActivity = () => {
// 	const [loading, setLoading] = useState(false);
// 	const [error, setError] = useState<string | null>(null);
// 	const [success, setSuccess] = useState<boolean>(false);
// 	const user = useUser();

// 	const deleteActivity = async (activityId: string, storageRefPath: string) => {
// 		if (!user || !activityId || !storageRefPath) {
// 			setError('Missing required information');
// 			return;
// 		}

// 		setLoading(true);
// 		setError(null);
// 		setSuccess(false);

// 		try {
// 			// Delete the activity from Firestore
// 			const activityDocRef = doc(db, 'users', user.uid, 'activities', activityId);
// 			await deleteDoc(activityDocRef);

// 			// Delete the associated file from Firebase Storage
// 			const storageRef = ref(storage, storageRefPath);
// 			await deleteObject(storageRef);

// 			setSuccess(true);
// 		} catch (error) {
// 			console.error('Error deleting activity:', error);
// 			setError('Failed to delete activity');
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return { deleteActivity, loading, error, success };
// };

// export default useDeleteActivity;
