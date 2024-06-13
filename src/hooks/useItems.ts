import { useState, useEffect } from 'react';
import { onValue, ref } from 'firebase/database';
import { auth, db } from '../../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';

const useItems = () => {
	const [itemList, setItemList] = useState<{ id: string }[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		let unsubscribe = () => {};

		const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
			if (!user) {
				setLoading(false);
				return;
			}

			const itemRef = ref(db, 'items');

			unsubscribe = onValue(
				itemRef,
				(snapshot) => {
					const itemData = snapshot.val();

					if (!itemData) {
						console.warn('No data found');
						setItemList([]);
						setLoading(false);
						return;
					}

					const itemsArr = [];

					for (const key in itemData) {
						if (itemData[key].merchantId === user.uid) {
							itemsArr.push({ id: key, ...itemData[key] });
						}
					}

					setItemList(itemsArr);

					setLoading(false);
				},
				(error) => {
					console.error('Error fetching items:', error);
					setLoading(false);
				}
			);
		});

		return () => {
			unsubscribeAuth();
			unsubscribe();
		};
	}, []);

	return { itemList, loading };
};

export default useItems;
