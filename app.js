import { StateManager } from './core/StateManager.js';
import { Router } from './core/Router.js';
import { HomePage } from './pages/HomePage.js';
import { DetailPage } from './pages/DetailPage.js';
import { SidebarManager } from './components/SidebarManager.js';
import { BreadcrumbComponent } from './components/BreadcrumbComponent.js';
import { LoadingSpinner } from './components/LoadingComponent.js';
import { safeQuery } from './utils/helpers.js';
import { memoriesData } from './data/memories.js';

class LoveMemoriesApp {
	constructor() {
		this.stateManager = new StateManager();
		this.router = new Router(this.stateManager);
		this.sidebarManager = new SidebarManager(this.stateManager);
		this.currentPage = null;
		this.mainElement = null;
		this.loadingSpinner = null;
		this.breadcrumbComponent = null;
		this.breadcrumbContainer = null;
		this.cleanupFunctions = [];
		this.handleStateChange = this.handleStateChange.bind(this);
		this.handleMemorySelect = this.handleMemorySelect.bind(this);
		this.handleBackToHome = this.handleBackToHome.bind(this);
	}

	init() {
		try {
			this.mainElement = safeQuery('#app-main');
			this.breadcrumbContainer = safeQuery('#breadcrumb-container');
			if (!this.mainElement) {
				document.body.innerHTML += '<div class="p-8 text-red-600 text-center">ERROR: Main app element not found!</div>';
				return;
			}
			this.router.registerRoute('home', (params) => this.renderHomePage(params));
			this.router.registerRoute('detail', (params) => this.renderDetailPage(params));
			const unsubscribe = this.stateManager.subscribe(this.handleStateChange);
			this.cleanupFunctions.push(unsubscribe);
			this.router.init();
			this.sidebarManager.init(memoriesData);
			feather.replace();
		} catch (error) {
			console.error('App initialization error:', error);
			document.body.innerHTML += `<div class="p-8 text-red-600 text-center">ERROR: ${error.message}</div>`;
		}
	}

	handleStateChange(newState, oldState) {
		if (newState.isLoading !== oldState.isLoading) {
			if (newState.isLoading) {
				this.showLoading();
			} else {
				this.hideLoading();
			}
		}

		if (newState.filterCategory !== oldState.filterCategory) {
			this.sidebarManager.updateActiveCategoryButton(newState.filterCategory);
			if (newState.currentPage === 'detail') {
				this.router.navigate('home');
			}
			this.updateBreadcrumb();
		}

		if (newState.sortBy !== oldState.sortBy) {
			this.sidebarManager.updateActiveSortButton(newState.sortBy);
			if (newState.currentPage === 'detail') {
				this.router.navigate('home');
			}
			this.updateBreadcrumb();
		}

		if (newState.searchQuery !== oldState.searchQuery) {
			if (newState.currentPage === 'detail') {
				this.router.navigate('home');
			}
			this.updateBreadcrumb();
		}

		if (newState.currentPage !== oldState.currentPage) {
			this.updateBreadcrumb();
		}
	}

	updateBreadcrumb() {
		if (!this.breadcrumbContainer) return;

		if (this.breadcrumbComponent) {
			this.breadcrumbComponent.destroy();
		}

		const state = this.stateManager.getState();
		const currentMemory = state.currentPage === 'detail' && state.currentMemoryId
			? memoriesData.find(m => m.id === state.currentMemoryId)
			: null;

		this.breadcrumbComponent = new BreadcrumbComponent({
			props: {
				currentPage: state.currentPage,
				currentMemory: currentMemory,
				filterState: {
					filterCategory: state.filterCategory,
					sortBy: state.sortBy,
					searchQuery: state.searchQuery
				}
			}
		});

		this.breadcrumbContainer.innerHTML = '';
		this.breadcrumbComponent.mount(this.breadcrumbContainer);
	}

	showLoading() {
		if (!this.loadingSpinner) {
			this.loadingSpinner = new LoadingSpinner();
			this.loadingSpinner.mount(document.body);
		}
	}

	hideLoading() {
		if (this.loadingSpinner) {
			setTimeout(() => {
				this.loadingSpinner.destroy();
				this.loadingSpinner = null;
			}, 300);
		}
	}

	renderHomePage(params = {}) {
		try {
			this.stateManager.setState({ 
				isLoading: true,
				currentPage: 'home',
				currentMemoryId: null
			});
			
			setTimeout(() => {
				if (this.currentPage) {
					this.currentPage.destroy();
				}
				this.mainElement.innerHTML = '';
				this.currentPage = new HomePage({
					stateManager: this.stateManager,
					props: {
						page: params.page,
						category: params.category,
						sort: params.sort,
						search: params.search,
						onMemorySelect: this.handleMemorySelect
					}
				});
				this.currentPage.mount(this.mainElement);
				
				this.stateManager.setState({ isLoading: false });
				this.updateBreadcrumb();
			}, 400);
			
			return () => {
				if (this.currentPage) {
					this.currentPage.destroy();
				}
			};
		} catch (error) {
			console.error('Home page render error:', error);
			this.stateManager.setState({ isLoading: false });
		}
	}

	renderDetailPage(params) {
		try {
			this.stateManager.setState({ 
				isLoading: true,
				currentPage: 'detail',
				currentMemoryId: parseInt(params.memoryId, 10)
			});
			
			setTimeout(() => {
				if (this.currentPage) {
					this.currentPage.destroy();
				}
				this.mainElement.innerHTML = '';
				const memoryId = parseInt(params.memoryId, 10);
				const memory = memoriesData.find(m => m.id === memoryId);
				this.currentPage = new DetailPage({
					props: {
						memory,
						onBack: this.handleBackToHome
					}
				});
				this.currentPage.mount(this.mainElement);
				
				this.stateManager.setState({ isLoading: false });
				this.updateBreadcrumb();
			}, 400);
			
			return () => {
				if (this.currentPage) {
					this.currentPage.destroy();
				}
			};
		} catch (error) {
			console.error('Detail page render error:', error);
			this.stateManager.setState({ isLoading: false });
		}
	}

	handleMemorySelect(memory) {
		const currentState = this.stateManager.getState();
		const params = { memoryId: memory.id };
		
		if (currentState.filterCategory && currentState.filterCategory !== 'all') {
			params.fromCategory = currentState.filterCategory;
		}
		if (currentState.sortBy && currentState.sortBy !== 'date-desc') {
			params.fromSort = currentState.sortBy;
		}
		if (currentState.searchQuery) {
			params.fromSearch = currentState.searchQuery;
		}
		
		const homeState = this.stateManager.getState();
		if (homeState.currentPage === 'home') {
			const hash = window.location.hash;
			if (hash && hash.includes('?')) {
				const queryString = hash.split('?')[1];
				const urlParams = new URLSearchParams(queryString);
				if (urlParams.get('page')) {
					params.fromPage = urlParams.get('page');
				}
				if (urlParams.get('category')) {
					params.fromCategory = urlParams.get('category');
				}
				if (urlParams.get('sort')) {
					params.fromSort = urlParams.get('sort');
				}
				if (urlParams.get('search')) {
					params.fromSearch = urlParams.get('search');
				}
			}
		}
		
		this.router.navigate('detail', params);
	}

	handleBackToHome() {
		const hash = window.location.hash;
		if (hash && hash.includes('?')) {
			const queryString = hash.split('?')[1];
			const urlParams = new URLSearchParams(queryString);
			
			const homeParams = {};
			if (urlParams.get('fromPage')) {
				homeParams.page = urlParams.get('fromPage');
			}
			if (urlParams.get('fromCategory')) {
				homeParams.category = urlParams.get('fromCategory');
			}
			if (urlParams.get('fromSort')) {
				homeParams.sort = urlParams.get('fromSort');
			}
			if (urlParams.get('fromSearch')) {
				homeParams.search = urlParams.get('fromSearch');
			}
			
			if (Object.keys(homeParams).length > 0) {
				this.router.navigate('home', homeParams);
				return;
			}
		}
		
		if (window.history.length > 1) {
			window.history.back();
		} else {
			this.router.navigate('home');
		}
	}

	addEventListener(element, event, handler) {
		if (!element) return;
		element.addEventListener(event, handler);
		this.cleanupFunctions.push(() => {
			element.removeEventListener(event, handler);
		});
	}

	destroy() {
		this.cleanupFunctions.forEach(fn => {
			try {
				fn();
			} catch (error) {
				console.error('Cleanup error:', error);
			}
		});
		this.cleanupFunctions = [];
		if (this.currentPage) {
			this.currentPage.destroy();
		}
		if (this.loadingSpinner) {
			this.loadingSpinner.destroy();
		}
		if (this.breadcrumbComponent) {
			this.breadcrumbComponent.destroy();
		}
		this.sidebarManager.destroy();
		this.router.destroy();
	}
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		const app = new LoveMemoriesApp();
		app.init();
	});
} else {
	const app = new LoveMemoriesApp();
	app.init();
}

export { LoveMemoriesApp };
