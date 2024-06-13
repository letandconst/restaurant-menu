export interface Category {
	id: string;
	name: string;
	description: string;
	merchantId: string;
}

export interface Item {
	id: string;
	name: string;
	category: string;
	price: number;
	cost: number;
	photo: string;
	variants: [];
}
