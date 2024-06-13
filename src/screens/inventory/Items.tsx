/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { DataTable, DeletePopup, Modal, PopupNotif } from '../../components';
import ItemForm from './modules/ItemForm';

import useItems from '../../hooks/useItems';

import { auth, db, storage } from '../../../firebase.config';
import { push, remove, ref as rtdbRef, update } from 'firebase/database';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { generateFilename } from '../../utils/helpers';

import { Item } from '../../services/models';

const Items = () => {
	const [data, setData] = useState<{
		open: boolean;
		title: string;
		fields: { name: string; label: string; type?: string }[];
		initialData: Record<string, any>;
	}>({
		open: false,
		title: '',
		fields: [],
		initialData: {
			itemName: '',
			category: '',
			price: '',
			variants: [{ name: '', price: '', cost: '' }],
		},
	});

	const [deleteItem, setDeleteItem] = useState<Item | null>(null);
	const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
	const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
	const [snackbarMessage, setSnackbarMessage] = useState<string>('');
	const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

	const { itemList, loading } = useItems();

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
	const openDeleteConfirmation = (data: Item) => {
		setDeleteItem(data);
		setShowDeletePopup(true);
	};

	// Hide the Delete Confirmation Popup
	const closeDeleteConfirmation = () => {
		setShowDeletePopup(false);
	};

	const handleAddNew = async (data: Record<string, any>) => {
		try {
			let imageUrl = '';
			if (data.photo) {
				const newFileName = generateFilename();
				const storageRef = ref(storage, `items/${newFileName}`);
				const snapshot = await uploadBytes(storageRef, data.photo);
				imageUrl = await getDownloadURL(snapshot.ref);
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { photo, ...prevData } = data;

			const newItemRef = push(rtdbRef(db, 'items'));

			const newItem = {
				id: newItemRef.key,
				merchantId: auth.currentUser?.uid,
				createdAt: Date.now(),
				photo: imageUrl,
				...prevData,
			};

			update(newItemRef, newItem);
			setSnackbarMessage('Item added successfully!');
			setSnackbarSeverity('success');
			setSnackbarOpen(true);
			handleCloseModal();
		} catch (error) {
			console.error('Error adding new Item:', error);
			setSnackbarMessage('Error adding new Item');
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
		}
	};

	const handleEdit = async (data: Record<string, any>) => {
		try {
			let imageUrl = data.photo;

			if (data.photo instanceof File) {
				const newFileName = generateFilename();
				const storageRef = ref(storage, `categories/${newFileName}`);
				const snapshot = await uploadBytes(storageRef, data.photo);
				imageUrl = await getDownloadURL(snapshot.ref);
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { photo, ...prevData } = data;

			const itemRef = rtdbRef(db, `items/${data.id}`);

			const updatedItem = {
				...prevData,
				photo: imageUrl,
				updatedAt: Date.now(),
			};

			await update(itemRef, updatedItem);
			setSnackbarMessage('Item updated successfully!');
			setSnackbarSeverity('success');
			setSnackbarOpen(true);
			handleCloseModal();
		} catch (error) {
			console.error('Error updating Item:', error);
			setSnackbarMessage('Error updating Item');
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
		}
	};

	const handleDelete = async (item: Item) => {
		try {
			const itemRef = rtdbRef(db, `items/${item.id}`);
			await remove(itemRef);
			setSnackbarMessage('Item deleted successfully!');
			setSnackbarSeverity('success');
			setSnackbarOpen(true);
		} catch (error) {
			console.error('Error deleting Item:', error);
			setSnackbarMessage('Error deleting Item');
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
		}
	};

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	const fields = [
		{ name: 'photo', label: 'Photo', type: 'file' },
		{ name: 'itemName', label: 'Item Name', type: 'text' },
		{ name: 'itemCategory', label: 'Item Category', type: 'select' },
		{ name: 'option', label: 'Option', type: 'text' },
		{ name: 'price', label: 'Price', type: 'number' },
		{ name: 'cost', label: 'Cost', type: 'number' },
	];

	return (
		<>
			<DataTable
				tableLabel='Items'
				headers={['id', 'photo', 'name', 'category', 'variants', 'price', 'cost']}
				data={itemList}
				onAddNew={() => handleOpenModal('Add New Item', fields)}
				onEdit={(rowData) => handleOpenModal('Edit Item', fields, rowData)}
				onDelete={(itemId) => openDeleteConfirmation(itemId)}
				loading={loading}
			/>
			<Modal
				open={data.open}
				title={data.title}
				onClose={handleCloseModal}
			>
				<ItemForm
					initialData={data.initialData}
					onSubmit={data.title.startsWith('Add') ? handleAddNew : handleEdit}
					onClose={handleCloseModal}
				/>
			</Modal>
			<DeletePopup
				open={showDeletePopup}
				onClose={closeDeleteConfirmation}
				onConfirm={() => deleteItem && handleDelete(deleteItem)}
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

export default Items;
