import { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { isValidEmail } from '../../utils/helpers';

interface FormInputProps {
	type: string;
	label: string;
	name: string;
	value: string;
	onChange: (value: string) => void;
	errMessage: string | null;
}

const FormInput = ({ type, label, name, value, onChange, errMessage }: FormInputProps) => {
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);

		if (error) {
			setError(null);
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const { value } = e.target;

		if (!value.trim()) {
			setError(`${label} is required`);
		} else if (type === 'email' && !isValidEmail(value)) {
			setError(`Must be a valid email`);
		} else {
			setError(null);
		}
	};

	return (
		<TextField
			error={!!error || !!errMessage}
			label={label}
			type={type === 'password' && !showPassword ? 'password' : 'text'}
			variant='outlined'
			fullWidth
			name={name}
			value={value}
			onChange={handleChange}
			onBlur={handleBlur}
			autoComplete='off'
			InputProps={
				type === 'password'
					? {
							endAdornment: (
								<PasswordVisibility
									showPassword={showPassword}
									onToggle={() => setShowPassword((prev) => !prev)}
								/>
							),
					  }
					: undefined
			}
			helperText={error || errMessage || ''}
		/>
	);
};

const PasswordVisibility = ({ showPassword, onToggle }: { showPassword: boolean; onToggle: () => void }) => (
	<InputAdornment position='end'>
		<IconButton
			onClick={onToggle}
			edge='end'
		>
			{showPassword ? <Visibility /> : <VisibilityOff />}
		</IconButton>
	</InputAdornment>
);

export default FormInput;
