import { Component } from '../core/Component.js';
import { MemoriesComponent } from '../components/MemoriesComponent.js';
import { LoadingComponent } from '../components/LoadingComponent.js';
import { createElement } from '../utils/dom.js';
import { memoriesData } from '../data/memories.js';

export class HomePage extends Component {
	constructor(options) {
		super(options);
		this.stateManager = options.stateManager;
		this.currentPage = parseInt(options.props?.page, 10) || 1;
		this.filterState = {
			searchQuery: options.props?.search || '',
			filterCategory: options.props?.category || 'all',
			sortBy: options.props?.sort || 'date-desc'
		};
		this.isRendering = false;
		this.handleStateChange = this.handleStateChange.bind(this);
		this.handlePageChange = this.handlePageChange.bind(this);
	}

	mount(parent) {
		super.mount(parent);
		if (this.stateManager) {
			this.stateManager.setState({
				filterCategory: this.filterState.filterCategory,
				sortBy: this.filterState.sortBy,
				searchQuery: this.filterState.searchQuery
			});
			const unsubscribe = this.stateManager.subscribe(this.handleStateChange);
			this.cleanupFunctions.push(unsubscribe);
		}
		setTimeout(() => {
			this.addRippleEffect();
		}, 500);
	}

	handleStateChange(newState, oldState) {
		let needsRerender = false;

		if (newState.filterCategory !== oldState.filterCategory && newState.filterCategory !== this.filterState.filterCategory) {
			this.filterState.filterCategory = newState.filterCategory;
			this.currentPage = 1;
			this.updateURL();
			needsRerender = true;
		}

		if (newState.searchQuery !== oldState.searchQuery && newState.searchQuery !== this.filterState.searchQuery) {
			this.filterState.searchQuery = newState.searchQuery;
			this.currentPage = 1;
			this.updateURL();
			needsRerender = true;
		}

		if (newState.sortBy !== oldState.sortBy && newState.sortBy !== this.filterState.sortBy) {
			this.filterState.sortBy = newState.sortBy;
			this.updateURL();
			needsRerender = true;
		}

		if (needsRerender && !this.isRendering) {
			const parent = this.element.querySelector('[class*="mt-8"]');
			if (parent) {
				this.isRendering = true;
				parent.innerHTML = '';
				
				const loadingComponent = new LoadingComponent({
					props: { type: 'card' }
				});
				loadingComponent.mount(parent);
				
				setTimeout(() => {
					loadingComponent.destroy();
					this.renderMemories(parent);
					this.isRendering = false;
					setTimeout(() => {
						this.addRippleEffect();
					}, 100);
				}, 500);
			}
		}
	}

	updateURL() {
		const params = {};
		if (this.currentPage > 1) params.page = this.currentPage;
		if (this.filterState.filterCategory !== 'all') params.category = this.filterState.filterCategory;
		if (this.filterState.sortBy !== 'date-desc') params.sort = this.filterState.sortBy;
		if (this.filterState.searchQuery) params.search = this.filterState.searchQuery;

		const queryParts = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`);
		const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
		
		if (window.history && window.history.pushState) {
			window.history.pushState({ path: 'home', params }, '', `#home${queryString}`);
		}
	}

	handlePageChange(page) {
		this.currentPage = page;
		this.updateURL();
		const parent = this.element.querySelector('[class*="mt-8"]');
		if (parent) {
			parent.innerHTML = '';
			
			const loadingComponent = new LoadingComponent({
				props: { type: 'card' }
			});
			loadingComponent.mount(parent);
			
			setTimeout(() => {
				loadingComponent.destroy();
				this.renderMemories(parent);
				setTimeout(() => {
					this.addRippleEffect();
				}, 100);
			}, 400);
		}
	}

	render() {
		const container = createElement('div', {
			classes: ['max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'pt-12', 'pb-8']
		});
		const titleSection = createElement('div', {
			classes: ['mb-12', 'text-center']
		});
		const hasMemories = memoriesData.length > 0;
		titleSection.innerHTML = `
			<div class="inline-block mb-6">
				<div class="flex items-center gap-3 justify-center mb-4">
					<div class="w-12 h-1 bg-gradient-to-r from-transparent via-blue-400 to-blue-500 rounded-full"></div>
					<svg class="w-8 h-8 text-blue-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
					</svg>
					<div class="w-12 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-transparent rounded-full"></div>
				</div>
			</div>
			<h2 class="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent mb-2 leading-tight">Kenangan</h2>
			<h3 class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mb-6 leading-tight">Alfin & Safgia</h3>
			<p class="text-gray-400 text-lg max-w-2xl mx-auto">${hasMemories ? 'Koleksi momen-momen berharga yang telah kami lalui bersama' : 'Mulai dokumentasikan perjalanan cinta Anda'}</p>
		`;
		container.appendChild(titleSection);
		const contentContainer = createElement('div', {
			classes: ['mt-8']
		});
		container.appendChild(contentContainer);
		this.renderMemories(contentContainer);
		return container;
	}

	renderMemories(container) {
		let filtered = memoriesData.filter(memory => {
			const titleMatch = memory.title ? memory.title.toLowerCase().includes(this.filterState.searchQuery.toLowerCase()) : false;
			const descMatch = memory.description ? memory.description.toLowerCase().includes(this.filterState.searchQuery.toLowerCase()) : false;
			const matchesSearch = titleMatch || descMatch;
			const matchesCategory = this.filterState.filterCategory === 'all' || memory.category === this.filterState.filterCategory;
			return matchesSearch && matchesCategory;
		});
		
		filtered.sort((a, b) => {
			switch (this.filterState.sortBy) {
				case 'date-asc': {
					const hasDateA = a.date && a.date !== '';
					const hasDateB = b.date && b.date !== '';
					
					if (!hasDateA && !hasDateB) return b.id - a.id;
					if (!hasDateA) return 1;
					if (!hasDateB) return -1;
					
					const dateCompare = new Date(a.date) - new Date(b.date);
					if (dateCompare === 0) return a.id - b.id;
					return dateCompare;
				}
				
				case 'date-desc': {
					const hasDateA = a.date && a.date !== '';
					const hasDateB = b.date && b.date !== '';
					
					if (!hasDateA && !hasDateB) return b.id - a.id;
					if (!hasDateA) return 1;
					if (!hasDateB) return -1;
					
					const dateCompare = new Date(b.date) - new Date(a.date);
					if (dateCompare === 0) return b.id - a.id;
					return dateCompare;
				}
				
				case 'title-asc': {
					const titleCompare = a.title.localeCompare(b.title);
					if (titleCompare === 0) return b.id - a.id;
					return titleCompare;
				}
				
				case 'title-desc': {
					const titleCompare = b.title.localeCompare(a.title);
					if (titleCompare === 0) return b.id - a.id;
					return titleCompare;
				}
				
				default:
					return b.id - a.id;
			}
		});
		
		const memoriesComponent = new MemoriesComponent({
			props: {
				memories: filtered,
				currentPage: this.currentPage,
				onMemoryClick: (memory) => this.props.onMemorySelect?.(memory),
				onPageChange: this.handlePageChange
			}
		});
		memoriesComponent.mount(container);
		this.cleanupFunctions.push(() => memoriesComponent.destroy());
	}

	addRippleEffect() {
		const rippleContainers = document.querySelectorAll('.memory-card');
		rippleContainers.forEach(container => {
			const existingHandler = container._rippleHandler;
			if (existingHandler) {
				container.removeEventListener('click', existingHandler);
			}

			const rippleHandler = (e) => {
				const ripple = document.createElement('span');
				const rect = container.getBoundingClientRect();
				const size = Math.max(rect.width, rect.height);
				const x = e.clientX - rect.left - size / 2;
				const y = e.clientY - rect.top - size / 2;

				ripple.style.width = ripple.style.height = size + 'px';
				ripple.style.left = x + 'px';
				ripple.style.top = y + 'px';
				ripple.classList.add('ripple');

				container.appendChild(ripple);

				setTimeout(() => {
					ripple.remove();
				}, 600);
			};

			container._rippleHandler = rippleHandler;
			container.addEventListener('click', rippleHandler);
		});

		if (!document.getElementById('ripple-styles')) {
			const style = document.createElement('style');
			style.id = 'ripple-styles';
			style.textContent = `
				.ripple {
					position: absolute;
					border-radius: 50%;
					background: rgba(59, 130, 246, 0.4);
					transform: scale(0);
					animation: ripple-animation 0.6s ease-out;
					pointer-events: none;
					z-index: 10;
				}
				@keyframes ripple-animation {
					to {
						transform: scale(2);
						opacity: 0;
					}
				}
			`;
			document.head.appendChild(style);
		}
	}
}
