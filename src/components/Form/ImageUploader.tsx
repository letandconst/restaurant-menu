import { ChangeEvent, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

interface ImageUploaderProps {
	preview: string | ArrayBuffer | null;
	handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

// const ImageUploader = ({ preview, handleFileChange }: ImageUploaderProps) => {
// 	return (
// 		<Box
// 			sx={{
// 				width: '250px',
// 				height: '150px',
// 				border: '1px solid #ccc',
// 				display: 'flex',
// 				justifyContent: 'center',
// 				alignItems: 'center',
// 				position: 'relative',
// 				overflow: 'hidden',
// 				flexDirection: 'column',
// 				gap: '12px',
// 				minWidth: '250px',
// 			}}
// 		>
// 			{preview ? (
// 				<img
// 					src={preview ? (preview as string) : undefined}
// 					alt='Preview'
// 					style={{
// 						height: '100%',
// 						objectFit: 'cover',
// 						width: '100%',
// 					}}
// 				/>
// 			) : (
// 				<Box
// 					sx={{
// 						display: 'flex',
// 						position: 'absolute',
// 						height: '100%',
// 						justifyContent: 'center',
// 						alignItems: 'center',
// 						flexDirection: 'column',
// 						gap: '8px',
// 						width: '100%',
// 						fontSize: '14px',
// 						color: '#000000',
// 						background: 'rgba(0, 0, 0, 0.04)',
// 						fontFamily: 'Roboto',
// 					}}
// 				>
// 					<FileUploadOutlinedIcon sx={{ fontSize: 40 }} />
// 					<span>Upload Image</span>
// 				</Box>
// 			)}

// 			<input
// 				type='file'
// 				accept='image/*'
// 				name='photo'
// 				onChange={handleFileChange}
// 				style={{
// 					display: 'block',
// 					width: '100%',
// 					height: '100%',
// 					opacity: 0,
// 					position: 'absolute',
// 					top: 0,
// 					left: 0,
// 					cursor: 'pointer',
// 				}}
// 			/>
// 		</Box>
// 	);
// };

const ImageUploader = ({ preview, handleFileChange }: ImageUploaderProps) => {
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleUploadClick = () => {
		if (inputRef.current) {
			inputRef.current.click();
		}
	};

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
						src={preview ? (preview as string) : 'https://fastly.picsum.photos/id/1058/200/200.jpg?hmac=EF_mUeWbCxK5wJj7PuNrLKm7kBMu2DBtQXuGQg6p_gA'}
						alt='Preview'
						style={{
							width: '125px',
							height: '125px',
							objectFit: 'cover',
							borderRadius: '8px',
						}}
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
