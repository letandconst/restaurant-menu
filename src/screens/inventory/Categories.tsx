/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { DataTable, Modal, PopupNotif, DeletePopup } from '../../components';

import { auth, db } from '../../../firebase.config.ts';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { Category } from '../../services/models/Category.ts';

const Categories = () => {
	const [categories, setCategories] = useState<{ id: string }[]>([]);
	const [modalData, setModalData] = useState<{
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
	const [loading, setLoading] = useState<boolean>(true);

	// Show modal for "Add" or "Edit"
	const handleOpenModal = (title: string, fields: { name: string; label: string; type?: string }[], initialData: Record<string, any> = {}) => {
		setModalData({
			open: true,
			title,
			fields,
			initialData,
		});
	};

	// Hide modal for "Add" or "Edit"
	const handleCloseModal = () => {
		setModalData((prevModalData) => ({
			...prevModalData,
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
			const docRef = await addDoc(collection(db, 'categories'), {
				merchantId: auth.currentUser?.uid,
				...data,
			});
			const newCategory = { id: docRef.id, ...data };
			setCategories((prevCategories) => [...prevCategories, newCategory]);
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
			await updateDoc(doc(db, 'categories', data.id), data);
			const updatedCategories = categories.map((category) => (category.id === data.id ? { ...category, ...data } : category));
			setCategories(updatedCategories);
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
			await deleteDoc(doc(db, 'categories', category.id));
			setCategories(categories.filter((c) => c.id !== category.id));
			setSnackbarMessage('Category deleted successfully!');
			setSnackbarSeverity('success');
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
		{ name: 'name', label: 'Name' },
		{ name: 'description', label: 'Description' },
	];

	// Fetch category by merchant ID in Firebase
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
					console.log('current', currentUser);
					if (currentUser) {
						const categoriesRef = collection(db, 'categories');
						const categoriesQuery = query(categoriesRef, where('merchantId', '==', currentUser.uid));
						const querySnapshot = await getDocs(categoriesQuery);
						const categoriesData = querySnapshot.docs.map((doc) => ({
							id: doc.id,
							...doc.data(),
						}));
						setCategories(categoriesData);
						setLoading(false);
					} else {
						setCategories([]);
						setLoading(true);
					}
				});

				return () => unsubscribe();
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		};

		fetchCategories();
	}, []);

	return (
		<>
			<DataTable
				tableLabel='Categories'
				headers={['id', 'name', 'description']}
				data={categories}
				onAddNew={() => handleOpenModal('Add New Category', fields)}
				onEdit={(rowData) => handleOpenModal('Edit Category', fields, rowData)}
				onDelete={(categoryId) => openDeleteConfirmation(categoryId)}
				loading={loading}
			/>
			<Modal
				open={modalData.open}
				title={modalData.title}
				fields={modalData.fields}
				onClose={handleCloseModal}
				onSubmit={modalData.title.startsWith('Add') ? handleAddNew : handleEdit}
				initialData={modalData.initialData}
			/>
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
