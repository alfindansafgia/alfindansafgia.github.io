import { Component } from '../core/Component.js';
import { createElement } from '../utils/dom.js';
import { escapeHtml } from '../utils/helpers.js';
import { formatDate } from '../utils/date.js';

export class MemoriesComponent extends Component {
	constructor(options) {
		super(options);
		this.currentPage = parseInt(this.props.currentPage, 10) || 1;
		this.itemsPerPage = 10;
	}

	truncateText(text, maxLength = 150) {
		if (!text) return '';
		const cleaned = text.replace(/\n+/g, ' ').trim();
		if (cleaned.length <= maxLength) return cleaned;
		return cleaned.substring(0, maxLength) + '...';
	}

	render() {
		const wrapper = createElement('div', {
			classes: ['space-y-6']
		});

		const memories = this.props.memories || [];

		if (memories.length === 0) {
			wrapper.innerHTML = `
				<div class="text-center py-20">
					<div class="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full mb-6 animate-pulse border border-gray-600">
						<i data-feather="heart" class="w-16 h-16 text-blue-400"></i>
					</div>
					<h3 class="text-3xl font-bold bg-gradient-to-r from-gray-100 to-blue-100 bg-clip-text text-transparent mb-4">Belum Ada Kenangan</h3>
					<p class="text-gray-400 mb-8 text-lg max-w-md mx-auto">Mulai dokumentasikan momen-momen spesial dalam perjalanan cinta Anda</p>
				</div>
			`;
			setTimeout(() => feather.replace({ width: 20, height: 20 }), 0);
			return wrapper;
		}

		const totalPages = Math.ceil(memories.length / this.itemsPerPage);
		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
		const endIndex = startIndex + this.itemsPerPage;
		const currentMemories = memories.slice(startIndex, endIndex);

		const container = createElement('div', {
			classes: ['space-y-4']
		});

		currentMemories.forEach((memory, index) => {
			const memoryCard = this.createMemoryCard(memory, index);
			container.appendChild(memoryCard);
		});

		wrapper.appendChild(container);

		if (totalPages > 1) {
			const pagination = this.createPagination(totalPages);
			wrapper.appendChild(pagination);
		}

		setTimeout(() => feather.replace({ width: 16, height: 16 }), 0);
		return wrapper;
	}

	createMemoryCard(memory, index) {
		const card = createElement('div', {
			classes: ['memory-card', 'bg-gradient-to-br', 'from-gray-800', 'to-gray-900', 'rounded-xl', 'shadow-lg', 'hover:shadow-xl', 'transition-all', 'duration-300', 'cursor-pointer', 'overflow-hidden', 'border', 'border-gray-700', 'hover:border-blue-500', 'group', 'transform', 'hover:-translate-y-1', 'opacity-0', 'animate-fade-in']
		});
		card.style.animationDelay = `${index * 0.1}s`;
		card.style.animationFillMode = 'forwards';

		const images = memory.images || [];
		const hasImage = images.length > 0;
		const category = memory.category || 'tanpa-kategori';
		const categoryLabel = category === 'tanpa-kategori' ? 'Tanpa Kategori' : category.charAt(0).toUpperCase() + category.slice(1);

		let cardContent = '';

		if (hasImage) {
			cardContent += `
				<div class="relative h-48 overflow-hidden">
					<img 
						src="${images[0]}" 
						alt="${escapeHtml(memory.title)}" 
						class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
						loading="lazy"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
					${images.length > 1 ? `
						<div class="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5">
							<i data-feather="image" class="w-3.5 h-3.5"></i>
							<span>${images.length}</span>
						</div>
					` : ''}
					<div class="absolute bottom-0 left-0 right-0 p-4">
						<h3 class="text-xl font-bold text-white mb-1 line-clamp-2">
							${escapeHtml(memory.title)}
						</h3>
					</div>
				</div>
			`;
		}

		const hasDate = memory.date && memory.date !== '';
		const hasLocation = memory.location && memory.location !== '';
		const hasDescription = memory.description && memory.description !== '';
		const hasMoments = memory.memories && Array.isArray(memory.memories) && memory.memories.length > 0;

		cardContent += '<div class="p-4 space-y-3">';

		if (!hasImage) {
			cardContent += `
				<h3 class="text-xl font-bold bg-gradient-to-r from-gray-100 to-blue-100 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300">
					${escapeHtml(memory.title)}
				</h3>
			`;
		}

		if (hasDescription) {
			cardContent += `
				<p class="text-gray-300 text-sm leading-relaxed line-clamp-2">
					${escapeHtml(this.truncateText(memory.description, 120))}
				</p>
			`;
		}

		if (hasMoments && memory.memories.length > 0) {
			const maxShow = 3;
			const momentsToShow = memory.memories.slice(0, maxShow);
			const remaining = memory.memories.length - maxShow;
			
			cardContent += '<div class="bg-gray-800/50 rounded-lg p-3 border border-gray-700">';
			cardContent += '<div class="flex items-center gap-1.5 mb-2">';
			cardContent += '<i data-feather="star" class="w-3.5 h-3.5 text-yellow-400"></i>';
			cardContent += '<span class="text-xs font-bold text-gray-400 uppercase tracking-wide">Momen Spesial</span>';
			cardContent += '</div>';
			cardContent += '<ul class="space-y-1.5">';
			momentsToShow.forEach(moment => {
				cardContent += `
					<li class="flex items-start gap-2 text-xs text-gray-300">
						<div class="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1 flex-shrink-0"></div>
						<span>${escapeHtml(moment)}</span>
					</li>
				`;
			});
			cardContent += '</ul>';
			if (remaining > 0) {
				cardContent += `
					<div class="text-xs text-blue-400 font-semibold mt-2 flex items-center gap-1">
						<i data-feather="plus" class="w-3 h-3"></i>
						<span>${remaining} momen lainnya</span>
					</div>
				`;
			}
			cardContent += '</div>';
		}

		cardContent += '</div>';

		card.innerHTML = cardContent;

		this.addEventListener(card, 'click', () => {
			this.props.onMemoryClick?.(memory);
		});

		return card;
	}

	createPagination(totalPages) {
		const pagination = createElement('div', {
			classes: ['flex', 'flex-wrap', 'justify-center', 'items-center', 'gap-2', 'mt-8', 'pb-8']
		});

		const prevButton = createElement('button', {
			classes: ['px-4', 'py-2', 'text-sm', 'font-semibold', 'rounded-lg', 'border', 'border-gray-700', 'bg-gray-800', 'text-gray-300', 'hover:bg-gray-700', 'hover:border-blue-500', 'transition-all', 'duration-300', 'disabled:opacity-50', 'disabled:cursor-not-allowed']
		});
		prevButton.textContent = '← Prev';
		prevButton.disabled = this.currentPage === 1;
		this.addEventListener(prevButton, 'click', () => this.goToPage(this.currentPage - 1));
		pagination.appendChild(prevButton);

		const maxVisible = 5;
		let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
		let endPage = Math.min(totalPages, startPage + maxVisible - 1);

		if (endPage - startPage < maxVisible - 1) {
			startPage = Math.max(1, endPage - maxVisible + 1);
		}

		if (startPage > 1) {
			const firstButton = this.createPageButton(1);
			pagination.appendChild(firstButton);
			if (startPage > 2) {
				const dots = createElement('span', {
					classes: ['px-2', 'text-sm', 'text-gray-500']
				});
				dots.textContent = '...';
				pagination.appendChild(dots);
			}
		}

		for (let i = startPage; i <= endPage; i++) {
			const pageButton = this.createPageButton(i);
			pagination.appendChild(pageButton);
		}

		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				const dots = createElement('span', {
					classes: ['px-2', 'text-sm', 'text-gray-500']
				});
				dots.textContent = '...';
				pagination.appendChild(dots);
			}
			const lastButton = this.createPageButton(totalPages);
			pagination.appendChild(lastButton);
		}

		const nextButton = createElement('button', {
			classes: ['px-4', 'py-2', 'text-sm', 'font-semibold', 'rounded-lg', 'border', 'border-gray-700', 'bg-gray-800', 'text-gray-300', 'hover:bg-gray-700', 'hover:border-blue-500', 'transition-all', 'duration-300', 'disabled:opacity-50', 'disabled:cursor-not-allowed']
		});
		nextButton.textContent = 'Next →';
		nextButton.disabled = this.currentPage === totalPages;
		this.addEventListener(nextButton, 'click', () => this.goToPage(this.currentPage + 1));
		pagination.appendChild(nextButton);

		return pagination;
	}

	createPageButton(pageNumber) {
		const isActive = pageNumber === this.currentPage;
		const button = createElement('button', {
			classes: [
				'min-w-[40px]',
				'h-[40px]',
				'text-sm',
				'font-semibold',
				'rounded-lg',
				'border',
				'transition-all',
				'duration-300',
				isActive ? 'bg-gradient-to-r' : 'bg-gray-800',
				isActive ? 'from-blue-600' : '',
				isActive ? 'to-cyan-600' : '',
				isActive ? 'text-white' : 'text-gray-300',
				isActive ? 'border-blue-500' : 'border-gray-700',
				!isActive ? 'hover:bg-gray-700' : '',
				!isActive ? 'hover:border-blue-500' : ''
			]
		});
		button.textContent = pageNumber.toString();
		if (!isActive) {
			this.addEventListener(button, 'click', () => this.goToPage(pageNumber));
		}
		return button;
	}

	goToPage(pageNumber) {
		this.currentPage = pageNumber;
		this.props.onPageChange?.(pageNumber);
	}
}
