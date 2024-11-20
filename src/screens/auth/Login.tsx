/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormEvent, useState } from 'react';
import { Button, Typography, Grid, Link, CircularProgress, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase.config.ts';
import { FirebaseErrorMessages } from '../../types/FirebaseErrorMessages.ts';

import FormInput from '../../components/Form/FormInput.tsx';
import { isValidEmail } from '../../utils/helpers.tsx';
import FormWrapper from '../../components/Form/modules/FormWrapper.tsx';

interface LoginFormData {
	email: string;
	password: string;
}

const Login = () => {
	const [formData, setFormData] = useState<LoginFormData>({
		email: '',
		password: '',
	});

	const [msgType, setMsgType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
	const [message, setMessage] = useState<string>('');
	const [showError, setShowError] = useState<boolean>(false);
	const [showToast, setShowToast] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			if (!formData.email || !isValidEmail(formData.email) || !formData.password) {
				setShowError(true);
				return;
			}

			setLoading(true);
			setShowError(false);

			const data = await signInWithEmailAndPassword(auth, formData.email, formData.password);
			const uid = data.user.uid;

			localStorage.setItem('uid', uid);
			setMessage('User successfully login!');
			setMsgType('success');
			setShowToast(true);

			setTimeout(() => {
				navigate('/');
			}, 1000);
		} catch (err: any) {
			const errorMessage = FirebaseErrorMessages(err);
			setMessage(errorMessage);
			setMsgType('error');
			setShowToast(true);
			setFormData({
				email: '',
				password: '',
			});
		} finally {
			setLoading(false);
			setTimeout(() => {
				setShowToast(false);
			}, 1500);
		}
	};

	return (
		<FormWrapper
			showPopup={showToast}
			message={message}
			type={msgType}
		>
			<Box
				display='flex'
				alignItems='center'
				justifyContent='space-between'
				mb={3}
			>
				<Typography
					variant='h5'
					component='h1'
				>
					Login
				</Typography>
				<Typography variant='body2'>
					<Link
						component={RouterLink}
						to='/signup'
						color='primary'
					>
						Don't have an account?
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
							value={formData.email}
							onChange={(value) => setFormData({ ...formData, email: value })}
							errMessage={showError && !formData.email ? 'Email is required' : ''}
						/>
					</Grid>
					<Grid
						item
						xs={12}
					>
						<FormInput
							type='password'
							label='Password'
							name='password'
							value={formData.password}
							onChange={(value) => setFormData({ ...formData, password: value })}
							errMessage={showError && !formData.password ? 'Password is required' : ''}
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
							}}
						>
							{loading ? (
								<CircularProgress
									size={24}
									color='inherit'
								/>
							) : (
								'Login'
							)}
						</Button>
					</Grid>
				</Grid>
			</form>
			<Box
				sx={{
					width: '100%',
					mt: '24px',
				}}
			>
				<Typography variant='body2'>
					<Link
						component={RouterLink}
						to='/forgot-password'
						color='primary'
						sx={{
							display: 'block',
							textAlign: 'right',
						}}
					>
						Forgot Password?
					</Link>
				</Typography>
			</Box>
		</FormWrapper>
	);
};

export default Login;
