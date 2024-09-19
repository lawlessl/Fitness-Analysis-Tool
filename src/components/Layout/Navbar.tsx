// Navbar.tsx
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Flex,
	HStack,
	Icon,
	IconButton,
	Link,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Stack,
	Text,
	useColorMode,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
import { AiOutlineClose } from 'react-icons/ai';
import { BiChevronDown } from 'react-icons/bi';
import { GiHamburgerMenu } from 'react-icons/gi';
import useSignOut from '../../hooks/useSignOut';
import UploadActivityButton from './UploadButton';
import UploadCard from './UploadCard';

const navLinks = [
	{ name: 'Dashboard', path: '/Dashboard' },
	{ name: 'Activities', path: '/activities' },
	{ name: 'About', path: '#' },
];

const dropdownLinks = [
	{
		name: 'Profile',
		path: '/user',
		color: 'black',
		hoverColor: 'blue.400',
	},
	{
		name: 'Settings',
		path: '#',
		color: 'black',
		hoverColor: 'blue.400',
	},
	{
		name: 'Sign Out',
		path: '#',
		color: 'red',
		hoverColor: '#B00020',
	},
];

export default function Navbar() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const signOut = useSignOut();
	const { colorMode, toggleColorMode } = useColorMode();
	const hoverColor = useColorModeValue('blue.500', 'blue.200');

	return (
		<Box
			px={4}
			bg={useColorModeValue('white', 'gray.800')}
			boxShadow="md"
			position="fixed"
			top={0}
			width="100%"
			zIndex="sticky"
		>
			<Flex h={16} alignItems="center" justifyContent="space-between" mx="auto" position="relative">
				{/* Left Section: Toggle Color Mode Button */}
				<Button onClick={toggleColorMode}>{colorMode === 'light' ? <MoonIcon /> : <SunIcon />}</Button>

				{/* Center Section: Nav Links */}
				<Box position="absolute" left="50%" transform="translateX(-50%)">
					<HStack
						as="nav"
						spacing={6}
						display={{ base: 'none', md: 'flex' }}
						alignItems="center"
						justifyContent="center"
					>
						{navLinks.map((link, index) => (
							<NavLink key={index} {...link} onClose={onClose} />
						))}
						<Menu autoSelect={false} isLazy onOpen={onOpen} onClose={onClose}>
							<MenuButton
								sx={{
									border: '1px solid transparent',
									_hover: { border: '1px solid transparent' },
									_focus: { outline: 'none' },
								}}
							>
								<Flex alignItems="center">
									<Text>Settings</Text>
									<Icon
										as={BiChevronDown}
										h={5}
										w={5}
										ml={1}
										transition="all .25s ease-in-out"
										transform={isOpen ? 'rotate(180deg)' : ''}
									/>
								</Flex>
							</MenuButton>
							<MenuList>
								<MenuItem as={Link} href="/user">
									Profile
								</MenuItem>
								<MenuItem as={Link} href="#">
									Settings
								</MenuItem>
								<MenuDivider color={'lightgrey'} />
								<MenuItem as={Link} onClick={signOut} color={'red'} _hover={{ bg: 'red.400', color: 'white' }}>
									Sign Out
								</MenuItem>
							</MenuList>
						</Menu>
					</HStack>
				</Box>

				{/* Right Section: Upload Button */}
				<Flex alignItems="center">
					<UploadActivityButton />
					<IconButton
						size="md"
						icon={isOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
						aria-label="Open Menu"
						display={{ base: 'inherit', md: 'none' }}
						onClick={isOpen ? onClose : onOpen}
					/>
				</Flex>
			</Flex>

			{isOpen ? (
				<Box pb={4} display={{ base: 'inherit', md: 'none' }}>
					<Stack as="nav" spacing={2}>
						{navLinks.map((link, index) => (
							<NavLink key={index} {...link} onClose={onClose} />
						))}
						<UploadCard>
							{({ handleOpen }) => (
								<Link
									href={'#'}
									lineHeight="inherit"
									_hover={{ textDecoration: 'none', color: hoverColor }}
									onClick={() => {
										handleOpen();
									}}
								>
									Upload Activity
								</Link>
							)}
						</UploadCard>
						<Text fontWeight="semibold" color="gray.500">
							TODO
						</Text>
						<Stack pl={2} spacing={1} mt={'0 !important'}>
							{dropdownLinks.map((link, index) => (
								<NavLink key={index} {...link} onClose={onClose} />
							))}
						</Stack>
					</Stack>
				</Box>
			) : null}
		</Box>
	);
}

// NavLink Component
interface NavLinkProps {
	name: string;
	path: string;
	onClose: () => void;
}

const NavLink = ({ name, path, onClose }: NavLinkProps) => {
	const hoverColor = useColorModeValue('blue.500', 'blue.200');
	return (
		<Link
			href={path}
			lineHeight="inherit"
			_hover={{
				textDecoration: 'none',
				color: hoverColor,
			}}
			onClick={() => onClose()}
		>
			{name}
		</Link>
	);
};
