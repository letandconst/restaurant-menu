import { Fragment, useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

import { DashboardOutlined, ExpandLess, ExpandMore, Inventory2Outlined, LogoutOutlined } from '@mui/icons-material';
import { Box, Collapse, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, useMediaQuery, useTheme } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
interface SidebarProps {
	open: boolean;
	handleDrawerToggle: () => void;
}

const Sidebar = ({ open, handleDrawerToggle }: SidebarProps) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<>
			{isMobile && open && (
				<Drawer
					className='mobile'
					anchor='left'
					open={open}
					onClose={handleDrawerToggle}
					sx={{
						'& .MuiDrawer-paper': {
							width: '100%',
							maxWidth: '260px',
							padding: '0 16px 12px',
						},
					}}
				>
					<SidebarContent />
				</Drawer>
			)}

			{!isMobile && (
				<Box
					className={`sidebar-desktop ${open ? 'open' : 'closed'}`}
					style={{
						minWidth: '260px',
						transform: open ? 'none' : 'translateX(-260px)',
						display: 'flex',
						flexDirection: 'column',
						transition: 'transform 0.3s ease-in-out',

						height: '100%',
						padding: '100px 24px 12px',
						background: '#ffffff',
						position: 'relative',
						boxShadow: '1px 0 6px rgba(0, 0, 0, 0.1)',
					}}
				>
					<SidebarContent />
					<Box
						sx={{
							position: 'absolute',
							height: '100%',
							right: '-32px',
							display: 'flex',
							justifyContent: 'center',
							top: '71px',
						}}
					>
						<Box
							sx={{
								background: '#1e88e5',
								color: '#ffffff',
								width: '32px',
								height: '32px',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								padding: '24px 0',
								cursor: 'pointer',
								borderTopRightRadius: '8px',
								borderBottomRightRadius: '8px',
							}}
							onClick={handleDrawerToggle}
						>
							<ArrowForwardIosIcon
								sx={{
									transform: `rotate(${open ? '180deg' : '0deg'})`,
								}}
							/>
						</Box>
					</Box>
				</Box>
			)}
		</>
	);
};

const SidebarContent = () => {
	const auth = getAuth();
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const [open, setOpen] = useState<string | null>(localStorage.getItem('activeMenuItem') || 'Dashboard');

	// Handle Navigation Click
	const handleClick = (label: string) => {
		setOpen((prevOpen) => (prevOpen === label ? null : label));
	};

	// Handle Logout
	const handleLogout = async () => {
		try {
			await signOut(auth);
			localStorage.removeItem('uid');
			localStorage.removeItem('activeMenuItem');
			navigate('/signin');
		} catch (error) {
			console.error(error);
		}
	};

	const menuItems = [
		{ label: 'Dashboard', path: '/', icon: <DashboardOutlined /> },
		{
			label: 'Inventory',
			icon: <Inventory2Outlined />,
			subItems: [
				{ label: 'View Items', path: '/items' },
				{ label: 'View Categories', path: '/categories' },
			],
		},
	];

	const logoutMenuItem = { label: 'Logout', icon: <LogoutOutlined />, handler: handleLogout };

	useEffect(() => {
		localStorage.setItem('activeMenuItem', open || '');
	}, [open]);

	return (
		<>
			{isMobile && (
				<Box padding='24px 0 0'>
					<img
						src='logo.png'
						style={{ width: '100%', height: '75px', objectFit: 'contain', display: 'flex' }}
					/>
				</Box>
			)}
			<Box>
				<List
					component='nav'
					sx={{
						'& > * + *': {
							marginTop: '8px',
						},
						padding: '0',
					}}
				>
					{menuItems.map((menuItem, index) => (
						<Fragment key={index}>
							{menuItem.path ? (
								<ListItem
									component={Link}
									to={menuItem.path}
									onClick={() => handleClick(menuItem.label)}
									sx={{
										cursor: 'pointer',
										borderRadius: '6px',
										color: '#000000',

										transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
										userSelect: 'none',
										'&:hover': {
											background: '#1e88e5',
											color: '#ffffff',
											'& .MuiListItemIcon-root': {
												color: '#ffffff',
												transition: 'color 0.3s ease-in-out',
											},
										},
										'& .MuiListItemIcon-root': {
											minWidth: 'max-content',
											marginRight: '16px',
										},
										...(open === menuItem.label && {
											backgroundColor: '#1e88e5',
											color: '#ffffff',
											'& .MuiListItemIcon-root': {
												color: '#ffffff',
												minWidth: 'max-content',
												marginRight: '16px',
											},
										}),
									}}
								>
									<ListItemIcon>{menuItem.icon}</ListItemIcon>
									<ListItemText
										primary={menuItem.label}
										sx={{
											span: {
												fontSize: '14px',
											},
										}}
									/>
								</ListItem>
							) : (
								<ListItem
									onClick={() => handleClick(menuItem.label)}
									sx={{
										cursor: 'pointer',
										borderRadius: '6px',
										color: '#000000',
										fontSize: '14px',
										transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
										userSelect: 'none',
										'&:hover': {
											background: '#1e88e5',
											color: '#ffffff',
											'& .MuiListItemIcon-root': {
												color: '#ffffff',
												transition: 'color 0.3s ease-in-out',
											},
										},
										'& .MuiListItemIcon-root': {
											minWidth: 'max-content',
											marginRight: '16px',
										},

										...(open === menuItem.label && {
											backgroundColor: '#1e88e5',
											color: '#ffffff',
											'& .MuiListItemIcon-root': {
												color: '#ffffff',
												minWidth: 'max-content',
												marginRight: '16px',
											},
										}),
									}}
								>
									<ListItemIcon>{menuItem.icon}</ListItemIcon>
									<ListItemText
										primary={menuItem.label}
										sx={{
											span: {
												fontSize: '14px',
											},
										}}
									/>
									{menuItem.subItems ? open === menuItem.label ? <ExpandLess /> : <ExpandMore /> : null}
								</ListItem>
							)}
							{menuItem.subItems && (
								<Collapse
									in={open === menuItem.label || menuItem.subItems.some((item) => item.label === open)}
									timeout='auto'
									unmountOnExit
								>
									<List
										component='div'
										disablePadding
									>
										{menuItem.subItems.map((subItem, subIndex) => (
											<ListItem
												key={subIndex}
												component={Link}
												to={subItem.path}
												onClick={() => handleClick(subItem.label)}
												sx={{
													marginTop: '4px',
													padding: '0 0 0 52px',
													cursor: 'pointer',
													borderRadius: '6px',
													color: '#000000',
													transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
													userSelect: 'none',
													'&:hover': {
														color: '#1e88e5',
														background: 'transparent',
														transition: 'color 0.3s ease-in-out',
													},
													...(open === subItem.label && {
														color: '#1e88e5',
														background: 'transparent',
													}),
												}}
											>
												<ListItemText
													primary={subItem.label}
													sx={{
														span: {
															fontSize: '14px',
														},
													}}
												/>
											</ListItem>
										))}
									</List>
								</Collapse>
							)}
						</Fragment>
					))}
				</List>
			</Box>

			<Box
				onClick={logoutMenuItem.handler}
				sx={{
					margin: 'auto 0 4px',
					padding: '8px 16px',
					display: 'flex',
					alignItems: 'center',
					width: '100%',
					cursor: 'pointer',
					borderRadius: '6px',
					color: '#000000',
					boxSizing: 'border-box',

					transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
					userSelect: 'none',
					'&:hover': {
						background: '#1e88e5',
						color: '#ffffff',
						'& .icon': {
							color: '#ffffff',
							transition: 'color 0.3s ease-in-out',
						},
					},
					'& .icon': {
						minWidth: 'max-content',
						marginRight: '16px',
						display: 'flex',
					},
				}}
			>
				<Box className='icon'>{logoutMenuItem.icon}</Box>
				<Typography>{logoutMenuItem.label}</Typography>
			</Box>
		</>
	);
};

export default Sidebar;
