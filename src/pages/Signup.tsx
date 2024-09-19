import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
	AbsoluteCenter,
	Alert,
	AlertIcon,
	Box,
	Button,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	InputGroup,
	InputRightElement,
	Link,
	Stack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

function Signup() {
	// Initialize Firebase authentication and navigation
	const auth = getAuth();
	const navigate = useNavigate();

	// State variable for managing authentication state, email, password, and error messages
	const [authing, setAuthing] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	// Function to handle sign-in with Google
	const signUpWithGoogle = async () => {
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

	// Function to hangle sign-up with email and password
	const signUpWithEmail = async () => {
		// Check if passwords match
		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		setAuthing(true);
		setError('');

		// Use Firebase to create a new user
		createUserWithEmailAndPassword(auth, email, password)
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
		<Flex minH={'100vh'} w="100vw" align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
			<Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
				<Stack align={'center'}>
					<Heading fontSize={'4xl'} textAlign={'center'}>
						Sign up
					</Heading>
					{error && (
						<Alert status="error">
							<AlertIcon />
							Invalid email/password.
						</Alert>
					)}
				</Stack>
				<Flex align={'center'}>
					<Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8} w={'28vw'} mx={'auto'}>
						<Stack spacing={4}>
							{/* <HStack>
							<Box>
								<FormControl id="firstName" isRequired>
									<FormLabel>First Name</FormLabel>
									<Input type="text" />
								</FormControl>
							</Box>
							<Box>
								<FormControl id="lastName">
									<FormLabel>Last Name</FormLabel>
									<Input type="text" />
								</FormControl>
							</Box>
						</HStack> */}
							<FormControl id="email" isRequired>
								<FormLabel>Email address</FormLabel>
								<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
							</FormControl>
							<FormControl id="password" isRequired>
								<FormLabel>Password</FormLabel>
								<InputGroup>
									<Input
										type={showPassword ? 'text' : 'password'}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
									<InputRightElement h={'full'}>
										<Button variant={'ghost'} onClick={() => setShowPassword((showPassword) => !showPassword)}>
											{showPassword ? <ViewIcon /> : <ViewOffIcon />}
										</Button>
									</InputRightElement>
								</InputGroup>
							</FormControl>
							<FormControl id="confirm-password" isRequired>
								<FormLabel>Confirm Password</FormLabel>
								<InputGroup>
									<Input
										type={showPassword ? 'text' : 'password'}
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
									/>
									<InputRightElement h={'full'}>
										<Button variant={'ghost'} onClick={() => setShowPassword((showPassword) => !showPassword)}>
											{showPassword ? <ViewIcon /> : <ViewOffIcon />}
										</Button>
									</InputRightElement>
								</InputGroup>
							</FormControl>
							<Stack spacing={6} pt={2}>
								<Button
									loadingText="Submitting"
									size="lg"
									bg={'blue.400'}
									color={'white'}
									_hover={{
										bg: 'blue.500',
									}}
									onClick={signUpWithEmail}
									disabled={authing}
									isLoading={authing}
								>
									Sign up
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
									onClick={signUpWithGoogle}
									disabled={authing}
								>
									Sign Up with Google
								</Button>
							</Stack>
							<Stack pt={6}>
								<Text align={'center'}>
									Already a user?{' '}
									<Link color={'blue.400'} href="/Login">
										Login
									</Link>
								</Text>
							</Stack>
						</Stack>
					</Box>
				</Flex>
			</Stack>
		</Flex>
	);
}

export default Signup;
