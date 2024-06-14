import { Paper, Box, Typography, Button } from '@mui/material';

const Dashboard = () => {
	return (
		<>
			<Paper
				elevation={3}
				sx={{ padding: '20px' }}
			>
				<Box
					display='flex'
					flexDirection='column'
				>
					<Typography
						variant='h4'
						gutterBottom
					>
						Welcome to your Dashboard!
					</Typography>
					<Typography
						variant='subtitle1'
						sx={{
							maxWidth: '65ch',
						}}
					>
						Manage your inventory efficiently and effortlessly with our comprehensive tools. Keep track of your stock levels, orders, and suppliers all in one place. Stay informed with real-time updates and make data-driven decisions to optimize your inventory.
					</Typography>
					<Box mt={2}>
						<Button
							variant='contained'
							color='primary'
							sx={{ marginRight: '10px' }}
						>
							Get Started
						</Button>
						<Button
							variant='outlined'
							color='primary'
						>
							Learn More
						</Button>
					</Box>
				</Box>
			</Paper>
		</>
	);
};

export default Dashboard;
