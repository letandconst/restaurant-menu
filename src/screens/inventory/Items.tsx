import Modal from '../../components/Modal/Modal';
import { useState } from 'react';
import DataTable from '../../components/DataTable/DataTable';

const itemHeaders = ['ID', 'Photo', 'Item Name', 'Item Category', 'Option', 'Price', 'Cost', 'Modifiers'];
const itemData = [
	{ ID: 1, Photo: 'https://fastly.picsum.photos/id/237/200/200.jpg?hmac=zHUGikXUDyLCCmvyww1izLK3R3k8oRYBRiTizZEdyfI', 'Item Name': 'Sample', 'Item Category': 'Meat', Option: ['Small', 'Medium', 'Large'], Price: 50, Cost: 60, Modifiers: '' },

	{ ID: 2, Photo: 'https://fastly.picsum.photos/id/117/200/200.jpg?hmac=hAXY0lMbkjkxYIKxW0UjtazVquGY1NCu3ruHLJGc4gs', 'Item Name': 'Sample 2', 'Item Category': 'Meat', Option: ['Small', 'Medium', 'Large'], Price: 50, Cost: 60, Modifiers: '' },
	{ ID: 3, Photo: 'https://fastly.picsum.photos/id/146/200/200.jpg?hmac=BEfC1fMGgqn0zNUowEDrlnKsAisQSg9rYB7RxuXpTb4', 'Item Name': 'Sample 3', 'Item Category': 'Meat', Option: ['Small', 'Medium', 'Large'], Price: 50, Cost: 60, Modifiers: '' },
	{ ID: 4, Photo: 'https://fastly.picsum.photos/id/838/200/200.jpg?hmac=a2ZUJPqhEFH-OzhHFaKdtDdV2XnIE7t1tP2iXnP5Fj0', 'Item Name': 'Sample 4 ', 'Item Category': 'Meat', Option: ['Small', 'Medium', 'Large'], Price: 50, Cost: 60, Modifiers: '' },
];

const Items = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState('');
	const [modalFields, setModalFields] = useState([]);
	const [initialData, setInitialData] = useState({});

	const handleOpenModal = (title: string, fields: any, initialData = {}) => {
		setModalTitle(title);
		setModalFields(fields);
		setInitialData(initialData);
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
	};

	const handleAddNew = (data: Record<string, any>) => {
		// Handle adding new category logic
		console.log('Add new category:', data);
	};

	const handleEdit = (data: Record<string, any>) => {
		// Handle editing category logic
		console.log('Edit category:', data);
	};

	const addFields = [
		{ name: 'photo', label: 'Photo' },
		{ name: 'itemName', label: 'Item Name' },
		{ name: 'itemCategory', label: 'Item Category' },
		{ name: 'option', label: 'Option' },
		{ name: 'price', label: 'Price' },
		{ name: 'cost', label: 'Cost' },
		{ name: 'modifiers', label: 'Modifiers' },
	];

	const editFields = [
		{ name: 'photo', label: 'Photo' },
		{ name: 'itemName', label: 'Item Name' },
		{ name: 'itemCategory', label: 'Item Category' },
		{ name: 'option', label: 'Option' },
		{ name: 'price', label: 'Price' },
		{ name: 'cost', label: 'Cost' },
		{ name: 'modifiers', label: 'Modifiers' },
	];

	return (
		<>
			<DataTable
				headers={itemHeaders}
				data={itemData}
				onAddNew={() => handleOpenModal('Add New Category', addFields)}
				onEdit={(rowData) => handleOpenModal('Edit Category', editFields, rowData)}
			/>
			<Modal
				open={modalOpen}
				title={modalTitle}
				fields={modalFields}
				onClose={handleCloseModal}
				onSubmit={modalTitle.startsWith('Add') ? handleAddNew : handleEdit}
				initialData={initialData}
			/>
		</>
	);
};

export default Items;
