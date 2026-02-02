import { Component } from '../core/Component.js';
import { createElement } from '../utils/dom.js';

export class LoadingComponent extends Component {
	render() {
		const container = createElement('div', {
			classes: ['w-full', 'animate-pulse']
		});

		const type = this.props.type || 'card';

		if (type === 'card') {
			container.innerHTML = this.getCardSkeleton();
		} else if (type === 'detail') {
			container.innerHTML = this.getDetailSkeleton();
		} else if (type === 'list') {
			container.innerHTML = this.getListSkeleton();
		}

		return container;
	}

	getCardSkeleton() {
		return `
			<div class="space-y-8 py-8">
				${Array(3).fill(0).map((_, index) => `
					<div class="relative flex items-start ${index % 2 === 0 ? 'justify-start' : 'justify-end'} fade-in">
						<div class="bg-white rounded-2xl shadow-lg overflow-hidden max-w-xl w-full border border-rose-100">
							<div class="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
							<div class="p-6 space-y-4">
								<div class="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
								<div class="flex gap-4">
									<div class="h-8 bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg w-32"></div>
									<div class="h-8 bg-gradient-to-r from-pink-100 to-red-100 rounded-lg w-32"></div>
								</div>
								<div class="space-y-2">
									<div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
									<div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
									<div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/6"></div>
								</div>
								<div class="pt-4 border-t border-gray-100">
									<div class="h-6 bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg w-32"></div>
								</div>
							</div>
						</div>
					</div>
				`).join('')}
			</div>
		`;
	}

	getDetailSkeleton() {
		return `
			<div class="w-full px-4 sm:px-6 lg:px-8 pt-8 pb-8">
				<div class="max-w-4xl mx-auto">
					<div class="bg-white rounded-2xl shadow-2xl overflow-hidden border border-rose-100 animate-pulse">
						<div class="relative h-96 bg-gradient-to-br from-gray-200 to-gray-300"></div>
						<div class="p-8 md:p-10 space-y-6">
							<div class="space-y-4">
								<div class="flex items-start justify-between gap-4 flex-wrap">
									<div class="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3"></div>
									<div class="h-10 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full w-32"></div>
								</div>
								<div class="flex gap-6">
									<div class="h-12 bg-gradient-to-r from-rose-100 to-pink-100 rounded-xl w-48"></div>
									<div class="h-12 bg-gradient-to-r from-pink-100 to-red-100 rounded-xl w-48"></div>
								</div>
							</div>
							<div class="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 space-y-4">
								<div class="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-40"></div>
								<div class="space-y-2">
									<div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
									<div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
									<div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
									<div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/6"></div>
								</div>
							</div>
							<div class="space-y-4">
								<div class="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48"></div>
								<div class="space-y-3">
									${Array(4).fill(0).map(() => `
										<div class="flex items-start gap-3 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100">
											<div class="w-5 h-5 bg-rose-300 rounded-full flex-shrink-0 mt-1"></div>
											<div class="flex-1 space-y-2">
												<div class="h-4 bg-gradient-to-r from-rose-200 to-pink-200 rounded w-full"></div>
												<div class="h-4 bg-gradient-to-r from-rose-200 to-pink-200 rounded w-3/4"></div>
											</div>
										</div>
									`).join('')}
								</div>
							</div>
							<div class="h-14 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-40"></div>
						</div>
					</div>
				</div>
			</div>
		`;
	}

	getListSkeleton() {
		return `
			<div class="space-y-4">
				${Array(5).fill(0).map(() => `
					<div class="bg-white rounded-xl shadow-md p-4 border border-rose-100 animate-pulse">
						<div class="flex gap-4">
							<div class="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex-shrink-0"></div>
							<div class="flex-1 space-y-3">
								<div class="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3"></div>
								<div class="h-4 bg-gradient-to-r from-rose-100 to-pink-100 rounded w-32"></div>
								<div class="space-y-2">
									<div class="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
									<div class="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/5"></div>
								</div>
							</div>
						</div>
					</div>
				`).join('')}
			</div>
		`;
	}
}

export class LoadingSpinner extends Component {
	render() {
		const container = createElement('div', {
			classes: ['fixed', 'inset-0', 'z-[9999]', 'flex', 'items-center', 'justify-center', 'bg-black', 'bg-opacity-30', 'backdrop-blur-sm']
		});

		container.innerHTML = `
			<div class="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 border-2 border-rose-200">
				<div class="relative w-16 h-16">
					<div class="absolute inset-0 border-4 border-rose-200 rounded-full"></div>
					<div class="absolute inset-0 border-4 border-t-rose-500 border-r-pink-500 rounded-full animate-spin"></div>
				</div>
				<div class="flex items-center gap-2">
					<svg class="w-6 h-6 text-rose-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
					</svg>
					<p class="text-gray-800 font-semibold">Memuat kenangan...</p>
				</div>
			</div>
		`;

		return container;
	}
}
