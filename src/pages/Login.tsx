// src/pages/Login.tsx
import {
	AbsoluteCenter,
	Alert,
	AlertIcon,
	Box,
	Button,
	Checkbox,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Image,
	Input,
	Link,
	Stack,
} from '@chakra-ui/react';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import coverImage from '../assets/images/cavendish_tt.jpg';

function Login() {
	// Initialize Firebase authentication and navigation
	const auth = getAuth();
	const navigate = useNavigate();

	// State variable for managing authentication state, email, password, and error messages
	const [authing, setAuthing] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	// Function to handle sign-in with Google
	const signInWithGoogle = async () => {
		setAuthing(true);

		// Use Firebase to sign in
		signInWithPopup(auth, new GoogleAuthProvider())
			.then((response) => {
				console.log(response.user.uid);
				navigate('/');
			})
			.catch((error) => {
				console.log(error);
				setAuthing(false);
			});
	};

	// Function to handle sign-in with email and password
	const signInWithEmail = async () => {
		setAuthing(true);
		setError('');

		// Use Firebase to sign in
		signInWithEmailAndPassword(auth, email, password)
			.then((response) => {
				console.log(response.user.uid);
				navigate('/');
			})
			.catch((error) => {
				console.log(error);
				setError(error.message);
				setAuthing(false);
			});
	};

	return (
		<Stack width="100vw" minH={'100vh'} direction={{ base: 'column', md: 'row', lg: 'row' }} overflow="hidden">
			<Flex p={8} flex={1} align={'center'} justify={'center'}>
				<Stack spacing={4} w={'full'} maxW={'md'}>
					<Heading fontSize={'2xl'}>Sign in to your account</Heading>
					{error && (
						<Alert status="error">
							<AlertIcon />
							Incorrect email or password.
						</Alert>
					)}
					<FormControl id="email">
						<FormLabel>Email address</FormLabel>
						<Input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							onKeyDown={(e) => (e.key === 'Enter' ? signInWithEmail() : '')}
						/>
					</FormControl>
					<FormControl id="password">
						<FormLabel>Password</FormLabel>
						<Input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onKeyDown={(e) => (e.key === 'Enter' ? signInWithEmail() : '')}
						/>
					</FormControl>
					<Stack spacing={6}>
						<Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'space-between'}>
							<Checkbox>Remember me</Checkbox>
						</Stack>
						<Button
							colorScheme={'blue'}
							variant={'solid'}
							onClick={signInWithEmail}
							disabled={authing}
							isLoading={authing}
						>
							Sign in
						</Button>
						<Box position="relative" padding="2">
							<Divider />
							<AbsoluteCenter bg="white" px="4">
								Or
							</AbsoluteCenter>
						</Box>
						<Button
							leftIcon={<FcGoogle />}
							colorScheme="gray"
							variant="outline"
							borderColor="gray.300"
							_hover={{ bg: 'gray.100' }}
							size="lg"
							fontWeight="normal"
							onClick={signInWithGoogle}
							disabled={authing}
						>
							Log In using Google
						</Button>
					</Stack>
					<Stack align={'center'}>
						<Link color={'blue.500'}>Forgot Password?</Link>
						<Link color={'blue.500'} href={'/Register'}>
							Create a New Account
						</Link>
					</Stack>
				</Stack>
			</Flex>
			<Flex flex={1}>
				<Image alt={'Login Image'} objectFit={'cover'} src={coverImage} />
			</Flex>
		</Stack>
	);
}

export default Login;
