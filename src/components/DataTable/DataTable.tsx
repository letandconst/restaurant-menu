/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, InputAdornment, Button, Grid, IconButton, CircularProgress, useMediaQuery, useTheme, Typography, Box } from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Category as CategoryIcon, ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon } from '@mui/icons-material';
import { formatDate } from '../../utils/helpers';

interface DataTableProps {
	tableLabel: string;
	headers: string[];
	data: any[];
	onAddNew: () => void;
	onEdit: (row: any) => void;
	onDelete: (row: any) => void;
	loading: boolean;
}

const DataTable = ({ tableLabel, headers, data, onAddNew, onEdit, onDelete, loading }: DataTableProps) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [order, setOrder] = useState<'asc' | 'desc'>('asc');
	const [orderBy, setOrderBy] = useState<string>('');

	// Handle pagination
	const handleChangePage = (_event: unknown, newPage: number) => {
		setPage(newPage);
	};

	// Handle search query
	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Handle sorting
	const handleSort = (property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const sortData = (array: any[], comparator: (a: any, b: any) => number) => {
		const stabilizedThis = array.map((el, index) => [el, index] as [any, number]);
		stabilizedThis.sort((a, b) => {
			const order = comparator(a[0], b[0]);
			if (order !== 0) return order;
			return a[1] - b[1];
		});
		return stabilizedThis.map((el) => el[0]);
	};

	const getComparator = (order: 'asc' | 'desc', orderBy: string) => {
		return order === 'desc' ? (a: any, b: any) => (b[orderBy] < a[orderBy] ? -1 : 1) : (a: any, b: any) => (a[orderBy] < b[orderBy] ? -1 : 1);
	};

	const filteredData = data.filter((row) => headers.some((header) => row[header].toString().toLowerCase().includes(searchQuery.toLowerCase())));

	const formattedData = filteredData.map((row) => {
		return {
			...row,
			createdAt: formatDate(row.createdAt),
			updatedAt: formatDate(row.updatedAt),
		};
	});

	const sortedData = sortData(formattedData, getComparator(order, orderBy));

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

			<TableContainer>
				<Table>
					<TableHead
						sx={{
							background: 'rgba(0, 0, 0, 0.04)',
						}}
					>
						<TableRow>
							{headers.map((header, index) => {
								const formattedHeader = header === 'createdAt' ? 'Date Created' : header === 'updatedAt' ? 'Date Updated' : header;
								return (
									<TableCell
										key={index}
										onClick={() => handleSort(header)}
										style={{ cursor: 'pointer' }}
									>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												gap: '4px',
											}}
										>
											<strong>{index === 0 ? formattedHeader.toUpperCase() : formattedHeader.charAt(0).toUpperCase() + formattedHeader.slice(1)}</strong>
											{orderBy === header ? order === 'asc' ? <ArrowUpwardIcon fontSize='small' /> : <ArrowDownwardIcon fontSize='small' /> : null}
										</Box>
									</TableCell>
								);
							})}
							<TableCell>
								<strong>Actions</strong>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody
						sx={{
							td: {
								padding: '8px 16px',
							},
							tr: {
								'&:hover': {
									background: 'rgba(0, 0, 0, 0.04)',
								},
							},
						}}
					>
						{loading ? (
							<TableRow>
								<TableCell
									colSpan={headers.length + 1}
									align='center'
								>
									<CircularProgress />
								</TableCell>
							</TableRow>
						) : sortedData.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={headers.length + 1}
									align='center'
								>
									No data found
								</TableCell>
							</TableRow>
						) : (
							sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
								<TableRow key={rowIndex}>
									{headers.map((header, colIndex) => (
										<TableCell
											key={colIndex}
											style={{ width: tableLabel === 'Categories' && colIndex === 3 ? 450 : undefined }}
										>
											{header === 'photo' ? (
												<img
													src={row[header] ? row[header] : 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'}
													alt='Item'
													style={{ width: 50, height: 50, borderRadius: 8 }}
												/>
											) : header === 'id' ? (
												rowIndex + 1
											) : header === 'variants' ? (
												<ul>
													{row[header].map((variant: any, index: number) => (
														<li key={index}>
															Name: {variant.name}, Price: {variant.price}, Cost: {variant.cost}
														</li>
													))}
												</ul>
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
				rowsPerPageOptions={[5, 10, 20, 30, 50]}
			/>
		</Paper>
	);
};

export default DataTable;
