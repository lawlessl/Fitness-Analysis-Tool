import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import UploadFitFileBox from './UploadBox';

interface UploadCardProps {
	children: (props: { handleOpen: () => void }) => React.ReactNode;
}

const UploadCard: React.FC<UploadCardProps> = ({ children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isBlurred, setIsBlurred] = useState(false);
	const textColor = useColorModeValue('#F5E5E9', 'gray.100');
	const bgColor = useColorModeValue('#2589fb', '#28536B');

	const handleOpen = () => {
		setIsBlurred(true);
		onOpen();
	};

	const handleClose = () => {
		setIsBlurred(false);
		onClose();
	};

	return (
		<>
			{children({ handleOpen })}

			{/* Blur background when modal is open */}
			<div style={{ filter: isBlurred ? 'blur(5px)' : 'none' }}>
				<Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered preserveScrollBarGap>
					<ModalOverlay />
					<ModalContent rounded={'20px'}>
						<ModalHeader color={textColor} backgroundColor={bgColor} roundedTop={'20px'} position="relative">
							Upload FIT File
							<ModalCloseButton
								sx={{
									position: 'absolute',
									right: 4,
									top: '50%',
									transform: 'translateY(-47%)', // Adjust for true vertical centering
									border: 'none',
									_focus: {
										outline: 'none',
										boxShadow: 'none',
									},
								}}
								color={textColor}
							/>
						</ModalHeader>
						<ModalBody p={4}>
							<UploadFitFileBox />
						</ModalBody>
					</ModalContent>
				</Modal>
			</div>
		</>
	);
};

export default UploadCard;
