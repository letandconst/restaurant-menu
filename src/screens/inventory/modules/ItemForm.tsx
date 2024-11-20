/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, FocusEvent, FormEvent, useEffect, useState } from 'react';
import { Box, Button, Chip, Collapse, FormControl, FormHelperText, IconButton, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';

import { ImageUploader } from '../../../components';
import useCategories from '../../../hooks/useCategories';

interface ItemFormProps {
	onClose: () => void;
	onSubmit: (data: Record<string, any>) => void;
	initialData?: Record<string, any>;
}

const ItemForm = ({ onClose, onSubmit, initialData }: ItemFormProps) => {
	const [formData, setFormData] = useState<Record<string, any>>({
		...initialData,
		variants: initialData?.variants || [],
	});
	const [errors, setErrors] = useState<Record<string, boolean>>({ name: false, category: false, price: false, cost: false });
	const [preview, setPreview] = useState<string | ArrayBuffer | null>('');
	const [expanded, setExpanded] = useState<boolean>(false);

	const { categoryNames } = useCategories();

	const validateField = (value: string) => {
		return !value.trim();
	};

	const handleExpandClick = () => {
		setExpanded(!expanded);
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

	const handleSelectChange = (event: SelectChangeEvent) => {
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
		const { value, name } = event.target;
		if (!name) return;
		setErrors({
			...errors,
			[name]: validateField(value),
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

	const handleAddVariant = () => {
		setFormData((prevFormData) => ({
			...prevFormData,
			variants: [...prevFormData.variants, { name: '', price: '', cost: '' }],
		}));
	};

	const handleRemoveVariant = (indexToRemove: number) => {
		setFormData((prevFormData) => ({
			...prevFormData,
			variants: prevFormData.variants.filter((_: any, index: number) => index !== indexToRemove),
		}));
	};

	const handleVariantChange = (index: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = event.target;

		setFormData((prevFormData) => {
			const newVariants = [...prevFormData.variants];
			newVariants[index] = {
				...newVariants[index],
				[name]: value,
			};
			return {
				...prevFormData,
				variants: newVariants,
			};
		});
	};

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();

		const hasVariants = formData.variants.length > 0;

		const newFormData = { ...formData };

		let newErrors: Record<string, boolean> = {};

		if (hasVariants) {
			newFormData.price = '';
			newFormData.cost = '';

			newErrors = {
				name: validateField(formData.name || ''),
			};
		} else {
			newErrors = {
				name: validateField(formData.name || ''),
				price: validateField(formData.price || ''),
				cost: validateField(formData.cost || ''),
			};
		}

		setErrors(newErrors);

		const hasErrors = Object.values(newErrors).some((error) => error);

		if (hasErrors) return;

		onSubmit(newFormData);
		handleClose();
	};

	const handleClose = () => {
		setFormData({
			...initialData,
			variants: initialData?.variants || [],
		});
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
						<Typography className='form-label'>Item Name</Typography>
						<TextField
							fullWidth
							placeholder='Enter item name'
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

					<FormControl
						fullWidth
						error={!!errors.category}
					>
						<Typography className='form-label'>Item Category</Typography>
						<Select
							name='category'
							value={formData.category || ''}
							onChange={handleSelectChange}
							onBlur={handleBlur}
							displayEmpty
						>
							<MenuItem
								disabled
								value=''
							>
								Select a category
							</MenuItem>

							{categoryNames.map((categoryName, index) => (
								<MenuItem
									key={index}
									value={categoryName}
								>
									{categoryName}
								</MenuItem>
							))}
						</Select>
						{errors.category && <FormHelperText>Category is required</FormHelperText>}
					</FormControl>

					<FormControl fullWidth>
						<Typography className='form-label'>Item Price</Typography>
						<TextField
							fullWidth
							placeholder='Enter price'
							type='number'
							name='price'
							value={formData.price || ''}
							onChange={handleChange}
							onBlur={handleBlur}
							error={errors.price}
							helperText={formData.variants.length === 0 && errors.price ? 'Price is required' : ''}
							autoComplete='off'
							disabled={formData.variants.length}
						/>
					</FormControl>

					<FormControl fullWidth>
						<Typography className='form-label'>Item Cost</Typography>
						<TextField
							fullWidth
							placeholder='Enter cost'
							type='number'
							name='cost'
							value={formData.cost || ''}
							onChange={handleChange}
							onBlur={handleBlur}
							error={errors.cost}
							helperText={formData.variants.length === 0 && errors.cost ? 'Cost is required' : ''}
							autoComplete='off'
							disabled={formData.variants.length}
						/>
					</FormControl>
				</Box>

				{/* Variants Section */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
						mt: '14px',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
						}}
					>
						<Typography className='form-label'>Variants</Typography>
						<Chip
							label={formData.variants.length}
							variant='outlined'
							color='primary'
						/>
					</Box>

					<IconButton
						onClick={handleExpandClick}
						aria-expanded={expanded}
						aria-label='show more'
					>
						<ExpandMoreIcon style={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />
					</IconButton>
				</Box>
				<Collapse
					in={expanded}
					timeout='auto'
					unmountOnExit
				>
					<Box
						sx={{
							'> div': {
								marginTop: '16px',
							},
						}}
					>
						{formData.variants.map((variant: { name: string; price: number; cost: number }, index: number) => (
							<Box
								key={index}
								sx={{
									padding: '12px',
									border: '1px solid #f8f9fd',
									background: '#f7f7f7',
									borderRadius: '6px',
									position: 'relative',

									'> div:not(:first-of-type)': {
										marginTop: '16px',
									},
								}}
							>
								<IconButton
									aria-label='remove'
									sx={{
										position: 'absolute',
										top: '0',
										right: '0',
										cursor: 'pointer',
										zIndex: '2',
										'&:hover': {
											borderRadius: '0',
											background: 'transparent',
										},
									}}
									onClick={() => handleRemoveVariant(index)}
								>
									<IndeterminateCheckBoxOutlinedIcon />
								</IconButton>

								<FormControl fullWidth>
									<Typography className='form-label'>Variant Name</Typography>
									<TextField
										fullWidth
										placeholder='Enter item name'
										type='text'
										name='name'
										value={variant.name || ''}
										onChange={(e) => handleVariantChange(index, e)}
										autoComplete='off'
									/>
								</FormControl>

								<FormControl fullWidth>
									<Typography className='form-label'>Variant Price</Typography>
									<TextField
										fullWidth
										placeholder='Enter price'
										type='number'
										name='price'
										value={variant.price || ''}
										onChange={(e) => handleVariantChange(index, e)}
										autoComplete='off'
									/>
								</FormControl>

								<FormControl fullWidth>
									<Typography className='form-label'>Variant Cost</Typography>
									<TextField
										fullWidth
										placeholder='Enter cost'
										type='number'
										name='cost'
										value={variant.cost || ''}
										onChange={(e) => handleVariantChange(index, e)}
										autoComplete='off'
									/>
								</FormControl>
							</Box>
						))}
					</Box>
					<Button
						variant='outlined'
						onClick={handleAddVariant}
						sx={{
							marginTop: '12px',
						}}
					>
						Add New Variant
					</Button>
				</Collapse>
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

export default ItemForm;
