import { Container, Card, CardContent, Snackbar } from '@mui/material';

interface FormWrapperProps {
	children: React.ReactNode;
	error: boolean;
	errMessage: string | null;
}
const FormWrapper = ({ children, error, errMessage }: FormWrapperProps) => {
	return (
		<Container
			maxWidth='sm'
			sx={{
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
			<Card variant='outlined'>
				<CardContent> {children} </CardContent>
			</Card>
			{error && (
				<Snackbar
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					open={error}
					autoHideDuration={1500}
					message={errMessage}
				/>
			)}
		</Container>
	);
};

export default FormWrapper;
