import { FormEvent, useState } from 'react';
import FormWrapper from '../../components/Form/modules/FormWrapper';
import { Box, Typography, Grid, Button, Link, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FormInput from '../../components/Form/FormInput';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../firebase.config.ts';
import { isValidEmail } from '../../utils/helpers.tsx';

const ForgotPassword = () => {
	const [formData, setFormData] = useState<string>('');
	const [msgType, setMsgType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
	const [message, setMessage] = useState<string>('');
	const [showError, setShowError] = useState<boolean>(false);
	const [showToast, setShowToast] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		if (!formData || !isValidEmail(formData)) {
			setShowError(true);
			return;
		}

		setLoading(true);

		sendPasswordResetEmail(auth, formData)
			.then(() => {
				setMessage('Password reset email sent!');
				setMsgType('success');
				setShowToast(true);
			})
			.catch((error) => {
				console.error('Error sending password reset email:', error);
				setMessage(error);
				setMsgType('error');
				setShowToast(true);
			})

			.finally(() => {
				setLoading(false);
				setTimeout(() => {
					setShowToast(false);
				}, 1000);
			});
	};

	return (
		<FormWrapper
			showPopup={showToast}
			message={message}
			type={msgType}
		>
			<Box mb={3}>
				<Typography
					variant='h5'
					component='h1'
					color='primary'
				>
					<Link
						component={RouterLink}
						to='/signin'
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: '4px',
						}}
					>
						<ArrowBackIcon />
						Go Back
					</Link>
				</Typography>
			</Box>
			<form onSubmit={handleSubmit}>
				<Grid
					container
					spacing={2}
				>
					<Grid
						item
						xs={12}
					>
						<FormInput
							type='email'
							label='Email'
							name='email'
							value={formData || ''}
							onChange={(val) => setFormData(val)}
							errMessage={showError && !formData ? 'Email is required' : ''}
						/>
					</Grid>

					<Grid
						item
						xs={12}
					>
						<Button
							type='submit'
							variant='contained'
							color='primary'
							fullWidth
							disabled={loading}
							sx={{
								padding: '16px',
								marginTop: '12px',
								width: '100%',
							}}
						>
							{loading ? (
								<CircularProgress
									size={24}
									color='inherit'
								/>
							) : (
								'Reset Password'
							)}
						</Button>
					</Grid>
				</Grid>
			</form>
		</FormWrapper>
	);
};

export default ForgotPassword;
