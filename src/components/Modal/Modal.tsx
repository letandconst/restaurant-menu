/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogTitle, DialogContent, Grid, TextField, DialogActions, Button } from '@mui/material';
import React, { useEffect } from 'react';

interface ModalProps {
	open: boolean;
	title: string;
	fields: { name: string; label: string; type?: string }[];
	onClose: () => void;
	onSubmit: (data: Record<string, any>) => void;
	initialData?: Record<string, any>;
}

const Modal = ({ open, title, fields, onClose, onSubmit, initialData }: ModalProps) => {
	const [formData, setFormData] = React.useState<Record<string, any>>(initialData || {});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};

	const handleSubmit = () => {
		onSubmit(formData);
		onClose();
	};

	useEffect(() => {
		setFormData(initialData || {});
	}, [initialData]);

	return (
		<Dialog
			open={open}
			onClose={onClose}
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
							/>
						</Grid>
					))}
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={onClose}
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
