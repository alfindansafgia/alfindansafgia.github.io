export const getMemoryField = (memory, field, defaultValue = null) => {
	if (!memory) return defaultValue;
	return memory[field] !== undefined && memory[field] !== null && memory[field] !== '' 
		? memory[field] 
		: defaultValue;
};

export const hasMemoryField = (memory, field) => {
	if (!memory) return false;
	const value = memory[field];
	if (value === undefined || value === null || value === '') return false;
	if (Array.isArray(value)) return value.length > 0;
	return true;
};

export const getMemoryCategory = (memory) => {
	return getMemoryField(memory, 'category', 'tanpa-kategori');
};

export const getMemoryDate = (memory) => {
	return getMemoryField(memory, 'date', null);
};

export const getMemoryLocation = (memory) => {
	return getMemoryField(memory, 'location', null);
};

export const getMemoryDescription = (memory) => {
	return getMemoryField(memory, 'description', null);
};

export const getMemoryImages = (memory) => {
	const images = getMemoryField(memory, 'images', []);
	return Array.isArray(images) ? images : [];
};

export const getMemoryMoments = (memory) => {
	const moments = getMemoryField(memory, 'memories', []);
	return Array.isArray(moments) ? moments : [];
};

export const formatMemoryDate = (memory) => {
	const date = getMemoryDate(memory);
	if (!date) return 'Tanggal tidak tercatat';
	try {
		const d = new Date(date);
		const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
		return d.toLocaleDateString('id-ID', options);
	} catch (error) {
		return date;
	}
};

export const formatMemoryLocation = (memory) => {
	const location = getMemoryLocation(memory);
	return location || 'Lokasi tidak tercatat';
};

export const formatMemoryCategory = (memory) => {
	const category = getMemoryCategory(memory);
	if (category === 'tanpa-kategori') return 'Tanpa Kategori';
	return category.charAt(0).toUpperCase() + category.slice(1);
};
