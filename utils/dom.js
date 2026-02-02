export const createElement = (tag, options = {}) => {
	const element = document.createElement(tag);
	if (options.classes) {
		const classes = Array.isArray(options.classes) ? options.classes : [options.classes];
		const filteredClasses = classes.filter(cls => cls && cls.trim() !== '');
		if (filteredClasses.length > 0) {
			element.classList.add(...filteredClasses);
		}
	}
	if (options.attributes) {
		Object.entries(options.attributes).forEach(([key, value]) => {
			element.setAttribute(key, value);
		});
	}
	if (options.content) {
		if (typeof options.content === 'string') {
			element.innerHTML = options.content;
		} else if (options.content instanceof Element) {
			element.appendChild(options.content);
		}
	}
	if (options.parent) {
		options.parent.appendChild(element);
	}
	return element;
};
