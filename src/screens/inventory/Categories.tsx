/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import Modal from '../../components/Modal/Modal';
import DeletePopup from '../../components/Modal/modules/DeletePopup.tsx';

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

	const handleOpenModal = (title: string, fields: { name: string; label: string; type?: string }[], initialData: Record<string, any> = {}) => {
		setModalData({
			open: true,
			title,
			fields,
			initialData,
		});
	};

	const handleCloseModal = () => {
		setModalData((prevModalData) => ({
			...prevModalData,
			open: false,
		}));
	};

	const openDeleteConfirmation = (data: Category) => {
		setDeleteCategory(data);
		setShowDeletePopup(true);
	};

	const closeDeleteConfirmation = () => {
		setShowDeletePopup(false);
	};

	const handleAddNew = async (data: Record<string, any>) => {
		try {
			const docRef = await addDoc(collection(db, 'categories'), {
				merchantId: auth.currentUser?.uid,
				...data,
			});
			const newCategory = { id: docRef.id, ...data };
			setCategories((prevCategories) => [...prevCategories, newCategory]);
			handleCloseModal();
		} catch (error) {
			console.error('Error adding new category:', error);
		}
	};

	const handleEdit = async (data: Record<string, any>) => {
		try {
			await updateDoc(doc(db, 'categories', data.id), data);
			const updatedCategories = categories.map((category) => (category.id === data.id ? { ...category, ...data } : category));
			setCategories(updatedCategories);
			handleCloseModal();
		} catch (error) {
			console.error('Error editing category:', error);
		}
	};

	const handleDelete = async (category: Category) => {
		try {
			await deleteDoc(doc(db, 'categories', category.id));
			setCategories(categories.filter((c) => c.id !== category.id));
			setShowDeletePopup(false);
		} catch (error) {
			console.error('Error deleting category:', error);
		}
	};

	const fields = [
		{ name: 'name', label: 'Name' },
		{ name: 'description', label: 'Description' },
	];

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const currentUser = auth.currentUser;
				if (currentUser) {
					const categoriesRef = collection(db, 'categories');
					const categoriesQuery = query(categoriesRef, where('merchantId', '==', currentUser.uid));
					const querySnapshot = await getDocs(categoriesQuery);
					const categoriesData = querySnapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
					setCategories(categoriesData);
				}
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
				headers={['name', 'description']}
				data={categories}
				onAddNew={() => handleOpenModal('Add New Category', fields)}
				onEdit={(rowData) => handleOpenModal('Edit Category', fields, rowData)}
				onDelete={(categoryId) => openDeleteConfirmation(categoryId)}
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
		</>
	);
};

export default Categories;
