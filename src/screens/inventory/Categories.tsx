/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { DataTable, Modal, PopupNotif, DeletePopup } from '../../components';

import { auth, db, storage } from '../../../firebase.config.ts';
import { ref as rtdbRef, push, update, remove } from 'firebase/database';
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage';

import CategoryForm from './modules/CategoryForm.tsx';
import { generateFilename } from '../../utils/helpers.tsx';
import useCategories from '../../hooks/useCategories.ts';
import { Category } from '../../services/models/index.ts';

const Categories = () => {
	const [categories, setCategories] = useState<{ id: string }[]>([]);
	const [data, setData] = useState<{
		open: boolean;
		title: string;
		fields: { name: string; label: string; type?: string }[];
		initialData: Record<string, any>;
	}>({
		open: false,
		title: '',
		fields: [],
		initialData: {},
	});

	const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
	const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
	const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
	const [snackbarMessage, setSnackbarMessage] = useState<string>('');
	const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

	const { categoriesList, loading } = useCategories();

	// Show modal for "Add" or "Edit"
	const handleOpenModal = (title: string, fields: { name: string; label: string; type?: string }[], initialData: Record<string, any> = {}) => {
		setData({
			open: true,
			title,
			fields,
			initialData,
		});
	};

	// Hide modal for "Add" or "Edit"
	const handleCloseModal = () => {
		setData((prevData) => ({
			...prevData,
			open: false,
		}));
	};

	// Show the Delete Confirmation Popup
	const openDeleteConfirmation = (data: Category) => {
		setDeleteCategory(data);
		setShowDeletePopup(true);
	};

	// Hide the Delete Confirmation Popup
	const closeDeleteConfirmation = () => {
		setShowDeletePopup(false);
	};

	// Handle Adding New Category
	const handleAddNew = async (data: Record<string, any>) => {
		try {
			let imageUrl = '';
			if (data.photo) {
				const newFileName = generateFilename();
				const storageRef = ref(storage, `categories/${newFileName}`);
				const snapshot = await uploadBytes(storageRef, data.photo);
				imageUrl = await getDownloadURL(snapshot.ref);
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { photo, ...prevData } = data;

			const newCategoryRef = push(rtdbRef(db, 'categories'));

			const newCategory = {
				id: newCategoryRef.key,
				merchantId: auth.currentUser?.uid,
				createdAt: Date.now(),
				photo: imageUrl,
				...prevData,
			};

			update(newCategoryRef, newCategory);
			setSnackbarMessage('Category added successfully!');
			setSnackbarSeverity('success');
			setSnackbarOpen(true);
			handleCloseModal();
		} catch (error) {
			console.error('Error adding new category:', error);
			setSnackbarMessage('Error adding new category');
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
		}
	};

	// Handle Updating Category
	const handleEdit = async (data: Record<string, any>) => {
		try {
			let imageUrl = data.photo;

			if (data.photo instanceof File) {
				const newFileName = generateFilename();
				const storageRef = ref(storage, `categories/${newFileName}`);
				const snapshot = await uploadBytes(storageRef, data.photo);
				imageUrl = await getDownloadURL(snapshot.ref);
			}

			const updatedData = {
				...data,
				updatedAt: Date.now(),
				photo: imageUrl,
			};

			await update(rtdbRef(db, `categories/${data.id}`), updatedData);

			setSnackbarMessage('Category updated successfully!');
			setSnackbarSeverity('success');
			setSnackbarOpen(true);
			handleCloseModal();
		} catch (error) {
			console.error('Error updating category:', error);
			setSnackbarMessage('Error updating category');
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
		}
	};

	// Handle Deleting Category
	const handleDelete = async (category: Category) => {
		try {
			await remove(rtdbRef(db, `categories/${category.id}`));
			setSnackbarMessage('Category deleted successfully!');
			setSnackbarSeverity('success');
			setSnackbarOpen(true);
			setShowDeletePopup(false);
		} catch (error) {
			console.error('Error deleting category:', error);
			setSnackbarMessage('Error deleting category');
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
		}
	};

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	// Category Table Modal Fields
	const fields = [
		{ name: 'photo', label: 'Photo', type: 'file' },
		{ name: 'name', label: 'Name', type: 'text' },
		{ name: 'description', label: 'Description', type: 'text' },
	];

	// Fetch category by merchant ID in Firebase
	useEffect(() => {
		setCategories(categoriesList);
	}, [categoriesList]);

	return (
		<>
			<DataTable
				tableLabel='Categories'
				headers={['id', 'photo', 'name', 'description', 'createdAt', 'updatedAt']}
				data={categories}
				onAddNew={() => handleOpenModal('Add New Category', fields)}
				onEdit={(rowData) => handleOpenModal('Edit Category', fields, rowData)}
				onDelete={(categoryId) => openDeleteConfirmation(categoryId)}
				loading={loading}
			/>
			<Modal
				open={data.open}
				title={data.title}
				onClose={handleCloseModal}
			>
				<CategoryForm
					initialData={data.initialData}
					onSubmit={data.title.startsWith('Add') ? handleAddNew : handleEdit}
					onClose={handleCloseModal}
				/>
			</Modal>
			<DeletePopup
				open={showDeletePopup}
				onClose={closeDeleteConfirmation}
				onConfirm={() => deleteCategory && handleDelete(deleteCategory)}
			/>
			<PopupNotif
				open={snackbarOpen}
				message={snackbarMessage}
				severity={snackbarSeverity}
				onClose={handleSnackbarClose}
			/>
		</>
	);
};

export default Categories;
