import { Avatar, Box, ButtonBase, Typography, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from 'react';
import { auth } from '../../../firebase.config.ts';

const Header = ({ handleLeftDrawerToggle }: { handleLeftDrawerToggle: () => void }) => {
	const [currentUser, setCurrentUser] = useState<string | null>(null);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			if (user) {
				setCurrentUser(user.email);
			} else {
				setCurrentUser(null);
			}
		});

		return () => unsubscribe();
	}, []);

	return (
		<>
			<Box
				sx={{
					width: isMobile ? 'max-content' : '260px',
					display: 'flex',
					padding: '16px 0',
					alignItems: 'center',
				}}
			>
				<Box
					component='span'
					sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}
				>
					Logo
				</Box>
				<ButtonBase sx={{ borderRadius: '8px', overflow: 'hidden' }}>
					<Avatar
						variant='rounded'
						sx={{
							transition: 'all .2s ease-in-out',
							background: '#1e88e5',
							color: '#ffffff',
							'&:hover': {
								background: '#1e88e5',
								color: '#ffffff',
							},
						}}
						onClick={handleLeftDrawerToggle}
						color='inherit'
					>
						<MenuIcon />
					</Avatar>
				</ButtonBase>
			</Box>
			<Typography>Welcome, {currentUser}</Typography>
		</>
	);
};

export default Header;
