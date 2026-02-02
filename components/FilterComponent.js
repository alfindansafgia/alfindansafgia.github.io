import { Component } from '../core/Component.js';
import { createElement } from '../utils/dom.js';
import { debounce } from '../utils/helpers.js';

export class FilterComponent extends Component {
	render() {
		const container = createElement('div', {
			classes: ['bg-white', 'rounded-2xl', 'p-6', 'shadow-lg', 'mb-6', 'border', 'border-rose-100']
		});
		const categories = ['all', 'pertemuan', 'liburan', 'petualangan', 'perayaan', 'wisata', 'momen-intim'];
		const sortOptions = [
			{ value: 'date-desc', label: 'Terbaru' },
			{ value: 'date-asc', label: 'Terlama' },
			{ value: 'title-asc', label: 'Judul (A-Z)' },
			{ value: 'title-desc', label: 'Judul (Z-A)' }
		];
		container.innerHTML = `
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div>
					<label class="block text-sm font-bold text-gray-800 mb-3">Cari Kenangan</label>
					<input 
						type="text" 
						id="search-input"
						placeholder="Ketik judul atau deskripsi..."
						class="w-full px-4 py-3 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300 hover:border-rose-300 bg-white"
					/>
				</div>
				<div>
					<label class="block text-sm font-bold text-gray-800 mb-3">Kategori</label>
					<select id="category-select" class="w-full px-4 py-3 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300 hover:border-rose-300 bg-white font-medium cursor-pointer">
						${categories.map(cat => `
							<option value="${cat}">${cat === 'all' ? 'Semua Kategori' : cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
						`).join('')}
					</select>
				</div>
				<div>
					<label class="block text-sm font-bold text-gray-800 mb-3">Urutkan</label>
					<select id="sort-select" class="w-full px-4 py-3 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300 hover:border-rose-300 bg-white font-medium cursor-pointer">
						${sortOptions.map(opt => `
							<option value="${opt.value}">${opt.label}</option>
						`).join('')}
					</select>
				</div>
			</div>
		`;
		const searchInput = container.querySelector('#search-input');
		const categorySelect = container.querySelector('#category-select');
		const sortSelect = container.querySelector('#sort-select');
		const handleSearchChange = debounce(() => {
			this.props.onFilterChange?.({
				searchQuery: searchInput.value,
				filterCategory: categorySelect.value,
				sortBy: sortSelect.value
			});
		}, 300);
		this.addEventListener(searchInput, 'input', handleSearchChange);
		this.addEventListener(categorySelect, 'change', handleSearchChange);
		this.addEventListener(sortSelect, 'change', handleSearchChange);
		setTimeout(() => feather.replace({ width: 16, height: 16 }), 0);
		return container;
	}
}
