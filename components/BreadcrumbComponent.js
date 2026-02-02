import { Component } from '../core/Component.js';
import { createElement } from '../utils/dom.js';
import { escapeHtml } from '../utils/helpers.js';

export class BreadcrumbComponent extends Component {
	render() {
		const { currentPage, currentMemory, filterState } = this.props;
		
		if (!currentPage) {
			return createElement('div', { classes: ['hidden'] });
		}

		const container = createElement('div', {
			classes: ['bg-gray-800/50', 'backdrop-blur-sm', 'py-3', 'px-4', 'sm:px-6', 'lg:px-8']
		});

		const maxWidth = createElement('div', {
			classes: ['max-w-7xl', 'mx-auto']
		});

		const breadcrumbList = createElement('div', {
			classes: ['flex', 'items-center', 'gap-2', 'text-sm', 'flex-wrap']
		});

		const items = this.getBreadcrumbItems(currentPage, currentMemory, filterState);
		
		items.forEach((item, index) => {
			if (index > 0) {
				const separator = createElement('span', {
					classes: ['text-gray-600']
				});
				separator.innerHTML = '<i data-feather="chevron-right" class="w-4 h-4"></i>';
				breadcrumbList.appendChild(separator);
			}

			const itemElement = createElement('div', {
				classes: ['flex', 'items-center', 'gap-1.5']
			});

			if (item.icon) {
				const icon = createElement('i');
				icon.setAttribute('data-feather', item.icon);
				icon.className = `w-4 h-4 ${item.isActive ? 'text-blue-400' : 'text-gray-400'}`;
				itemElement.appendChild(icon);
			}

			if (item.link && !item.isActive) {
				const link = createElement('a', {
					classes: ['text-gray-400', 'hover:text-blue-400', 'transition-colors', 'duration-200', 'font-medium']
				});
				link.href = item.link;
				link.textContent = item.label;
				itemElement.appendChild(link);
			} else {
				const span = createElement('span', {
					classes: [item.isActive ? 'text-blue-400' : 'text-gray-400', 'font-medium']
				});
				span.textContent = item.label;
				itemElement.appendChild(span);
			}

			breadcrumbList.appendChild(itemElement);
		});

		maxWidth.appendChild(breadcrumbList);
		container.appendChild(maxWidth);

		setTimeout(() => feather.replace({ width: 16, height: 16 }), 0);

		return container;
	}

	getBreadcrumbItems(currentPage, currentMemory, filterState = {}) {
		const items = [];

		items.push({
			label: 'Beranda',
			link: '#home',
			icon: 'home',
			isActive: false
		});

		if (currentPage === 'home' && filterState) {
			if (filterState.searchQuery) {
				items.push({
					label: `Pencarian: "${escapeHtml(filterState.searchQuery)}"`,
					icon: 'search',
					isActive: true
				});
			} else {
				if (filterState.filterCategory && filterState.filterCategory !== 'all') {
					const categoryLabel = filterState.filterCategory.charAt(0).toUpperCase() + filterState.filterCategory.slice(1);
					items.push({
						label: categoryLabel,
						icon: this.getCategoryIcon(filterState.filterCategory),
						isActive: true
					});
				}

				if (filterState.sortBy && filterState.sortBy !== 'date-desc') {
					const sortLabel = this.getSortLabel(filterState.sortBy);
					items.push({
						label: sortLabel,
						icon: 'arrow-down-up',
						isActive: true
					});
				}
			}
		}

		if (currentPage === 'detail' && currentMemory) {
			const category = currentMemory.category || 'tanpa-kategori';
			const categoryLabel = category === 'tanpa-kategori' ? 'Tanpa Kategori' : category.charAt(0).toUpperCase() + category.slice(1);
			
			items.push({
				label: categoryLabel,
				link: `#home?category=${category}`,
				icon: this.getCategoryIcon(category),
				isActive: false
			});

			items.push({
				label: escapeHtml(currentMemory.title),
				icon: 'file-text',
				isActive: true
			});
		}

		return items;
	}

	getCategoryIcon(category) {
		const icons = {
			'all': 'grid',
			'pertemuan': 'users',
			'liburan': 'sun',
			'petualangan': 'compass',
			'perayaan': 'gift',
			'wisata': 'map',
			'momen-intim': 'heart',
			'tanpa-kategori': 'folder'
		};
		return icons[category] || 'circle';
	}

	getSortLabel(sortBy) {
		const labels = {
			'date-desc': 'Terbaru',
			'date-asc': 'Terlama',
			'title-asc': 'A → Z',
			'title-desc': 'Z → A'
		};
		return labels[sortBy] || sortBy;
	}
}
