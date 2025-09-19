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
	const mainContent = document.getElementById('main-content');
	const openBtn = document.getElementById('sidebar-open');
	const closeBtn = document.getElementById('sidebar-close');
	const overlay = document.getElementById('sidebar-overlay');
	const toggleBtn = document.getElementById('sidebar-toggle');
	const toggleIcon = document.getElementById('sidebar-toggle-icon');
	const toggleText = toggleBtn.querySelector('span:last-child');
	const fixedOpenBtn = document.getElementById('sidebar-fixed-open');

	function updateToggleButton(isOpen) {
		if (isOpen) {
			toggleIcon.textContent = '←';
			toggleText.textContent = 'Close';
		} else {
			toggleIcon.textContent = '→';
			toggleText.textContent = 'Open';
		}
	}

	function updateSidebarState(isOpen) {
		if (isOpen) {
			sidebar.classList.remove('-translate-x-full');
			mainContent.classList.add('lg:pl-64');
			mainContent.classList.remove('pl-0');
			fixedOpenBtn.classList.add('opacity-0', 'pointer-events-none');
			fixedOpenBtn.classList.remove('opacity-100', 'pointer-events-auto');
			
			// Hide header logo when sidebar is open
			const headerLogo = document.getElementById('header-logo');
			if (headerLogo) {
				headerLogo.classList.add('opacity-0', 'pointer-events-none');
				headerLogo.classList.remove('opacity-100', 'pointer-events-auto');
			}
		} else {
			sidebar.classList.add('-translate-x-full');
			mainContent.classList.remove('lg:pl-64');
			mainContent.classList.add('pl-0');
			fixedOpenBtn.classList.remove('opacity-0', 'pointer-events-none');
			fixedOpenBtn.classList.add('opacity-100', 'pointer-events-auto');
			
			// Show header logo when sidebar is closed
			const headerLogo = document.getElementById('header-logo');
			if (headerLogo) {
				headerLogo.classList.remove('opacity-0', 'pointer-events-none');
				headerLogo.classList.add('opacity-100', 'pointer-events-auto');
			}
		}
	}

	function openSidebar() {
		updateSidebarState(true);
		overlay.classList.remove('pointer-events-none');
		requestAnimationFrame(() => {
			overlay.classList.add('opacity-100');
		});
		openBtn.setAttribute('aria-expanded', 'true');
		updateToggleButton(true);
	}

	function closeSidebar() {
		updateSidebarState(false);
		overlay.classList.add('pointer-events-none');
		overlay.classList.remove('opacity-100');
		openBtn.setAttribute('aria-expanded', 'false');
		updateToggleButton(false);
	}

	function toggleSidebar() {
		const isOpen = !sidebar.classList.contains('-translate-x-full');
		if (isOpen) {
			closeSidebar();
		} else {
			openSidebar();
		}
	}

	openBtn.addEventListener('click', openSidebar);
	closeBtn.addEventListener('click', closeSidebar);
	toggleBtn.addEventListener('click', toggleSidebar);
	fixedOpenBtn.addEventListener('click', openSidebar);
	overlay.addEventListener('click', closeSidebar);

	// Close on Escape for a11y
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') closeSidebar();
	});

	// Sticky classification bar hide/reveal on scroll (only if present)
	const classifyBar = document.getElementById('classify-bar');
	if (classifyBar) {
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
	}

	// Tag active toggle (visual only)
	document.querySelectorAll('.tag-btn').forEach((btn) => {
		btn.addEventListener('click', () => {
			document.querySelectorAll('.tag-btn').forEach((b) => b.classList.remove('bg-blue-600', 'text-white', 'border-blue-600'));
			btn.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
		});
	});

	// Modal controls (only if present on page)
	const modal = document.getElementById('image-modal');
	if (modal) {
		const modalContent = document.getElementById('modal-content');
		const modalClose = document.getElementById('modal-close');
		const modalImage = document.getElementById('modal-image');
		const modalBreed = document.getElementById('modal-breed');
		const modalAge = document.getElementById('modal-age');
		const modalSize = document.getElementById('modal-size');
		const modalWeight = document.getElementById('modal-weight');
		const modalStory = document.getElementById('modal-story');
		const modalInfoBtn = document.querySelector('#modal-info-btn');
		
		// Form view elements
		const petDetailsView = document.getElementById('pet-details-view');
		const contactFormView = document.getElementById('contact-form-view');
		const contactForm = document.getElementById('contact-form');
		const backToDetailsBtn = document.getElementById('back-to-details-btn');

		function openModal(imageData) {
			// Set modal content
			modalImage.src = imageData.src;
			modalImage.alt = imageData.alt;
			modalBreed.textContent = imageData.breed;
			modalAge.textContent = imageData.age;
			modalSize.textContent = imageData.size;
			modalWeight.textContent = imageData.weight;
			modalStory.textContent = imageData.story;

			// Reset to pet details view
			showPetDetailsView();

			// Show modal
			modal.classList.remove('opacity-0', 'pointer-events-none');
			modal.removeAttribute('aria-hidden');
			requestAnimationFrame(() => {
				modalContent.classList.remove('scale-95');
				modalContent.classList.add('scale-100');
			});

			// Prevent body scroll
			document.body.style.overflow = 'hidden';
		}

		function closeModal() {
			// Hide modal
			modalContent.classList.remove('scale-100');
			modalContent.classList.add('scale-95');
			modal.classList.add('opacity-0', 'pointer-events-none');
			modal.setAttribute('aria-hidden', 'true');

			// Reset to pet details view
			showPetDetailsView();

			// Restore body scroll
			document.body.style.overflow = '';
		}

		function showPetDetailsView() {
			// Slide form view out to the right and hide it
			contactFormView.classList.add('translate-x-full', 'opacity-0', 'pointer-events-none');
			contactFormView.classList.remove('translate-x-0', 'opacity-100', 'pointer-events-auto');
			// Slide pet details view in from the left
			petDetailsView.classList.remove('-translate-x-full');
			petDetailsView.classList.add('translate-x-0', 'pointer-events-auto');
		}

		function showContactFormView() {
			// Slide pet details view out to the left
			petDetailsView.classList.add('-translate-x-full');
			petDetailsView.classList.remove('translate-x-0', 'pointer-events-auto');
			// Slide form view in from the right and show it
			contactFormView.classList.remove('translate-x-full', 'opacity-0', 'pointer-events-none');
			contactFormView.classList.add('translate-x-0', 'opacity-100', 'pointer-events-auto');
		}

		// Get More Information button functionality
		if (modalInfoBtn) {
			modalInfoBtn.addEventListener('click', () => {
				showContactFormView();
			});
		}

		// Back to details button functionality
		if (backToDetailsBtn) {
			backToDetailsBtn.addEventListener('click', () => {
				showPetDetailsView();
			});
		}

		// Form submission
		if (contactForm) {
			contactForm.addEventListener('submit', (e) => {
				e.preventDefault();
				
				// Get form data
				const formData = new FormData(contactForm);
				const nombre = formData.get('nombre');
				const edad = formData.get('edad');
				const telefono = formData.get('telefono');
				const zona = formData.get('zona');
				
				// Here you would typically send the data to your server
				console.log('Form submitted:', { nombre, edad, telefono, zona });
				
				// Show success message
				alert('¡Gracias! Su solicitud ha sido enviada. Nos pondremos en contacto con usted pronto.');
				
				// Reset form and go back to details
				contactForm.reset();
				showPetDetailsView();
			});
		}

		if (modalClose) modalClose.addEventListener('click', closeModal);
		
		// Close modal when clicking outside (on the overlay/background)
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				closeModal();
			}
		});

		// Close on Escape for a11y
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && !modal.classList.contains('opacity-0')) {
				closeModal();
			}
		});

		// Expose openModal for other code in this file
		window.__openImageModal = openModal;
	}

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

	// Mock data for cards
	const mockData = [
		{ breed: 'Golden Retriever', age: '3 years', size: 'Medium', weight: '25 kg', story: 'This lovely companion was found wandering in the park and has been with us for the past month. Very friendly and loves to play with children. Gets along well with other dogs and is fully vaccinated.' },
		{ breed: 'Labrador', age: '2 years', size: 'Large', weight: '30 kg', story: 'A playful and energetic dog that loves water activities. Great with families and has been trained in basic commands. Looking for an active family to match his energy level.' },
		{ breed: 'Beagle', age: '1 year', size: 'Small', weight: '12 kg', story: 'Curious and friendly little dog with a great sense of smell. Perfect for families with children. Loves to explore and go on walks. House trained and ready for adoption.' },
		{ breed: 'German Shepherd', age: '4 years', size: 'Large', weight: '35 kg', story: 'Intelligent and loyal companion. Has been trained as a family protector and is great with children. Needs regular exercise and mental stimulation.' },
		{ breed: 'Poodle', age: '2 years', size: 'Medium', weight: '18 kg', story: 'Elegant and smart dog with hypoallergenic fur. Great for families with allergies. Loves to learn new tricks and enjoys grooming sessions.' },
		{ breed: 'Bulldog', age: '5 years', size: 'Medium', weight: '22 kg', story: 'Gentle giant with a calm temperament. Perfect for apartment living. Loves to cuddle and is great with children. Low maintenance and very loyal.' },
		{ breed: 'Border Collie', age: '2 years', size: 'Medium', weight: '20 kg', story: 'Highly intelligent and energetic working dog. Needs lots of exercise and mental stimulation. Great for active families who love outdoor activities.' },
		{ breed: 'Chihuahua', age: '1 year', size: 'Small', weight: '3 kg', story: 'Tiny but mighty! This little dog has a big personality. Perfect for apartment living and loves to be carried around. Great companion for seniors.' },
		{ breed: 'Husky', age: '3 years', size: 'Large', weight: '28 kg', story: 'Beautiful and energetic sled dog. Loves cold weather and running. Needs lots of exercise and a secure yard. Great for active families.' },
		{ breed: 'Corgi', age: '2 years', size: 'Small', weight: '12 kg', story: 'Adorable short-legged herding dog. Very intelligent and loves to play. Great with children and other pets. Perfect family companion.' }
	];

	// Helper: create a single masonry card
	function createCard(index) {
		// Randomize aspect by height for masonry effect
		const width = 600;
		const height = 450 + Math.floor(Math.random() * 300); // 450-750
		const seed = `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`;
		const src = `https://picsum.photos/seed/${seed}/${width}/${height}`;

		// Get mock data for this card
		const dataIndex = index % mockData.length;
		const cardData = mockData[dataIndex];

		const wrapper = document.createElement('article');
		wrapper.className = 'mb-4 break-inside-avoid rounded-lg overflow-hidden bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 ease-in-out cursor-pointer';

		const img = document.createElement('img');
		img.src = src; // native lazy
		img.loading = 'lazy';
		img.alt = `${cardData.breed} - ${cardData.age}`;
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
		caption.textContent = cardData.breed;

		const actions = document.createElement('div');
		actions.className = 'flex items-center gap-2';
		actions.innerHTML = '<button class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 transition-all duration-300 ease-in-out" aria-label="Like">❤</button>';

		// Hover zoom on image
		wrapper.addEventListener('mouseenter', () => img.classList.add('scale-[1.02]'));
		wrapper.addEventListener('mouseleave', () => img.classList.remove('scale-[1.02]'));

		// Click to open modal
		wrapper.addEventListener('click', () => {
			if (typeof window.__openImageModal === 'function') {
				window.__openImageModal({
				src: src,
				alt: `${cardData.breed} - ${cardData.age}`,
				...cardData
				});
			}
		});

		wrapper.appendChild(img);
		meta.appendChild(caption);
		meta.appendChild(actions);
		wrapper.appendChild(meta);
		return wrapper;
	}

	// Load next batch into masonry (only if masonry exists on page)
	if (masonry && sentinel && endMessage) {
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

		// Initial content for feed page
		loadNextBatch();
	}

	updateScrollTopBtn();
	
	// Initialize sidebar state - start open on desktop, closed on mobile
	const isDesktop = window.innerWidth >= 1024; // lg breakpoint
	const isInitiallyOpen = isDesktop;
	updateSidebarState(isInitiallyOpen);
	updateToggleButton(isInitiallyOpen);
})();


