import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';

import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { auth, db } from '../../../firebase.config.ts';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProp {
	handleDrawerToggle: () => void;
}

const Header = ({ handleDrawerToggle }: HeaderProp) => {
	const [currentUser, setCurrentUser] = useState<string | null>(null);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			if (user) {
				const userRef = ref(db, `merchants/${user.uid}`);
				get(userRef)
					.then((snapshot) => {
						if (snapshot.exists()) {
							const userData = snapshot.val();
							setCurrentUser(userData.businessName);
						} else {
							setCurrentUser(null);
						}
					})
					.catch((error) => {
						console.error('Error fetching user:', error);
						setCurrentUser(null);
					});
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
					padding: '6px 0',
					alignItems: 'center',
				}}
			>
				<Box
					component='span'
					sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1 }}
				>
					<img
						src='logo.png'
						style={{ height: '50px', display: 'flex' }}
					/>
				</Box>
				{isMobile && (
					<Button
						onClick={handleDrawerToggle}
						variant='contained'
						sx={{
							minWidth: 'auto',
							width: '48px',
							height: '48px',
						}}
					>
						<MenuIcon />
					</Button>
				)}
			</Box>
			<Typography>Hello, {currentUser}</Typography>
		</>
	);
};

export default Header;
