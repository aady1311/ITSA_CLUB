// Navigation Handler
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
    }

    bindEvents() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const id = link.getAttribute('href').substring(1);
                this.scrollTo(id);
                this.setActive(link);
                this.closeMobile();
            });
        });

        this.hamburger.addEventListener('click', () => this.toggleMobile());
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
                this.closeMobile();
            }
        });

        window.addEventListener('scroll', () => this.setActiveOnScroll());
    }

    scrollTo(id) {
        const target = document.getElementById(id);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    setActive(link) {
        this.navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    }

    toggleMobile() {
        this.navMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
    }

    closeMobile() {
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
    }

    setActiveOnScroll() {
        const scrollY = window.scrollY + 100;
        this.sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.id;
            if (scrollY >= top && scrollY < top + height) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Carousel
class EventsCarousel {
    constructor() {
        this.track = document.getElementById('carouselTrack');
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.getElementById('carouselIndicators');
        this.current = 0;
        this.isPlaying = true;
        this.interval = null;
        this.init();
    }

    init() {
        this.createIndicators();
        this.startAutoRotate();
        this.bindEvents();
    }

    createIndicators() {
        this.indicators.innerHTML = '';
        this.slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('indicator');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goTo(i));
            this.indicators.appendChild(dot);
        });
    }

    goTo(i) {
        this.current = i;
        this.update();
        this.restart();
    }

    next() {
        this.current = (this.current + 1) % this.slides.length;
        this.update();
    }

    prev() {
        this.current = (this.current - 1 + this.slides.length) % this.slides.length;
        this.update();
    }

    update() {
        const shift = -this.current * 100;
        this.track.style.transform = `translateX(${shift}%)`;
        this.indicators.querySelectorAll('.indicator').forEach((el, i) => {
            el.classList.toggle('active', i === this.current);
        });
    }

    startAutoRotate() {
        this.interval = setInterval(() => {
            if (this.isPlaying) this.next();
        }, 3000);
    }

    restart() {
        clearInterval(this.interval);
        this.startAutoRotate();
    }

    pause() {
        this.isPlaying = false;
    }

    resume() {
        this.isPlaying = true;
    }

    bindEvents() {
        const container = document.querySelector('.carousel-container');
        container.addEventListener('mouseenter', () => this.pause());
        container.addEventListener('mouseleave', () => this.resume());

        let startX = 0;
        container.addEventListener('touchstart', e => startX = e.touches[0].clientX);
        container.addEventListener('touchend', e => {
            const dx = startX - e.changedTouches[0].clientX;
            if (dx > 50) this.next();
            else if (dx < -50) this.prev();
            this.restart();
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') this.prev();
            else if (e.key === 'ArrowRight') this.next();
        });

        document.addEventListener('visibilitychange', () => {
            document.hidden ? this.pause() : this.resume();
        });
    }
}

// Modal
class ModalManager {
    constructor() {
        this.modal = document.getElementById('recentEventsModal');
        this.openBtn = document.getElementById('showRecentEvents');
        this.closeBtn = this.modal.querySelector('.close');
        this.init();
    }

    init() {
        this.openBtn.addEventListener('click', e => {
            e.preventDefault();
            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        this.closeBtn.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', e => {
            if (e.target === this.modal) this.close();
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') this.close();
        });
    }

    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Theme Toggle
class ThemeManager {
    constructor() {
        this.toggleBtn = document.getElementById('themeToggle');
        this.theme = localStorage.getItem('theme') || 'light';
        this.apply();
        this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.apply();
    }

    apply() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const icon = this.toggleBtn.querySelector('i');
        icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Popup Event
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('eventPopupOverlay');
    const close = document.getElementById('eventPopupClose');
    overlay.classList.add('show');
    close.addEventListener('click', () => overlay.classList.remove('show'));
});

// Init all
document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
    window.eventsCarousel = new EventsCarousel();
    new ModalManager();
    new ThemeManager();

    setTimeout(() => document.body.classList.add('loaded'), 100);
});

// Handle errors
window.addEventListener('error', e => {
    console.error('Error:', e.error);
});



document.addEventListener("DOMContentLoaded", () => {
    const BATCH_SIZE = 3;

    document.querySelectorAll(".team-category").forEach(category => {
        const memberCards = category.querySelectorAll(".member-card");
        const viewMoreBtn = category.querySelector(".view-more-btn");

        let isExpanded = false;

        const showInitial = () => {
            memberCards.forEach((card, index) => {
                card.classList.toggle("visible", index < BATCH_SIZE);
            });
            viewMoreBtn.textContent = "View More";
            isExpanded = false;
        };

        const showAll = () => {
            memberCards.forEach(card => card.classList.add("visible"));
            viewMoreBtn.textContent = "View Less";
            isExpanded = true;
        };

        viewMoreBtn?.addEventListener("click", () => {
            isExpanded ? showInitial() : showAll();
        });

        
        showInitial();

      
    });
});


let vantaEffect;

function loadVanta(colorHex) {
  if (vantaEffect) vantaEffect.destroy();
  vantaEffect = VANTA.WAVES({
    el: "#vanta-bg",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: colorHex,
    shininess: 80.00,
    waveHeight: 25.00,
    waveSpeed: 0.45,
    zoom: 1.80
  });
}

// on page load
const html = document.documentElement;
const savedTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-theme", savedTheme);

// check condition
loadVanta(savedTheme === "dark" ? 0x0f172a : 0x2563eb);

//  button click
document.getElementById("themeToggle").addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  // based on new theme
  loadVanta(newTheme === "dark" ? 0x0f172a : 0x2563eb);
});





