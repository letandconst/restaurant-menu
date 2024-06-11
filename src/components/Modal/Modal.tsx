/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogTitle, DialogContent, Grid, TextField, DialogActions, Button } from '@mui/material';
import { ChangeEvent, useState, useEffect } from 'react';

interface ModalProps {
	open: boolean;
	title: string;
	fields: { name: string; label: string; type?: string }[];
	onClose: () => void;
	onSubmit: (data: Record<string, any>) => void;
	initialData?: Record<string, any>;
}

const Modal = ({ open, title, fields, onClose, onSubmit, initialData }: ModalProps) => {
	const [formData, setFormData] = useState<Record<string, any>>(initialData || {});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});

		if (errors[event.target.name]) {
			setErrors({
				...errors,
				[event.target.name]: '',
			});
		}
	};

	const handleSubmit = () => {
		const newErrors: Record<string, string> = {};
		fields.forEach((field) => {
			if (!formData[field.name]) {
				newErrors[field.name] = `${field.label} is required`;
			}
		});

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
		} else {
			onSubmit(formData);
			handleClose();
		}
	};

	const handleClose = () => {
		setFormData(initialData || {});
		setErrors({});
		onClose();
	};

	useEffect(() => {
		setFormData(initialData || {});
	}, [initialData]);

	return (
		<Dialog
			open={open}
			onClose={handleClose}
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent
				sx={{
					paddingTop: '6px!important',
				}}
			>
				<Grid
					container
					spacing={2}
				>
					{fields.map((field, index) => (
						<Grid
							item
							xs={12}
							key={index}
						>
							<TextField
								fullWidth
								variant='outlined'
								label={field.label}
								name={field.name}
								type={field.type || 'text'}
								value={formData[field.name] || ''}
								onChange={handleChange}
								error={!!errors[field.name]}
								helperText={errors[field.name]}
							/>
						</Grid>
					))}
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={handleClose}
					color='primary'
				>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					color='primary'
				>
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default Modal;
