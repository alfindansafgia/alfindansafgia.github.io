export const debounce = (func, delay = 300) => {
	let timeoutId;
	return function debounced(...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func.apply(this, args), delay);
	};
};

export const safeQuery = (selector, parent = document) => {
	try {
		return parent.querySelector(selector);
	} catch (error) {
		console.warn(`Query error for selector "${selector}":`, error);
		return null;
	}
};

export const escapeHtml = (text) => {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
};
