export const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const formatDate = (date: string | number | Date) => {
	if (!date) return '';
	return new Date(date).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
};

export const generateFilename = () => {
	const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	const timestamp = Date.now();
	return `${randomString}-${timestamp}`;
};
