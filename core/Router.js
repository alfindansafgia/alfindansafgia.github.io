export class Router {
	constructor(stateManager) {
		this.stateManager = stateManager;
		this.routes = new Map();
		this.currentRoute = null;
		this.cleanupFunctions = [];
		this.navigate = this.navigate.bind(this);
		this.handlePopState = this.handlePopState.bind(this);
		this.handleHashChange = this.handleHashChange.bind(this);
		window.addEventListener('popstate', this.handlePopState);
		window.addEventListener('hashchange', this.handleHashChange);
	}

	registerRoute(path, handler) {
		this.routes.set(path, handler);
	}

	navigate(path, params = {}) {
		try {
			this.cleanup();
			this.stateManager.setState({ currentPage: path, ...params });
			const handler = this.routes.get(path);
			if (!handler) {
				console.warn(`Route not found: ${path}`);
				const homeHandler = this.routes.get('home');
				if (homeHandler) {
					const cleanup = homeHandler({});
					if (typeof cleanup === 'function') {
						this.cleanupFunctions.push(cleanup);
					}
				}
				return;
			}
			const cleanup = handler(params);
			if (typeof cleanup === 'function') {
				this.cleanupFunctions.push(cleanup);
			}
			const hashString = this.buildHashString(path, params);
			window.history.pushState({ path, params }, '', hashString);
			window.scrollTo(0, 0);
		} catch (error) {
			console.error('Navigation error:', error);
			this.stateManager.setState({ error: 'Navigation failed' });
		}
	}

	buildHashString(path, params) {
		const queryParams = [];
		Object.entries(params).forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				queryParams.push(`${key}=${encodeURIComponent(value)}`);
			}
		});
		if (queryParams.length > 0) {
			return `#${path}?${queryParams.join('&')}`;
		}
		return `#${path}`;
	}

	parseHash() {
		let hash = window.location.hash;
		if (!hash || hash === '' || hash === '#' || hash === '#/') {
			return { path: 'home', params: {} };
		}
		hash = hash.slice(1);
		const [path, queryString] = hash.split('?');
		const params = {};
		if (queryString) {
			queryString.split('&').forEach(pair => {
				const [key, value] = pair.split('=');
				if (key) {
					params[key] = decodeURIComponent(value || '');
				}
			});
		}
		return { path: path || 'home', params };
	}

	handlePopState(event) {
		if (event.state) {
			const path = event.state.path || 'home';
			const params = event.state.params || {};
			this.navigateWithoutPush(path, params);
		} else {
			const { path, params } = this.parseHash();
			this.navigateWithoutPush(path, params);
		}
	}

	handleHashChange() {
		const { path, params } = this.parseHash();
		this.navigateWithoutPush(path, params);
	}

	navigateWithoutPush(path, params = {}) {
		try {
			this.cleanup();
			this.stateManager.setState({ currentPage: path, ...params });
			const handler = this.routes.get(path);
			if (!handler) {
				console.warn(`Route not found: ${path}`);
				const homeHandler = this.routes.get('home');
				if (homeHandler) {
					const cleanup = homeHandler({});
					if (typeof cleanup === 'function') {
						this.cleanupFunctions.push(cleanup);
					}
				}
				return;
			}
			const cleanup = handler(params);
			if (typeof cleanup === 'function') {
				this.cleanupFunctions.push(cleanup);
			}
			window.scrollTo(0, 0);
		} catch (error) {
			console.error('Navigation error:', error);
		}
	}

	cleanup() {
		this.cleanupFunctions.forEach(fn => {
			try {
				fn();
			} catch (error) {
				console.error('Cleanup error:', error);
			}
		});
		this.cleanupFunctions = [];
	}

	init() {
		const { path, params } = this.parseHash();
		if (!window.location.hash || window.location.hash === '' || window.location.hash === '#') {
			this.navigate('home', {});
		} else {
			this.navigateWithoutPush(path, params);
		}
	}

	destroy() {
		window.removeEventListener('popstate', this.handlePopState);
		window.removeEventListener('hashchange', this.handleHashChange);
		this.cleanup();
	}
}
