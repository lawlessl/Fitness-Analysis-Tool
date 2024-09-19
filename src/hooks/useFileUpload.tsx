// useFileUpload.tsx
// import { useToast } from '@chakra-ui/react';
// import { doc, setDoc } from 'firebase/firestore';
// import { useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import { db } from '../firebaseConfig';
// import parseFitFile from '../utils/FitFileParser';
// import useUser from './useUser';

// const useFileUpload = () => {
// 	const user = useUser();
// 	const [loading, setLoading] = useState(false);
// 	const toast = useToast();

// 	const cleanData = (data: object): object => {
// 		if (Array.isArray(data)) {
// 			return data.map(cleanData);
// 		} else if (data instanceof Date) {
// 			return data; // Preserve Date objects
// 		} else if (data !== null && typeof data === 'object') {
// 			return Object.fromEntries(
// 				Object.entries(data).map(([key, value]) => [key, value === undefined ? null : cleanData(value)])
// 			);
// 		}
// 		return data;
// 	};

// 	const handleFileUpload = async (file: File) => {
// 		setLoading(true);
// 		try {
// 			const fileArrayBuffer = await file.arrayBuffer();
// 			const fileUint8Array = new Uint8Array(fileArrayBuffer);
// 			const parsedData = await parseFitFile(fileUint8Array);

// 			// Ensure objects have the same set of properties, avoids error with firestore undefined
// 			const cleanedData = cleanData(parsedData);

// 			if (user) {
// 				const uniqueId = uuidv4();
// 				const fileName = file.name;
// 				const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
// 				const baseFileName = fileName.substring(0, fileName.lastIndexOf('.'));
// 				const userDocRef = doc(db, 'users', user.uid, 'activities', uniqueId);
// 				await setDoc(
// 					userDocRef,
// 					{
// 						fileName,
// 						baseFileName,
// 						fileType,
// 						parsedData: cleanedData,
// 						uploadedAt: new Date(),
// 					},
// 					{ merge: true }
// 				);

// 				// Alert user with toast when the file uploads successfully
// 				toast({
// 					title: 'File uploaded successfully.',
// 					description: `Your file ${fileName} has been uploaded.`,
// 					status: 'success',
// 					duration: 5000,
// 					isClosable: true,
// 					position: 'top-right',
// 				});
// 			}
// 		} catch (error) {
// 			console.error('Error parsing or storing FIT file:', error);

// 			// Alert user with toast when the file fails to upload
// 			toast({
// 				title: 'File upload failed.',
// 				description: 'There was an error uploading your file. Please try again.',
// 				status: 'error',
// 				duration: 5000,
// 				isClosable: true,
// 				position: 'top-right',
// 			});
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return { handleFileUpload, loading };
// };

// export default useFileUpload;

// useFileUpload.tsx
import { useToast } from '@chakra-ui/react';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '../firebaseConfig';
import useUser from './useUser';

const useFileUpload = () => {
	const user = useUser();
	const [loading, setLoading] = useState(false);
	const toast = useToast();

	const handleFileUpload = async (file: File) => {
		setLoading(true);
		try {
			const fileArrayBuffer = await file.arrayBuffer();
			const fileUint8Array = new Uint8Array(fileArrayBuffer);

			// Save file to Firebase Storage
			if (user) {
				const uniqueId = uuidv4();
				const storageRef = ref(storage, `activities/${user.uid}/${uniqueId}/${file.name}`);
				await uploadBytes(storageRef, fileUint8Array);

				// Extract and store basic metadata
				const fileName = file.name;
				const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
				const baseFileName = fileName.substring(0, fileName.lastIndexOf('.'));
				const userDocRef = doc(db, 'users', user.uid, 'activities', uniqueId);
				await setDoc(
					userDocRef,
					{
						fileName,
						baseFileName,
						fileType,
						uploadedAt: new Date(),
						storageRef: storageRef.fullPath, // Reference to the file in Firebase Storage
					},
					{ merge: true }
				);

				toast({
					title: 'File uploaded successfully.',
					description: `Your file ${fileName} has been uploaded.`,
					status: 'success',
					duration: 5000,
					isClosable: true,
					position: 'top-right',
				});
			}
		} catch (error) {
			console.error('Error uploading FIT file:', error);
			toast({
				title: 'File upload failed.',
				description: 'There was an error uploading your file. Please try again.',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top-right',
			});
		} finally {
			setLoading(false);
		}
	};

	return { handleFileUpload, loading };
};

export default useFileUpload;
