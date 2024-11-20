import { Box, Card, CardContent } from '@mui/material';
import { PopupNotif } from '../../index';

interface FormWrapperProps {
	children: React.ReactNode;
	showPopup: boolean;
	message: string | null;
	type: 'success' | 'error' | 'warning' | 'info';
}
const FormWrapper = ({ children, showPopup, message, type }: FormWrapperProps) => {
	return (
		<Box
			sx={{
				backgroundImage: 'url(plain-bg.jpg) ',
				backgroundSize: 'cover',
				backgroundRepeaat: 'no-repeat',
				width: '100%',
				padding: '24px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100vh',
				a: {
					textDecoration: 'none',
					color: '#1976d2',
				},
			}}
		>
			<Card
				variant='outlined'
				sx={{
					padding: '24px',
					maxWidth: '600px',
				}}
			>
				<CardContent> {children} </CardContent>
			</Card>
			{showPopup && (
				<PopupNotif
					open={showPopup}
					message={message}
					severity={type}
				/>
			)}
		</Box>
	);
};

export default FormWrapper;
