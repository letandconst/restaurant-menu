/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogTitle, DialogContent, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
interface ModalProps {
	open: boolean;
	title: string;
	onClose: () => void;
	children: React.ReactNode;
}

const Modal = ({ open, title, onClose, children }: ModalProps) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
		>
			<Box
				sx={{
					position: 'relative',
				}}
			>
				<DialogTitle
					sx={{
						boxShadow: 'rgba(0, 0, 0, 0.1) 0 1px',
					}}
				>
					{title}
				</DialogTitle>
				<IconButton
					aria-label='close'
					onClick={onClose}
					sx={{
						position: 'absolute',
						padding: '0',
						right: '24px',
						top: '20px',
						'&:hover': {
							borderRadius: '0',
							background: 'transparent',
						},
					}}
				>
					<CloseIcon />
				</IconButton>
			</Box>
			<DialogContent
				sx={{
					padding: '24px 0 0 !important',
				}}
			>
				{children}
			</DialogContent>
		</Dialog>
	);
};

export default Modal;
