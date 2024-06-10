import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppBar, Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar';

const Layout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
		const savedState = localStorage.getItem('isSidebarOpen');
		return savedState === 'true';
	});

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const handleShowSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	useEffect(() => {
		const handleResize = () => {
			if (!isMobile) {
				setIsSidebarOpen(false);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [isMobile]);

	useEffect(() => {
		localStorage.setItem('isSidebarOpen', isSidebarOpen.toString());
	}, [isSidebarOpen]);

	return (
		<>
			<AppBar
				position='fixed'
				color='inherit'
				elevation={0}
			>
				<Toolbar
					variant='dense'
					sx={{ justifyContent: 'space-between' }}
				>
					<Header handleLeftDrawerToggle={handleShowSidebar} />
				</Toolbar>
			</AppBar>
			<Box
				sx={{
					display: 'flex',
					boxSizing: 'border-box',
					padding: isMobile ? '0 16px' : '0 18px 0 ',
					height: 'calc(100vh - 75px)',
				}}
			>
				<Sidebar
					open={isSidebarOpen}
					handleDrawerToggle={handleShowSidebar}
				/>
				<Box
					sx={{
						flexGrow: 1,
						marginLeft: isSidebarOpen && !isMobile ? '8px' : isMobile ? '0' : '-260px',
						marginTop: '72px',
						background: '#b4bacf',
						borderTopLeftRadius: '8px',
						borderTopRightRadius: '8px',
						width: '100%',
						transition: 'margin-left 0.3s ease-in-out',
						height: '100%',
					}}
				>
					<Outlet />
				</Box>
			</Box>
		</>
	);
};

export default Layout;
