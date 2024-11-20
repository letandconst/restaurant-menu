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
					sx={{ justifyContent: 'space-between', boxShadow: 'rgba(0, 0, 0, 0.1) 0 1px', padding: isMobile ? '8px 16px' : '0' }}
				>
					<Header handleDrawerToggle={handleShowSidebar} />
				</Toolbar>
			</AppBar>
			<Box
				sx={{
					display: 'flex',
					boxSizing: 'border-box',
					padding: '0',
					height: '100vh',
				}}
			>
				<Sidebar
					open={isSidebarOpen}
					handleDrawerToggle={handleShowSidebar}
				/>
				<Box
					sx={{
						flexGrow: 1,
						marginLeft: isSidebarOpen && !isMobile ? '0' : isMobile ? '0' : '-260px',
						background: '#f6f7f8',
						padding: isMobile ? '125px 32px 32px' : '130px 32px 32px',
						width: '100%',
						transition: 'margin-left 0.3s ease-in-out',
						height: '100%',
						overflow: 'auto',
					}}
				>
					<Outlet />
				</Box>
			</Box>
		</>
	);
};

export default Layout;
