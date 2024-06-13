import { useState, useEffect } from 'react';
import { onValue, ref } from 'firebase/database';
import { auth, db } from '../../firebase.config';

const useCategories = () => {
	const [categoriesList, setCategoriesList] = useState<{ id: string }[]>([]);
	const [categoryNames, setCategoryNames] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const categoryRef = ref(db, 'categories');
		const user = auth.currentUser;
		let unsubscribe = () => {};

		const fetchCategories = () => {
			unsubscribe = onValue(
				categoryRef,
				(snapshot) => {
					const categoriesData = snapshot.val();
					const categoriesArray = [];
					const namesArray = [];
					for (const key in categoriesData) {
						if (categoriesData[key].merchantId === user?.uid) {
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
		};

		if (user) {
			fetchCategories();
		} else {
			setLoading(false);
		}

		return () => {
			unsubscribe();
		};
	}, []);
	return { categoriesList, categoryNames, loading };
};

export default useCategories;
