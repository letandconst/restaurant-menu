import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import { Category } from '../services/models/Category';

const useCategories = () => {
	const [categoriesList, setCategoriesList] = useState<{ id: string }[]>([]);
	const [categoryNames, setCategoryNames] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
					if (currentUser) {
						const categoriesRef = collection(db, 'categories');
						const categoriesQuery = query(categoriesRef, where('merchantId', '==', currentUser.uid));
						const querySnapshot = await getDocs(categoriesQuery);
						const categoriesData = querySnapshot.docs.map(
							(doc) =>
								({
									id: doc.id,
									...doc.data(),
								} as Category)
						);

						setCategoriesList(categoriesData);
						setCategoryNames(categoriesData.map((category) => category.name));
						setLoading(false);
					} else {
						setCategoriesList([]);
						setCategoryNames([]);
						setLoading(true);
					}
				});

				return () => unsubscribe();
			} catch (error) {
				console.error('Error fetching categories:', error);
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	return { categoriesList, categoryNames, loading };
};

export default useCategories;
