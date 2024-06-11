/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, FocusEvent, FormEvent, useEffect, useState } from 'react';
import { ImageUploader } from '../../../components';
import { Box, Button, Divider, TextField } from '@mui/material';

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
	}, []);

	return (
		<form onSubmit={handleSubmit}>
			<Box
				sx={{
					display: 'flex',
					gap: '18px',
				}}
			>
				<ImageUploader
					preview={preview ?? formData.photo}
					handleFileChange={handleFileChange}
				/>
				<Box
					sx={{
						'div:not(:first-of-type)': {
							marginTop: '12px',
						},
					}}
				>
					<TextField
						fullWidth
						label='Name'
						name='name'
						value={formData.name || ''}
						onChange={handleChange}
						onBlur={handleBlur}
						error={errors.name}
						helperText={errors.name ? 'Name is required' : ''}
					/>
					<TextField
						fullWidth
						multiline
						label='Description'
						name='description'
						value={formData.description || ''}
						onChange={handleChange}
						onBlur={handleBlur}
						error={errors.description}
						helperText={errors.description ? 'Description is required' : ''}
					/>
				</Box>
			</Box>
			<Divider
				sx={{
					margin: '24px 0',
				}}
			/>
			<Box
				sx={{
					display: 'flex',
					gap: '18px',
					justifyContent: 'flex-end',
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
