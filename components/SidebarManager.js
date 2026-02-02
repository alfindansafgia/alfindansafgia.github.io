import { safeQuery } from '../utils/helpers.js';
import { debounce } from '../utils/helpers.js';

export class SidebarManager {
	constructor(stateManager) {
		this.stateManager = stateManager;
		this.isSidebarOpen = false;
		this.cleanupFunctions = [];
		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.handleResize = this.handleResize.bind(this);
	}

	init(memoriesData) {
		this.memoriesData = memoriesData;
		this.setupSidebar();
		this.setupMobileMenu();
		this.setupDesktopToggle();
		window.addEventListener('resize', this.handleResize);
	}

	handleResize() {
		const isDesktop = window.innerWidth >= 768;
		if (!isDesktop && this.isSidebarOpen) {
			this.closeSidebar();
		}
	}

	setupMobileMenu() {
		const menuBtn = safeQuery('#mobile-menu-btn');
		const overlay = safeQuery('#sidebar-overlay');

		if (menuBtn) {
			this.addEventListener(menuBtn, 'click', this.toggleSidebar);
		}

		if (overlay) {
			this.addEventListener(overlay, 'click', this.toggleSidebar);
		}
	}

	setupDesktopToggle() {
		const toggleBtn = safeQuery('#desktop-toggle-btn');
		if (toggleBtn) {
			this.addEventListener(toggleBtn, 'click', this.toggleSidebar);
		}
	}

	toggleSidebar() {
		this.isSidebarOpen = !this.isSidebarOpen;
		if (this.isSidebarOpen) {
			this.openSidebar();
		} else {
			this.closeSidebar();
		}
	}

	openSidebar() {
		const sidebar = safeQuery('#app-sidebar');
		const overlay = safeQuery('#sidebar-overlay');

		sidebar?.classList.remove('-translate-x-full');
		sidebar?.classList.add('translate-x-0');

		overlay?.classList.remove('hidden');
		overlay?.classList.add('backdrop-blur-sm');
	}

	closeSidebar() {
		const sidebar = safeQuery('#app-sidebar');
		const overlay = safeQuery('#sidebar-overlay');

		sidebar?.classList.add('-translate-x-full');
		sidebar?.classList.remove('translate-x-0');
		
		overlay?.classList.add('hidden');
		overlay?.classList.remove('backdrop-blur-sm');
	}

	setupSidebar() {
		const sidebar = safeQuery('#app-sidebar');
		if (!sidebar) return;
		const categories = ['all', 'pertemuan', 'liburan', 'petualangan', 'perayaan', 'wisata', 'momen-intim'];
		const sortOptions = [
			{ value: 'date-desc', label: 'Terbaru', icon: 'calendar' },
			{ value: 'date-asc', label: 'Terlama', icon: 'calendar' },
			{ value: 'title-asc', label: 'A → Z', icon: 'type' },
			{ value: 'title-desc', label: 'Z → A', icon: 'type' }
		];
		const hasMemories = this.memoriesData && this.memoriesData.length > 0;
		const uniqueCategories = hasMemories ? new Set(this.memoriesData.map(m => m.category)).size : 0;
		const firstYear = hasMemories ? new Date(this.memoriesData[this.memoriesData.length - 1].date).getFullYear() : '-';
		const totalMemories = hasMemories ? this.memoriesData.length : 0;
		sidebar.innerHTML = `
			<div class="h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
				<div class="p-6 flex-1 overflow-y-auto">
					<div class="flex items-center justify-between mb-8">
						<h3 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Filter</h3>
						<button id="close-sidebar-btn" class="p-2 hover:bg-gray-700 rounded-xl transition-all duration-300 transform hover:scale-110">
							<i data-feather="x" class="w-5 h-5 text-gray-300"></i>
						</button>
					</div>
					
					<div class="mb-8">
						<label class="block text-sm font-bold text-gray-300 mb-3">Cari Kenangan</label>
						<input 
							type="text" 
							id="sidebar-search-input"
							placeholder="Ketik judul atau deskripsi..."
							class="w-full px-4 py-3 text-sm bg-gray-800 border-2 border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-200 placeholder-gray-500 hover:border-gray-600"
						/>
					</div>
					
					<div class="mb-8">
						<label class="block text-sm font-bold text-gray-300 mb-4">Kategori</label>
						<div class="space-y-2">
							${categories.map(cat => `
								<button 
									data-category="${cat}"
									class="category-btn w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-[1.02] ${cat === 'all' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'}"
								>
									<i data-feather="${this.getCategoryIcon(cat)}" class="inline w-4 h-4 mr-3"></i>
									<span>${cat === 'all' ? 'Semua' : cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
								</button>
							`).join('')}
						</div>
					</div>
					
					<div class="mb-8">
						<label class="block text-sm font-bold text-gray-300 mb-4">Urutkan</label>
						<div class="space-y-2">
							${sortOptions.map((opt, idx) => `
								<button 
									data-sort="${opt.value}"
									class="sort-btn w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-[1.02] ${idx === 0 ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'}"
								>
									<i data-feather="${opt.icon}" class="inline w-4 h-4 mr-3"></i>
									<span>${opt.label}</span>
								</button>
							`).join('')}
						</div>
					</div>
					
					<div class="pt-6 border-t-2 border-gray-700">
						<h4 class="text-sm font-bold bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent mb-4">Statistik</h4>
						<div class="space-y-3 text-sm">
							<div class="flex items-center justify-between p-3 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl border border-gray-600">
								<span class="font-medium text-gray-300">Total Kenangan</span>
								<span class="font-bold text-blue-400 text-lg">${totalMemories}</span>
							</div>
							<div class="flex items-center justify-between p-3 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl border border-gray-600">
								<span class="font-medium text-gray-300">Kategori</span>
								<span class="font-bold text-cyan-400 text-lg">${uniqueCategories}</span>
							</div>
							<div class="flex items-center justify-between p-3 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl border border-gray-600">
								<span class="font-medium text-gray-300">Dimulai Sejak</span>
								<span class="font-bold text-blue-400 text-lg">${firstYear}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
		const closeSidebarBtn = sidebar.querySelector('#close-sidebar-btn');
		if (closeSidebarBtn) {
			this.addEventListener(closeSidebarBtn, 'click', () => this.closeSidebar());
		}
		this.setupCategoryButtons();
		this.setupSortButtons();
		this.setupSearchInput();
		setTimeout(() => feather.replace({ width: 16, height: 16 }), 0);
	}

	getCategoryIcon(category) {
		const icons = {
			'all': 'grid',
			'pertemuan': 'users',
			'liburan': 'sun',
			'petualangan': 'compass',
			'perayaan': 'gift',
			'wisata': 'map',
			'momen-intim': 'heart'
		};
		return icons[category] || 'circle';
	}

	setupCategoryButtons() {
		const categoryButtons = document.querySelectorAll('.category-btn');
		categoryButtons.forEach(btn => {
			this.addEventListener(btn, 'click', (e) => {
				const category = e.currentTarget.dataset.category;
				this.stateManager.setState({ filterCategory: category });
			});
		});
	}

	setupSortButtons() {
		const sortButtons = document.querySelectorAll('.sort-btn');
		sortButtons.forEach(btn => {
			this.addEventListener(btn, 'click', (e) => {
				const sortBy = e.currentTarget.dataset.sort;
				this.stateManager.setState({ sortBy });
			});
		});
	}

	setupSearchInput() {
		const searchInput = document.querySelector('#sidebar-search-input');
		if (!searchInput) return;

		const handleSearch = debounce((e) => {
			const query = e.target.value.trim();
			this.stateManager.setState({ searchQuery: query });
		}, 300);

		this.addEventListener(searchInput, 'input', handleSearch);
	}

	updateActiveCategoryButton(category) {
		const buttons = document.querySelectorAll('.category-btn');
		buttons.forEach(btn => {
			const isActive = btn.dataset.category === category;
			if (isActive) {
				btn.classList.remove('bg-gray-800', 'text-gray-300', 'hover:bg-gray-700', 'border', 'border-gray-700');
				btn.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-cyan-600', 'text-white', 'shadow-lg');
			} else {
				btn.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-cyan-600', 'text-white', 'shadow-lg');
				btn.classList.add('bg-gray-800', 'text-gray-300', 'hover:bg-gray-700', 'border', 'border-gray-700');
			}
		});
	}

	updateActiveSortButton(sortBy) {
		const buttons = document.querySelectorAll('.sort-btn');
		buttons.forEach(btn => {
			const isActive = btn.dataset.sort === sortBy;
			if (isActive) {
				btn.classList.remove('bg-gray-800', 'text-gray-300', 'hover:bg-gray-700', 'border', 'border-gray-700');
				btn.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-cyan-600', 'text-white', 'shadow-lg');
			} else {
				btn.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-cyan-600', 'text-white', 'shadow-lg');
				btn.classList.add('bg-gray-800', 'text-gray-300', 'hover:bg-gray-700', 'border', 'border-gray-700');
			}
		});
	}

	addEventListener(element, event, handler) {
		if (!element) return;
		element.addEventListener(event, handler);
		this.cleanupFunctions.push(() => {
			element.removeEventListener(event, handler);
		});
	}

	destroy() {
		window.removeEventListener('resize', this.handleResize);
		this.cleanupFunctions.forEach(fn => {
			try {
				fn();
			} catch (error) {
				console.error('Cleanup error:', error);
			}
		});
		this.cleanupFunctions = [];
	}
}
