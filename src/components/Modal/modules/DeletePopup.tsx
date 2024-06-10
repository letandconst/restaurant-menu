import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface DeletePopupProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const DeletePopup = ({ open, onClose, onConfirm }: DeletePopupProps) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
		>
			<DialogTitle>Confirm Delete</DialogTitle>
			<DialogContent>
				<DialogContentText>Are you sure you want to delete this?</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					onClick={onConfirm}
					variant='contained'
					color='error'
				>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DeletePopup;
