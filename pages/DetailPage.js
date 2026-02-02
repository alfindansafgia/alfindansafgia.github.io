import { Component } from '../core/Component.js';
import { createElement } from '../utils/dom.js';
import { DetailComponent } from '../components/DetailComponent.js';

export class DetailPage extends Component {
	render() {
		const container = createElement('div', {
			classes: ['w-full', 'px-4', 'sm:px-6', 'lg:px-8', 'pt-8', 'pb-8', 'mt-12']
		});
		
		const innerContainer = createElement('div', {
			classes: ['max-w-4xl', 'mx-auto']
		});
		
		const detail = new DetailComponent({
			props: {
				memory: this.props.memory,
				onBack: () => this.props.onBack?.()
			}
		});
		detail.mount(innerContainer);
		this.cleanupFunctions.push(() => detail.destroy());
		
		container.appendChild(innerContainer);
		return container;
	}
}
