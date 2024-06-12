import { useState, useEffect } from 'react';
import { onValue, ref } from 'firebase/database';
import { auth, db } from '../../firebase.config';

const useItems = () => {
	const [itemList, setItemList] = useState<{ id: string }[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const itemRef = ref(db, 'items');
		const user = auth.currentUser;

		const fetchItems = () => {
			onValue(
				itemRef,
				(snapshot) => {
					const itemData = snapshot.val();
					const itemArray = [];

					for (const key in itemData) {
						if (itemData[key].merchantId === user?.uid) {
							itemArray.push({ id: key, ...itemData[key] });
						}
					}
					setItemList(itemArray);

					setLoading(false);
				},
				(error) => {
					console.error('Error fetching items:', error);
					setLoading(false);
				}
			);
		};

		if (user) {
			fetchItems();
		}

		return () => {
			onValue(itemRef, () => {});
		};
	}, []);
	return { itemList, loading };
};

export default useItems;
