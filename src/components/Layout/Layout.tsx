// Layout.tsx
import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<Box w="100vw" bg={useColorModeValue('#f9f8f5', '#000000')}>
			<Navbar />
			<Box mt={'16'} p={4}>
				{children}
			</Box>
			<Footer />
		</Box>
	);
};

export default Layout;
