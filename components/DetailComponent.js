import { Component } from '../core/Component.js';
import { createElement } from '../utils/dom.js';
import { escapeHtml } from '../utils/helpers.js';
import { formatDate } from '../utils/date.js';

export class DetailComponent extends Component {
	constructor(options) {
		super(options);
		this.currentImageIndex = 0;
		this.autoPlayInterval = null;
		this.isPaused = false;
		this.pauseTimeout = null;
		this.imageContainer = null;
		this.touchStartX = 0;
		this.touchEndX = 0;
	}

	formatDescription(description) {
		if (!description) return '';
		return escapeHtml(description)
			.split('\n')
			.map(line => line.trim())
			.filter(line => line.length > 0)
			.join('<br><br>');
	}

	render() {
		const memory = this.props.memory;
		if (!memory) {
			const container = createElement('div', {
				classes: ['bg-gray-800', 'rounded-2xl', 'shadow-2xl', 'p-12', 'text-center', 'max-w-2xl', 'mx-auto', 'mt-8', 'border', 'border-gray-700']
			});
			container.innerHTML = `
				<div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full mb-6 animate-pulse">
					<i data-feather="alert-circle" class="w-12 h-12 text-blue-400"></i>
				</div>
				<h2 class="text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent mb-3">Kenangan Tidak Ditemukan</h2>
				<p class="text-gray-400 mb-8 text-lg">Maaf, kenangan yang Anda cari tidak dapat ditemukan atau mungkin sudah dihapus.</p>
				<button class="back-btn px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-semibold inline-flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
					<i data-feather="arrow-left" class="w-5 h-5"></i>
					<span>Kembali ke Beranda</span>
				</button>
			`;
			const backBtn = container.querySelector('.back-btn');
			this.addEventListener(backBtn, 'click', () => {
				this.props.onBack?.();
			});
			setTimeout(() => feather.replace({ width: 20, height: 20 }), 0);
			return container;
		}

		const container = createElement('div', {
			classes: ['bg-gray-800', 'rounded-2xl', 'shadow-2xl', 'overflow-hidden', 'border', 'border-gray-700', 'opacity-0', 'animate-fade-in', 'relative']
		});
		container.style.animationDelay = '0.1s';
		container.style.animationFillMode = 'forwards';

		const images = memory.images || [];
		const hasImage = images.length > 0;

		if (hasImage) {
			const imageSection = this.createImageSection(images, memory.title);
			container.appendChild(imageSection);
		}

		const contentSection = createElement('div', {
			classes: ['p-6', 'md:p-8', 'relative', 'overflow-hidden']
		});

		const category = memory.category || 'tanpa-kategori';
		const categoryLabel = category === 'tanpa-kategori' ? 'Tanpa Kategori' : category.charAt(0).toUpperCase() + category.slice(1);

		const hasDate = memory.date && memory.date !== '';
		const hasLocation = memory.location && memory.location !== '';
		const hasDescription = memory.description && memory.description !== '';
		const hasMemories = memory.memories && Array.isArray(memory.memories) && memory.memories.length > 0;

		let contentHtml = '<div class="mb-6 relative">';
		contentHtml += `
			<div class="flex items-center gap-3 justify-center mb-4">
				<div class="flex-1 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-blue-500 rounded-full"></div>
				<svg class="w-6 h-6 text-blue-500 animate-pulse flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
					<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
				</svg>
				<div class="flex-1 h-0.5 bg-gradient-to-r from-blue-500 via-blue-400 to-transparent rounded-full"></div>
			</div>
			<div class="flex items-start justify-between mb-4 flex-wrap gap-4">
				<h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-100 via-blue-100 to-cyan-100 bg-clip-text text-transparent leading-tight">${escapeHtml(memory.title)}</h1>
				<span class="text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-1.5 rounded-full shadow-md">${escapeHtml(categoryLabel)}</span>
			</div>
		`;

		if (hasDate || hasLocation) {
			contentHtml += '<div class="flex flex-col md:flex-row gap-3 text-gray-300 mb-4">';

			if (hasDate) {
				contentHtml += `
					<div class="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg border border-gray-600">
						<i data-feather="calendar" class="w-4 h-4 text-blue-400"></i>
						<span class="font-medium text-sm">${formatDate(memory.date)}</span>
					</div>
				`;
			}

			if (hasLocation) {
				contentHtml += `
					<div class="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg border border-gray-600">
						<i data-feather="map-pin" class="w-4 h-4 text-cyan-400"></i>
						<span class="font-medium text-sm">${escapeHtml(memory.location)}</span>
					</div>
				`;
			}

			contentHtml += '</div>';
		}

		contentHtml += '</div>';

		if (hasDescription) {
			contentHtml += `
				<div class="mb-6 bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border border-gray-600 transform hover:scale-[1.01] transition-all duration-300 relative overflow-hidden ripple-container">
					<h2 class="text-lg font-bold bg-gradient-to-r from-gray-100 to-blue-100 bg-clip-text text-transparent mb-3">Deskripsi</h2>
					<p class="text-gray-300 leading-relaxed text-base">${this.formatDescription(memory.description)}</p>
				</div>
			`;
		}

		if (hasMemories) {
			contentHtml += `
				<div class="mb-6">
					<h2 class="text-lg font-bold bg-gradient-to-r from-gray-100 to-cyan-100 bg-clip-text text-transparent mb-4 flex items-center gap-3">
						<div class="flex-1 h-0.5 bg-gradient-to-r from-transparent to-cyan-400 rounded-full"></div>
						<span>Momen Spesial</span>
						<div class="flex-1 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent rounded-full"></div>
					</h2>
					<ul class="space-y-2.5">
						${memory.memories.map((m, idx) => `
							<li class="flex items-start gap-2.5 p-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg border border-gray-600 hover:shadow-md transition-all duration-300 hover:border-blue-500 transform hover:scale-[1.01] opacity-0 animate-fade-in relative overflow-hidden ripple-container" style="animation-delay: ${idx * 0.1}s; animation-fill-mode: forwards;">
								<i data-feather="heart" class="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5 animate-pulse"></i>
								<span class="text-gray-200 font-medium text-sm">${escapeHtml(m)}</span>
							</li>
						`).join('')}
					</ul>
				</div>
			`;
		}

		contentSection.innerHTML = contentHtml;
		container.appendChild(contentSection);

		const backButton = createElement('button', {
			classes: ['mt-4', 'px-6', 'py-3', 'bg-gradient-to-r', 'from-gray-700', 'to-gray-600', 'text-white', 'rounded-lg', 'hover:from-gray-600', 'hover:to-gray-500', 'transition-all', 'duration-300', 'font-semibold', 'inline-flex', 'items-center', 'gap-2', 'shadow-md', 'hover:shadow-lg', 'transform', 'hover:-translate-y-0.5', 'border', 'border-gray-600', 'relative', 'overflow-hidden', 'ripple-container', 'text-sm']
		});
		backButton.innerHTML = '<i data-feather="arrow-left" class="w-4 h-4"></i><span>Kembali</span>';
		this.addEventListener(backButton, 'click', () => {
			this.props.onBack?.();
		});

		contentSection.appendChild(backButton);

		setTimeout(() => {
			feather.replace({ width: 20, height: 20 });
			this.addRippleEffect();
			if (hasImage && images.length > 1) {
				this.setupAutoPlay();
			}
		}, 100);

		return container;
	}

	createImageSection(images, title) {
		const imageSection = createElement('div', {
			classes: ['relative', 'w-full', 'bg-gradient-to-br', 'from-gray-700', 'to-gray-800', 'overflow-hidden', 'group']
		});
		imageSection.style.height = '280px';
		imageSection.style.maxHeight = '45vh';

		this.imageContainer = createElement('div', {
			classes: ['relative', 'w-full', 'h-full', 'cursor-pointer', 'touch-pan-y']
		});
		this.imageContainer.dataset.slideshowContainer = 'true';

		images.forEach((src, index) => {
			const img = createElement('img', {
				attributes: {
					src: src,
					alt: `${title} - ${index + 1}`,
					loading: index === 0 ? 'eager' : 'lazy',
					draggable: 'false'
				},
				classes: ['absolute', 'inset-0', 'w-full', 'h-full', 'object-cover', 'transition-opacity', 'duration-700', 'select-none']
			});
			img.style.opacity = index === 0 ? '1' : '0';
			img.dataset.imageIndex = index.toString();
			this.imageContainer.appendChild(img);
		});

		this.addEventListener(this.imageContainer, 'click', (e) => {
			if (images.length > 1) {
				const rect = this.imageContainer.getBoundingClientRect();
				const clickX = e.clientX - rect.left;
				const containerWidth = rect.width;

				if (clickX < containerWidth / 3) {
					this.prevImage();
					this.handleImageClick();
				} else if (clickX > (containerWidth * 2) / 3) {
					this.nextImage();
					this.handleImageClick();
				} else {
					this.handleImageClick();
				}
			}
		});

		this.addEventListener(this.imageContainer, 'touchstart', (e) => {
			this.touchStartX = e.changedTouches[0].screenX;
		}, { passive: true });

		this.addEventListener(this.imageContainer, 'touchend', (e) => {
			this.touchEndX = e.changedTouches[0].screenX;
			this.handleSwipe();
		}, { passive: true });

		imageSection.appendChild(this.imageContainer);

		if (images.length > 1) {
			const prevButton = createElement('button', {
				classes: ['absolute', 'left-3', 'top-1/2', 'transform', '-translate-y-1/2', 'bg-gray-900', 'bg-opacity-70', 'hover:bg-opacity-90', 'text-white', 'p-2', 'rounded-full', 'transition-all', 'duration-300', 'z-20', 'opacity-0', 'group-hover:opacity-100', 'shadow-lg', 'hover:scale-110']
			});
			prevButton.innerHTML = '<i data-feather="chevron-left" class="w-5 h-5"></i>';
			prevButton.dataset.navButton = 'prev';
			this.addEventListener(prevButton, 'click', (e) => {
				e.stopPropagation();
				this.prevImage();
				this.handleImageClick();
			});
			imageSection.appendChild(prevButton);

			const nextButton = createElement('button', {
				classes: ['absolute', 'right-3', 'top-1/2', 'transform', '-translate-y-1/2', 'bg-gray-900', 'bg-opacity-70', 'hover:bg-opacity-90', 'text-white', 'p-2', 'rounded-full', 'transition-all', 'duration-300', 'z-20', 'opacity-0', 'group-hover:opacity-100', 'shadow-lg', 'hover:scale-110']
			});
			nextButton.innerHTML = '<i data-feather="chevron-right" class="w-5 h-5"></i>';
			nextButton.dataset.navButton = 'next';
			this.addEventListener(nextButton, 'click', (e) => {
				e.stopPropagation();
				this.nextImage();
				this.handleImageClick();
			});
			imageSection.appendChild(nextButton);

			const badge = createElement('div', {
				classes: ['absolute', 'bottom-3', 'right-3', 'bg-gray-900', 'bg-opacity-80', 'px-2.5', 'py-1.5', 'rounded-lg', 'text-white', 'text-xs', 'font-semibold', 'flex', 'items-center', 'gap-1.5', 'backdrop-blur-sm', 'shadow-lg', 'z-20']
			});
			badge.innerHTML = `
				<i data-feather="image" class="w-3.5 h-3.5"></i>
				<span class="current-index-badge">1</span>/<span>${images.length}</span>
			`;
			imageSection.appendChild(badge);

			const indicators = createElement('div', {
				classes: ['absolute', 'bottom-3', 'left-1/2', 'transform', '-translate-x-1/2', 'flex', 'gap-1.5', 'z-20']
			});
			indicators.dataset.indicatorsContainer = 'true';
			images.forEach((_, index) => {
				const dot = createElement('div', {
					classes: ['w-2', 'h-2', 'rounded-full', 'transition-all', 'duration-300', 'cursor-pointer', 'shadow-sm', 'hover:scale-125']
				});
				dot.style.backgroundColor = index === 0 ? 'rgb(59, 130, 246)' : 'rgba(255, 255, 255, 0.5)';
				dot.dataset.dotIndex = index.toString();
				this.addEventListener(dot, 'click', (e) => {
					e.stopPropagation();
					this.goToImage(index);
					this.handleImageClick();
				});
				indicators.appendChild(dot);
			});
			imageSection.appendChild(indicators);
		}

		return imageSection;
	}

	addRippleEffect() {
		const rippleContainers = this.element.querySelectorAll('.ripple-container');
		rippleContainers.forEach(container => {
			this.addEventListener(container, 'click', (e) => {
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
			});
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

	setupAutoPlay() {
		const images = this.props.memory?.images || [];
		if (images.length <= 1) return;

		setTimeout(() => {
			this.startAutoPlay();
		}, 200);
	}

	startAutoPlay() {
		if (this.autoPlayInterval) {
			clearInterval(this.autoPlayInterval);
		}

		this.autoPlayInterval = setInterval(() => {
			if (!this.isPaused && this.imageContainer) {
				this.nextImage();
			}
		}, 5000);
	}

	handleImageClick() {
		this.isPaused = true;

		if (this.pauseTimeout) {
			clearTimeout(this.pauseTimeout);
		}

		this.pauseTimeout = setTimeout(() => {
			this.isPaused = false;
		}, 10000);
	}

	handleSwipe() {
		const swipeThreshold = 50;
		const diff = this.touchStartX - this.touchEndX;

		if (Math.abs(diff) > swipeThreshold) {
			if (diff > 0) {
				this.nextImage();
			} else {
				this.prevImage();
			}
			this.handleImageClick();
		}
	}

	nextImage() {
		const images = this.props.memory?.images || [];
		if (images.length <= 1) return;

		this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
		this.updateImageDisplay();
	}

	prevImage() {
		const images = this.props.memory?.images || [];
		if (images.length <= 1) return;

		this.currentImageIndex = (this.currentImageIndex - 1 + images.length) % images.length;
		this.updateImageDisplay();
	}

	goToImage(index) {
		const images = this.props.memory?.images || [];
		if (index < 0 || index >= images.length) return;

		this.currentImageIndex = index;
		this.updateImageDisplay();
	}

	updateImageDisplay() {
		if (!this.imageContainer) return;

		const allImages = this.imageContainer.querySelectorAll('[data-image-index]');
		allImages.forEach((img) => {
			const imgIndex = parseInt(img.dataset.imageIndex, 10);
			img.style.opacity = imgIndex === this.currentImageIndex ? '1' : '0';
		});

		const badge = this.element?.querySelector('.current-index-badge');
		if (badge) {
			badge.textContent = (this.currentImageIndex + 1).toString();
		}

		const indicators = this.element?.querySelector('[data-indicators-container]');
		if (indicators) {
			const dots = indicators.querySelectorAll('[data-dot-index]');
			dots.forEach((dot) => {
				const dotIndex = parseInt(dot.dataset.dotIndex, 10);
				dot.style.backgroundColor = dotIndex === this.currentImageIndex
					? 'rgb(59, 130, 246)'
					: 'rgba(255, 255, 255, 0.5)';
			});
		}
	}

	destroy() {
		if (this.autoPlayInterval) {
			clearInterval(this.autoPlayInterval);
			this.autoPlayInterval = null;
		}
		if (this.pauseTimeout) {
			clearTimeout(this.pauseTimeout);
			this.pauseTimeout = null;
		}
		this.imageContainer = null;
		super.destroy();
	}
}
