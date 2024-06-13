import { useState, useEffect } from 'react';
import { onValue, ref } from 'firebase/database';
import { auth, db } from '../../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';

const useCategories = () => {
	const [categoriesList, setCategoriesList] = useState<{ id: string }[]>([]);
	const [categoryNames, setCategoryNames] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		let unsubscribe = () => {};

		const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
			if (!user) {
				setLoading(false);
				return;
			}

			const categoryRef = ref(db, 'categories');

			unsubscribe = onValue(
				categoryRef,
				(snapshot) => {
					const categoriesData = snapshot.val();

					if (!categoriesData) {
						console.warn('No data found');
						setCategoriesList([]);
						setCategoryNames([]);
						setLoading(false);
						return;
					}

					const categoriesArray = [];
					const namesArray = [];

					for (const key in categoriesData) {
						if (categoriesData[key].merchantId === user.uid) {
							categoriesArray.push({ id: key, ...categoriesData[key] });
							namesArray.push(categoriesData[key].name);
						}
					}

					setCategoriesList(categoriesArray);
					setCategoryNames(namesArray);
					setLoading(false);
				},
				(error) => {
					console.error('Error fetching categories:', error);
					setLoading(false);
				}
			);
		});

		return () => {
			unsubscribeAuth();
			unsubscribe();
		};
	}, []);

	return { categoriesList, categoryNames, loading };
};

export default useCategories;
