// Navigation and Section Management
class NavigationManager {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');

        this.init();
    }

    init() {
        this.bindEvents();
        this.showSection('home');
    }

    bindEvents() {
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                this.navigateToSection(sectionId);
                this.updateActiveLink(link);
                this.closeMobileMenu();
            });
        });

        // Mobile menu toggle
        this.hamburger.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle scroll for section detection
        window.addEventListener('scroll', () => {
            this.updateActiveNavOnScroll();
        });
    }

    navigateToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    showSection(sectionId) {
        // This method is kept for compatibility but now we use scroll-based navigation
        this.navigateToSection(sectionId);
    }

    updateActiveNavOnScroll() {
        const scrollPosition = window.scrollY + 100; // Offset for navbar height

        this.sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Update active nav link
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    updateActiveLink(activeLink) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
    }
}

// Enhanced Events Carousel (Amazon Mini TV style)
class EventsCarousel {
    constructor() {
        this.track = document.getElementById('carouselTrack');
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicatorsContainer = document.getElementById('carouselIndicators');
        this.currentSlide = 0;
        this.autoRotateInterval = null;
        this.isPlaying = true;

        this.init();
    }

    init() {
        this.createIndicators();
        this.startAutoRotate();
        this.bindEvents();
        this.updateCarousel();
    }

    createIndicators() {
        this.indicatorsContainer.innerHTML = '';
        this.slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => this.goToSlide(index));
            this.indicatorsContainer.appendChild(indicator);
        });
    }

    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateCarousel();
        this.restartAutoRotate();
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
    }

    updateCarousel() {
        const translateX = -this.currentSlide * 100;
        this.track.style.transform = `translateX(${translateX}%)`;

        // Update indicators
        const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

        // Update slide active states
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
    }

    startAutoRotate() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
        }
        this.autoRotateInterval = setInterval(() => {
            if (this.isPlaying) {
                this.nextSlide();
            }
        }, 3000); // Change slide every 4 seconds for better viewing
    }

    stopAutoRotate() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
        }
    }

    restartAutoRotate() {
        this.stopAutoRotate();
        this.startAutoRotate();
    }

    pauseAutoRotate() {
        this.isPlaying = false;
    }

    resumeAutoRotate() {
        this.isPlaying = true;
    }

    bindEvents() {
        const carouselContainer = document.querySelector('.carousel-container');

        // Pause auto-rotation on hover
        carouselContainer.addEventListener('mouseenter', () => this.pauseAutoRotate());
        carouselContainer.addEventListener('mouseleave', () => this.resumeAutoRotate());

        // Touch/swipe support for mobile
        let startX = 0;
        let endX = 0;

        carouselContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.pauseAutoRotate();
        });

        carouselContainer.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        });

        carouselContainer.addEventListener('touchend', () => {
            const threshold = 50;
            const diff = startX - endX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }

            this.resumeAutoRotate();
            this.restartAutoRotate();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const homeSection = document.getElementById('home');
            const homeRect = homeSection.getBoundingClientRect();

            // Only handle keyboard navigation when home section is in view
            if (homeRect.top <= 100 && homeRect.bottom >= 100) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevSlide();
                    this.restartAutoRotate();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                    this.restartAutoRotate();
                }
            }
        });

        // Pause when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoRotate();
            } else {
                this.resumeAutoRotate();
            }
        });
    }
}

// Theme Manager
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('themeToggle');
        this.init();
    }

    init() {
        this.applyTheme();
        this.bindEvents();
        this.updateToggleIcon();
    }

    bindEvents() {
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
        this.updateToggleIcon();

        // Add a subtle animation effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }

    updateToggleIcon() {
        const icon = this.themeToggle.querySelector('i');
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// Modal Management 
class ModalManager {
    constructor() {
        this.modal = document.getElementById('recentEventsModal');
        this.showButton = document.getElementById('showRecentEvents');
        this.closeButton = document.querySelector('.close');

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Show modal
        this.showButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showModal();
        });

        // Close modal
        this.closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hideModal();
        });

        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                e.preventDefault();
                e.stopPropagation();
                this.hideModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                e.preventDefault();
                e.stopPropagation();
                this.hideModal();
            }
        });
    }

    showModal() {
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Focus management for accessibility
        const firstFocusable = this.modal.querySelector('.close');
        if (firstFocusable) {
            firstFocusable.focus();
        }

        // Pause carousel when modal is open
        if (window.eventsCarousel) {
            window.eventsCarousel.pauseAutoRotate();
        }
    }

    hideModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';

        // Return focus to the button that opened the modal
        this.showButton.focus();

        // Resume carousel when modal is closed
        if (window.eventsCarousel) {
            window.eventsCarousel.resumeAutoRotate();
        }
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Basic form validation
        if (!this.validateForm(data)) {
            return;
        }

        // Simulate form submission
        this.showSuccessMessage();
        this.form.reset();
    }

    validateForm(data) {
        const requiredFields = ['name', 'email', 'subject', 'message'];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                this.showErrorMessage(`Please fill in the ${field} field.`);
                return false;
            }
        }

        if (!emailRegex.test(data.email)) {
            this.showErrorMessage('Please enter a valid email address.');
            return false;
        }

        return true;
    }

    showSuccessMessage() {
        const button = this.form.querySelector('button');
        const originalText = button.textContent;

        button.textContent = 'Message Sent! ✓';
        button.style.background = 'linear-gradient(45deg, #10b981, #059669)';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'var(--gradient-secondary)';
            button.disabled = false;
        }, 3000);
    }

    showErrorMessage(message) {
        // Create or update error message element to user
        let errorElement = this.form.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                color: #ef4444;
                background: rgba(239, 68, 68, 0.1);
                padding: 0.75rem;
                border-radius: 0.5rem;
                margin-bottom: 1rem;
                border: 1px solid rgba(239, 68, 68, 0.2);
            `;
            this.form.insertBefore(errorElement, this.form.firstChild);
        }

        errorElement.textContent = message;

        // Remove error message after 5 seconds that shows in temp 
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, 5000);
    }
}

// Smooth Animations and Effects
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.observeElements();
        this.addScrollEffects();
        this.addParallaxEffect();
    }

    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        const animatedElements = document.querySelectorAll('.event-card, .achievement-card, .member-card, .stat');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    addScrollEffects() {
        let lastScrollTop = 0;
        const navbar = document.querySelector('.navbar');

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Navbar hide/show on scroll (only on mobile)
            if (window.innerWidth <= 768) {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }

            lastScrollTop = scrollTop;
        });
    }

    addParallaxEffect() {
        const hero = document.querySelector('.hero');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            if (hero && scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

// Performance Optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeScrolling();
        this.preloadCriticalResources();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    optimizeScrolling() {
        let ticking = false;

        function updateScrollEffects() {
            //! Scroll-based effects are handled here 
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }

    preloadCriticalResources() {
        // Preload critical images
        const criticalImages = [
            'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800',
            

        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
}

// Accessibility Manager
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.addKeyboardNavigation();
        this.addAriaLabels();
        this.addFocusManagement();
    }

    addKeyboardNavigation() {
        // Enhanced keyboard navigation for carousel
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // Ensure proper tab order
                this.manageFocusOrder(e);
            }
        });
    }

    addAriaLabels() {
        // Add ARIA labels for better screen reader support
        const carousel = document.querySelector('.carousel-container');
        if (carousel) {
            carousel.setAttribute('role', 'region');
            carousel.setAttribute('aria-label', 'Featured Events Carousel');
        }

        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.setAttribute('role', 'button');
            indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
        });
    }

    addFocusManagement() {
        // Ensure focus is properly managed throughout the application
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open modals or menus
                const modal = document.getElementById('recentEventsModal');
                if (modal && modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }
        });
    }

    manageFocusOrder(e) {
        // Custom focus management if needed
        const modal = document.getElementById('recentEventsModal');
        if (modal && modal.style.display === 'block') {
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new NavigationManager();
    window.eventsCarousel = new EventsCarousel();
    new ThemeManager();
    new ModalManager();
    // new ContactForm();
    new AnimationManager();
    new PerformanceOptimizer();
    new AccessibilityManager();

    // Add welcome animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Console message for developers
    // console.log(' TechClub website loaded successfully!');
    // console.log(' Built with vanilla HTML, CSS, and JavaScript');
    // console.log(' Fully responsive and optimized for all devices');
    // console.log(' Dark/Light theme support included');
    // console.log(' Accessibility features implemented');
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

// Service Worker registration (for future PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--animation-duration', '0s');
}

