import { useState } from 'react';
import { DataTable, Modal } from '../../components';

const itemHeaders = ['ID', 'Photo', 'Item Name', 'Item Category', 'Option', 'Price', 'Cost', 'Modifiers'];
const itemData = [
	{ ID: 1, photo: '', 'Item Name': 'Sample', 'Item Category': 'Meat', Option: ['Small', 'Medium', 'Large'], Price: 50, Cost: 60, Modifiers: '' },

	{ ID: 2, photo: '', 'Item Name': 'Sample 2', 'Item Category': 'Meat', Option: ['Small', 'Medium', 'Large'], Price: 50, Cost: 60, Modifiers: '' },
	{ ID: 3, photo: '', 'Item Name': 'Sample 3', 'Item Category': 'Meat', Option: ['Small', 'Medium', 'Large'], Price: 50, Cost: 60, Modifiers: '' },
	{ ID: 4, photo: '', 'Item Name': 'Sample 4 ', 'Item Category': 'Meat', Option: ['Small', 'Medium', 'Large'], Price: 50, Cost: 60, Modifiers: '' },
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

	const fields = [
		{ name: 'photo', label: 'Photo', type: 'file' },
		{ name: 'itemName', label: 'Item Name', type: 'text' },
		{ name: 'itemCategory', label: 'Item Category', type: 'select', options: ['Category1', 'Category2', 'Category3'] },
		{ name: 'option', label: 'Option', type: 'text' },
		{ name: 'price', label: 'Price', type: 'number' },
		{ name: 'cost', label: 'Cost', type: 'number' },
		{ name: 'modifiers', label: 'Modifiers', type: 'text' },
	];

	return (
		<>
			<DataTable
				tableLabel='Items'
				headers={itemHeaders}
				data={itemData}
				onAddNew={() => handleOpenModal('Add New Item', fields)}
				onEdit={(rowData) => handleOpenModal('Edit Item', fields, rowData)}
				onDelete={(itemId) => console.log('item', itemId)}
				loading={false}
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
