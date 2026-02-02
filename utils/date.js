export const formatDate = (date) => {
	try {
		const d = new Date(date);
		const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
		return d.toLocaleDateString('id-ID', options);
	} catch (error) {
		console.warn('Date format error:', error);
		return date;
	}
};
