import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { auth, db } from '../../../firebase.config.ts';

const Header = () => {
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
			</Box>
			<Typography>Hello, {currentUser}</Typography>
		</>
	);
};

export default Header;
