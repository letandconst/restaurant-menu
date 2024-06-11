import { Snackbar, Alert } from '@mui/material';

interface PopupNotifProps {
	open: boolean;
	message: string;
	severity: 'success' | 'error' | 'warning' | 'info';
	onClose: () => void;
}

const PopupNotif = ({ open, message, severity, onClose }: PopupNotifProps) => {
	return (
		<Snackbar
			open={open}
			autoHideDuration={2500}
			onClose={onClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
		>
			<Alert
				onClose={onClose}
				severity={severity}
				sx={{ width: '100%' }}
			>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default PopupNotif;
