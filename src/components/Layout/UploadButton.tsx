import { AddIcon } from '@chakra-ui/icons';
import { Button, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import UploadCard from './UploadCard';

const UploadActivityButton: React.FC = () => {
	const textColor = useColorModeValue('#F5E5E9', 'gray.100');
	const bgColor = useColorModeValue('#2589fb', '#28536B');

	return (
		<UploadCard>
			{({ handleOpen }) => (
				<Button
					variant={'solid'}
					color={textColor}
					backgroundColor={bgColor}
					size={'sm'}
					leftIcon={<AddIcon />}
					onClick={handleOpen}
					display={{ base: 'none', md: 'block' }}
					_hover={{ bg: 'blue.600' }}
					sx={{
						_focus: {
							outline: 'none',
						},
					}}
				>
					Upload Activity
				</Button>
			)}
		</UploadCard>
	);
};

export default UploadActivityButton;
