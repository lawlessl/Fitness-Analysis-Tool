import { AddIcon } from '@chakra-ui/icons';
import { Center, chakra, Spinner, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import useFileUpload from '../../hooks/useFileUpload';

const UploadFitFileBox: React.FC = () => {
	const [dragging, setDragging] = useState(false);
	const { handleFileUpload, loading } = useFileUpload();
	const hoverColor = useColorModeValue('gray.200', 'gray.500');

	// Handle file input change event
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			Array.from(files).forEach((file) => handleFileUpload(file));
		}
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setDragging(false);

		const files = event.dataTransfer.files;
		if (files) {
			Array.from(files).forEach((file) => handleFileUpload(file));
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setDragging(true);
	};

	const handleDragLeave = () => {
		setDragging(false);
	};

	return (
		<Center
			w={'100%'}
			h={'200px'}
			as={chakra.label}
			htmlFor="file"
			bg={dragging ? 'blue.100' : 'whiteAlpha.500'}
			border="2px dashed gray"
			rounded={'10px'}
			cursor="pointer"
			overflow="hidden"
			position="relative"
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
		>
			{loading ? (
				<Spinner size="xl" />
			) : (
				<Center position="absolute" w="100%" h="100%" _hover={{ bg: hoverColor }}>
					<VStack>
						<AddIcon />
						<Text fontSize={'xl'}>Upload</Text>
						<Text fontSize={'sm'}>Click to select .FIT files or drag and drop them here.</Text>
					</VStack>
				</Center>
			)}

			<chakra.input
				required
				style={{ display: 'none' }}
				type="file"
				id="file"
				name="file"
				multiple
				onChange={handleChange}
			/>
		</Center>
	);
};

export default UploadFitFileBox;
