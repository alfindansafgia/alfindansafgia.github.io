export class Component {
	constructor(options = {}) {
		this.element = null;
		this.state = options.state || {};
		this.props = options.props || {};
		this.cleanupFunctions = [];
		this.eventDelegators = new Map();
	}

	render() {
		throw new Error('render() method must be implemented');
	}

	mount(parent) {
		try {
			this.element = this.render();
			if (this.element && parent) {
				parent.appendChild(this.element);
				this.element.classList.add('fade-in');
			}
		} catch (error) {
			console.error('Component mount error:', error);
		}
	}

	update(updates) {
		this.state = { ...this.state, ...updates };
		this.rerender();
	}

	rerender() {
		try {
			if (!this.element) return;
			const parent = this.element.parentElement;
			if (parent) {
				this.cleanup();
				this.element.remove();
				this.mount(parent);
			}
		} catch (error) {
			console.error('Component rerender error:', error);
		}
	}

	addEventListener(element, event, handler) {
		if (!element) return;
		element.addEventListener(event, handler);
		this.cleanupFunctions.push(() => {
			element.removeEventListener(event, handler);
		});
	}

	delegateEvent(parent, selector, event, handler) {
		if (!parent) return;
		const delegatedHandler = (e) => {
			const target = e.target.closest(selector);
			if (target) {
				handler.call(target, e);
			}
		};
		parent.addEventListener(event, delegatedHandler);
		this.cleanupFunctions.push(() => {
			parent.removeEventListener(event, delegatedHandler);
		});
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

	destroy() {
		this.cleanup();
		if (this.element && this.element.parentElement) {
			this.element.remove();
		}
		this.element = null;
	}
}
