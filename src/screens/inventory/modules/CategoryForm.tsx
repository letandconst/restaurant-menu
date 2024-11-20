/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, FocusEvent, FormEvent, useEffect, useState } from 'react';
import { Box, Button, FormControl, TextField, Typography } from '@mui/material';
import { ImageUploader } from '../../../components';

interface CategoryFormProps {
	onClose: () => void;
	onSubmit: (data: Record<string, any>) => void;
	initialData?: Record<string, any>;
}

const CategoryForm = ({ onClose, onSubmit, initialData }: CategoryFormProps) => {
	const [formData, setFormData] = useState<Record<string, any>>(initialData || {});
	const [errors, setErrors] = useState<Record<string, boolean>>({ name: false, description: false });
	const [preview, setPreview] = useState<string | ArrayBuffer | null>('');

	const validateField = (value: string) => {
		return !value.trim();
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));

		if (errors[name]) {
			setErrors({
				...errors,
				[name]: validateField(value),
			});
		}
	};

	const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
		const { value } = event.target;
		const fieldName = event.target.getAttribute('name');
		if (!fieldName) return;
		setErrors({
			...errors,
			[fieldName]: validateField(value),
		});
	};

	const handleFileChange = (event: { target: { name: any; files: any } }) => {
		const { name, files } = event.target;
		const file = files[0];
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: file,
		}));

		const reader = new FileReader();
		reader.onloadend = () => {
			setPreview(reader.result);
		};
		reader.readAsDataURL(files[0]);
	};

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		const newErrors: Record<string, boolean> = {
			name: validateField(formData.name || ''),
			description: validateField(formData.description || ''),
		};

		setErrors(newErrors);

		const hasErrors = Object.values(newErrors).some((error) => error);
		if (hasErrors) return;

		onSubmit(formData);
		handleClose();
	};

	const handleClose = () => {
		setFormData(initialData || {});
		setErrors({ name: false, description: false });
		onClose();
	};

	useEffect(() => {
		if (formData) {
			setPreview(formData.photo);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<form onSubmit={handleSubmit}>
			<Box
				sx={{
					padding: ' 0 24px 24px',
					'input, .MuiSelect-select': {
						padding: '10px 12px',
					},

					'.MuiFormControl-fullWidth': {
						gap: '4px',

						'.Mui-error': {
							marginLeft: '0',
						},
					},
				}}
			>
				<Box>
					<ImageUploader
						preview={preview ?? formData.photo}
						handleFileChange={handleFileChange}
					/>
				</Box>
				<Box
					sx={{
						'> div': {
							marginTop: '16px',
						},
					}}
				>
					<FormControl fullWidth>
						<Typography className='form-label'>Category Name</Typography>
						<TextField
							fullWidth
							placeholder='Enter category name'
							type='text'
							name='name'
							value={formData.name || ''}
							onChange={handleChange}
							onBlur={handleBlur}
							error={errors.name}
							helperText={errors.name ? 'Name is required' : ''}
							autoComplete='off'
						/>
					</FormControl>
					<FormControl fullWidth>
						<Typography className='form-label'>Category Description</Typography>
						<TextField
							fullWidth
							multiline
							placeholder='Enter category description'
							type='text'
							name='description'
							value={formData.description || ''}
							onChange={handleChange}
							onBlur={handleBlur}
							error={errors.description}
							helperText={errors.description ? 'Description is required' : ''}
							autoComplete='off'
						/>
					</FormControl>
				</Box>
			</Box>

			{/* Form Action Section*/}
			<Box
				sx={{
					display: 'flex',
					gap: '18px',
					justifyContent: 'flex-end',
					padding: '0 24px 16px',
				}}
			>
				<Button
					variant='contained'
					type='submit'
				>
					Submit
				</Button>
				<Button
					variant='outlined'
					onClick={handleClose}
				>
					Cancel
				</Button>
			</Box>
		</form>
	);
};

export default CategoryForm;
