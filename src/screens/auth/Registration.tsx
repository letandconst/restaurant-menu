/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormEvent, useState } from 'react';
import { Button, Typography, Grid, Link, CircularProgress, Box } from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase.config.ts';

import { FirebaseErrorMessages } from '../../types/FirebaseErrorMessages.ts';
import FormWrapper from '../../components/Form/modules/FormWrapper.tsx';
import FormInput from '../../components/Form/FormInput.tsx';
import { isValidEmail } from '../../utils/helpers.tsx';

interface RegistrationFormData {
	businessName: string;
	phoneNumber: string;
	email: string;
	password: string;
}

const Registration = () => {
	const [formData, setFormData] = useState<RegistrationFormData>({
		businessName: '',
		phoneNumber: '',
		email: '',
		password: '',
	});

	const [msgType, setMsgType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
	const [message, setMessage] = useState<string | null>(null);
	const [showError, setShowError] = useState<boolean>(false);
	const [showToast, setShowToast] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			if (!formData.businessName || !formData.phoneNumber || !formData.email || !isValidEmail(formData.email) || !formData.password) {
				setShowError(true);
				return;
			}

			setLoading(true);
			setShowError(false);

			const authUser = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

			await set(ref(db, 'merchants/' + authUser.user.uid), {
				businessName: formData.businessName,
				phoneNumber: formData.phoneNumber,
				email: formData.email,
				userId: authUser.user.uid,
			});

			setMessage('User successfully registered!');
			setMsgType('success');
			setShowToast(true);

			setTimeout(() => {
				navigate('/signin');
			}, 1000);
		} catch (err: any) {
			const errorMessage = FirebaseErrorMessages(err);
			setMessage(errorMessage);
			setMsgType('error');
			setShowToast(true);
			setFormData({
				businessName: '',
				phoneNumber: '',
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
					Register
				</Typography>
				<Typography variant='body2'>
					<Link
						component={RouterLink}
						to='/signin'
						color='primary'
					>
						Already have an account?
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
							type='string'
							label='Business Name'
							name='businessName'
							value={formData.businessName}
							onChange={(value) => setFormData({ ...formData, businessName: value })}
							errMessage={showError && !formData.businessName ? 'Business name is required' : ''}
						/>
					</Grid>
					<Grid
						item
						xs={12}
					>
						<FormInput
							type='string'
							label='Phone Number'
							name='phoneNumber'
							value={formData.phoneNumber}
							onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
							errMessage={showError && !formData.phoneNumber ? 'Phone number is required' : ''}
						/>
					</Grid>
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
								'Register'
							)}
						</Button>
					</Grid>
				</Grid>
			</form>
		</FormWrapper>
	);
};

export default Registration;
