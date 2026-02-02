export class StateManager {
	constructor() {
		this.state = {
			currentPage: 'home',
			selectedMemoryId: null,
			filterCategory: 'all',
			filterDateRange: { start: null, end: null },
			searchQuery: '',
			sortBy: 'date-desc',
			isLoading: false,
			error: null,
		};
		this.listeners = new Set();
		this.previousState = { ...this.state };
	}

	getState() {
		return { ...this.state };
	}

	setState(updates) {
		this.previousState = { ...this.state };
		this.state = { ...this.state, ...updates };
		this.notifyListeners();
	}

	subscribe(listener) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	notifyListeners() {
		this.listeners.forEach(listener => {
			try {
				listener(this.state, this.previousState);
			} catch (error) {
				console.error('State listener error:', error);
			}
		});
	}

	reset() {
		this.state = {
			currentPage: 'home',
			selectedMemoryId: null,
			filterCategory: 'all',
			filterDateRange: { start: null, end: null },
			searchQuery: '',
			sortBy: 'date-desc',
			isLoading: false,
			error: null,
		};
		this.notifyListeners();
	}

	clearError() {
		this.setState({ error: null });
	}
}
