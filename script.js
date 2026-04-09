(function () {
	// Global config for UI interactions
	const masonry = document.getElementById('masonry');
	const sentinel = document.getElementById('sentinel');
	const endMessage = document.getElementById('end-message');

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

	// No mock data needed - Hugo generates all content

	// No need for createCard function - Hugo generates all content

	// Hugo generates all content, so no need for mock data injection
	// The masonry grid is already populated with Hugo-generated dog cards

	updateScrollTopBtn();
	
	// Initialize sidebar state - start open on desktop, closed on mobile
	const isDesktop = window.innerWidth >= 1024; // lg breakpoint
	const isInitiallyOpen = isDesktop;
	updateSidebarState(isInitiallyOpen);
	updateToggleButton(isInitiallyOpen);
})();


