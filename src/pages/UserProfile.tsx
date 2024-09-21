import { Box, Button, FormControl, FormLabel, Heading, Input, Stack, Text, Textarea } from '@chakra-ui/react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { db } from '../firebaseConfig';
import useUser from '../hooks/useUser';

const UserProfile = () => {
	const user = useUser();
	const [userData, setUserData] = useState({ name: '', age: '', bio: '' });
	const [loading, setLoading] = useState(true);

	// Fetch user data from Firestore
	useEffect(() => {
		const fetchData = async () => {
			if (user) {
				const docRef = doc(db, 'users', user.uid);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					setUserData(docSnap.data() as { name: string; age: string; bio: string });
				}
				setLoading(false);
			}
		};
		fetchData();
	}, [user]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setUserData({ ...userData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (user) {
			const docRef = doc(db, 'users', user.uid);
			await setDoc(docRef, userData, { merge: true }); // Merging to update only the changed fields
		}
	};

	if (loading) return <div>Loading...</div>;

	return (
		<Layout>
			<Box p={4}>
				<Heading as="h1" mb={6}>
					Welcome, {user?.displayName}
				</Heading>
				<Box as="form" onSubmit={handleSubmit} mb={8}>
					<Stack spacing={4}>
						<FormControl id="name">
							<FormLabel>Name:</FormLabel>
							<Input type="text" name="name" value={userData.name} onChange={handleChange} />
						</FormControl>
						<FormControl id="age">
							<FormLabel>Age:</FormLabel>
							<Input type="text" name="age" value={userData.age} onChange={handleChange} />
						</FormControl>
						<FormControl id="bio">
							<FormLabel>Bio:</FormLabel>
							<Textarea name="bio" value={userData.bio} onChange={handleChange} />
						</FormControl>
						<Button type="submit" colorScheme="blue">
							Save
						</Button>
					</Stack>
				</Box>

				<Heading as="h2" mb={4}>
					Your Profile
				</Heading>
				<Stack spacing={2}>
					<Text>
						<strong>Name:</strong> {userData.name}
					</Text>
					<Text>
						<strong>Age:</strong> {userData.age}
					</Text>
					<Text>
						<strong>Bio:</strong> {userData.bio}
					</Text>
				</Stack>
			</Box>
		</Layout>
	);
};

export default UserProfile;
