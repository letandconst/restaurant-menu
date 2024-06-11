/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

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
			className='here'
			sx={{}}
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent
				sx={{
					padding: '16px!important',
				}}
			>
				{children}
			</DialogContent>
		</Dialog>
	);
};

export default Modal;
