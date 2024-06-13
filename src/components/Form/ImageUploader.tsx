import { ChangeEvent, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface ImageUploaderProps {
	preview: string | ArrayBuffer | null;
	handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploader = ({ preview, handleFileChange }: ImageUploaderProps) => {
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleUploadClick = () => {
		if (inputRef.current) {
			inputRef.current.click();
		}
	};

	// Image Placeholder
	const placeholder = `https://firebasestorage.googleapis.com/v0/b/${import.meta.env.VITE_FB_STORAGE_BUCKET}/o/placeholder-image.jpg?alt=media&token=bd12a37e-cc54-45b1-b75e-5411bd3a3571`;

	return (
		<Box>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: '16px',
				}}
			>
				<Box>
					<Typography mb='8px'>Product Image</Typography>
					<img
						src={preview ? (preview as string) : placeholder}
						alt='Preview'
						style={{
							width: '125px',
							height: '125px',
							objectFit: 'cover',
							borderRadius: '8px',
							border: '1px solid rgba(0,0,0,0.2)',
						}}
						loading='lazy'
					/>
				</Box>
				<Button
					variant='outlined'
					onClick={handleUploadClick}
				>
					Upload Image
				</Button>
			</Box>

			<input
				ref={inputRef}
				type='file'
				accept='image/*'
				name='photo'
				onChange={handleFileChange}
				style={{
					display: 'none',
				}}
			/>
		</Box>
	);
};

export default ImageUploader;
