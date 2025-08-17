(function () {
	// Global config
	const MAX_IMAGES = 30; // total cap
	const BATCH_SIZE = 5; // per load
	const masonry = document.getElementById('masonry');
	const sentinel = document.getElementById('sentinel');
	const endMessage = document.getElementById('end-message');
	let loadedCount = 0;
	let isLoading = false;

	// Sidebar controls
	const sidebar = document.getElementById('sidebar');
	const openBtn = document.getElementById('sidebar-open');
	const closeBtn = document.getElementById('sidebar-close');
	const overlay = document.getElementById('sidebar-overlay');

	function openSidebar() {
		sidebar.classList.remove('-translate-x-full');
		overlay.classList.remove('pointer-events-none');
		requestAnimationFrame(() => {
			overlay.classList.add('opacity-100');
		});
		openBtn.setAttribute('aria-expanded', 'true');
	}

	function closeSidebar() {
		sidebar.classList.add('-translate-x-full');
		overlay.classList.add('pointer-events-none');
		overlay.classList.remove('opacity-100');
		openBtn.setAttribute('aria-expanded', 'false');
	}

	openBtn.addEventListener('click', openSidebar);
	closeBtn.addEventListener('click', closeSidebar);
	overlay.addEventListener('click', closeSidebar);

	// Close on Escape for a11y
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') closeSidebar();
	});

	// Sticky classification bar hide/reveal on scroll
	const classifyBar = document.getElementById('classify-bar');
	let lastScrollY = window.scrollY;
	let barHidden = false;
	function onScroll() {
		const current = window.scrollY;
		const threshold = 24; // avoid jitter near top
		if (current > lastScrollY && current > threshold && !barHidden) {
			classifyBar.classList.add('-translate-y-full');
			barHidden = true;
		} else if ((current < lastScrollY || current <= threshold) && barHidden) {
			classifyBar.classList.remove('-translate-y-full');
			barHidden = false;
		}
		lastScrollY = current;
	}
	window.addEventListener('scroll', onScroll, { passive: true });

	// Tag active toggle (visual only)
	document.querySelectorAll('.tag-btn').forEach((btn) => {
		btn.addEventListener('click', () => {
			document.querySelectorAll('.tag-btn').forEach((b) => b.classList.remove('bg-mb-black', 'text-white'));
			btn.classList.add('bg-mb-black', 'text-white');
		});
	});

	// Floating Scroll-To-Top button
	const scrollTopBtn = document.getElementById('scrollTopBtn');
	function updateScrollTopBtn() {
		if (window.scrollY > 300) {
			scrollTopBtn.classList.remove('opacity-0', 'translate-y-3', 'pointer-events-none');
		} else {
			scrollTopBtn.classList.add('opacity-0', 'translate-y-3', 'pointer-events-none');
		}
	}
	window.addEventListener('scroll', updateScrollTopBtn, { passive: true });
	scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

	// Helper: create a single masonry card
	function createCard(index) {
		// Randomize aspect by height for masonry effect
		const width = 600;
		const height = 450 + Math.floor(Math.random() * 300); // 450-750
		const seed = `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`;
		const src = `https://picsum.photos/seed/${seed}/${width}/${height}`;

		const wrapper = document.createElement('article');
		wrapper.className = 'mb-4 break-inside-avoid rounded-lg overflow-hidden bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 ease-in-out';

		const link = document.createElement('a');
		link.href = src;
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		link.className = 'group block';

		const img = document.createElement('img');
		img.src = src; // native lazy
		img.loading = 'lazy';
		img.alt = 'Placeholder image from Picsum';
		img.width = width;
		img.height = height;
		img.className = 'w-full h-auto object-cover opacity-0 translate-y-2 transition-all duration-300 ease-in-out will-change-transform';

		// Fade-in on load
		img.addEventListener('load', () => {
			img.classList.remove('opacity-0', 'translate-y-2');
			img.classList.add('opacity-100', 'translate-y-0');
		});

		const meta = document.createElement('div');
		meta.className = 'flex items-center justify-between px-3 py-2';

		const caption = document.createElement('p');
		caption.className = 'text-sm font-medium truncate';
		caption.textContent = 'Mock caption';

		const actions = document.createElement('div');
		actions.className = 'flex items-center gap-2';
		actions.innerHTML = '<button class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 transition-all duration-300 ease-in-out" aria-label="Like">❤</button>';

		// Hover zoom on image via parent .group
		link.addEventListener('mouseenter', () => img.classList.add('scale-[1.02]'));
		link.addEventListener('mouseleave', () => img.classList.remove('scale-[1.02]'));

		link.appendChild(img);
		meta.appendChild(caption);
		meta.appendChild(actions);
		wrapper.appendChild(link);
		wrapper.appendChild(meta);
		return wrapper;
	}

	// Load next batch into masonry
	async function loadNextBatch() {
		if (isLoading) return;
		if (loadedCount >= MAX_IMAGES) return;
		isLoading = true;

		const fragment = document.createDocumentFragment();
		let appended = 0;
		for (let i = 0; i < BATCH_SIZE && loadedCount + i < MAX_IMAGES; i++) {
			const card = createCard(loadedCount + i + 1);
			fragment.appendChild(card);
			appended++;
		}
		masonry.appendChild(fragment);

		loadedCount = loadedCount + appended;
		isLoading = false;

		if (loadedCount >= MAX_IMAGES) {
			endMessage.classList.remove('hidden');
			// Stop observing once finished
			if (io) io.disconnect();
		}
	}

	// Infinite scroll via IntersectionObserver on sentinel
	const io = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting && !isLoading && loadedCount < MAX_IMAGES) {
				loadNextBatch();
			}
		});
	}, { rootMargin: '200px' });
	io.observe(sentinel);

	// Initial content
	loadNextBatch();
	updateScrollTopBtn();
})();


