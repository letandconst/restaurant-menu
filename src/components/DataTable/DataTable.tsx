/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChangeEvent, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, InputAdornment, Button, Grid, IconButton, CircularProgress, useMediaQuery, useTheme, Typography } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';

interface DataTableProps {
	tableLabel: string;
	headers: string[];
	data: any[];
	onAddNew: () => void;
	onEdit: (row: any) => void;
	onDelete: (row: any) => void;
}

const DataTable = ({ tableLabel, headers, data, onAddNew, onEdit, onDelete }: DataTableProps) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(5);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(true);

	const handleChangePage = (_event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const filteredData = data.filter((row) => headers.some((header) => row[header].toString().toLowerCase().includes(searchQuery.toLowerCase())));

	// Loading State Simulation
	useEffect(() => {
		const timeout = setTimeout(() => {
			setLoading(false);
		}, 500);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<Paper
			sx={{
				padding: '16px',
			}}
		>
			<Grid
				container
				spacing={2}
				alignItems='center'
				justifyContent='space-between'
				style={{ padding: '10px' }}
			>
				<Grid
					item
					sx={{
						display: 'flex',
						gap: '10px',
						alignItems: 'center',
					}}
				>
					<CategoryIcon />
					<Typography
						sx={{
							fontSize: '20px',
							textTransform: 'uppercase',
							fontWeight: '700',
						}}
					>
						{tableLabel}
					</Typography>
				</Grid>
				<Grid item>
					<Grid
						container
						spacing={2}
						alignItems='center'
					>
						<Grid
							item
							sx={{}}
						>
							<TextField
								placeholder='Search'
								variant='outlined'
								onChange={handleSearchChange}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<SearchIcon />
										</InputAdornment>
									),
								}}
								sx={{
									input: {
										padding: '7px!important',
									},
								}}
							/>
						</Grid>
						<Grid
							item
							sx={{
								'@media screen and (max-width:475px)': {
									width: '100%',
								},
							}}
						>
							<Button
								variant='contained'
								color='primary'
								onClick={onAddNew}
								startIcon={<AddIcon />}
							>
								Add New
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			;
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							{headers.map((header, index) => (
								<TableCell key={index}>
									<strong>{header.charAt(0).toUpperCase() + header.slice(1)}</strong>
								</TableCell>
							))}
							<TableCell>
								<strong>Actions</strong>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell
									colSpan={headers.length + 1}
									align='center'
								>
									<CircularProgress />
								</TableCell>
							</TableRow>
						) : filteredData.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={headers.length + 1}
									align='center'
								>
									No data found
								</TableCell>
							</TableRow>
						) : (
							filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
								<TableRow key={rowIndex}>
									{headers.map((header, colIndex) => (
										<TableCell key={colIndex}>
											{header === 'Photo' ? (
												<img
													src={row[header]}
													alt='Item'
													style={{ width: 50, height: 50 }}
												/>
											) : typeof row[header] === 'string' ? (
												row[header].charAt(0).toUpperCase() + row[header].slice(1)
											) : (
												row[header]
											)}
										</TableCell>
									))}
									<TableCell
										sx={{
											'> button': {
												borderRadius: '4px',
												color: '#ffffff',
												'&.edit': {
													background: '#ffbc34',
												},
												'&.delete': {
													background: '#f62d51',
												},
												'&:last-of-type': {
													margin: isMobile ? '8px 0 0' : '0 0 0 8px',
												},
											},
										}}
									>
										<IconButton
											onClick={() => onEdit(row)}
											className='edit'
										>
											<EditIcon />
										</IconButton>
										<IconButton
											onClick={() => onDelete(row)}
											className='delete'
										>
											<DeleteIcon />
										</IconButton>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				component='div'
				count={filteredData.length}
				page={page}
				onPageChange={handleChangePage}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				rowsPerPageOptions={[5, 10, 25]}
			/>
		</Paper>
	);
};

export default DataTable;
