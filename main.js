// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Debounce function to limit rate of function execution
 */
function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==========================================
// DARK MODE TOGGLE
// ==========================================

function initDarkMode() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');

    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');

            // Update icon
            if (themeIcon) {
                if (isDark) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                } else {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            }

            // Save preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
}

// ==========================================
// SMOOTH SCROLLING
// ==========================================

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without page jump
                if (targetId && history.pushState) {
                    history.pushState(null, null, `#${targetId}`);
                }
            }
        });
    });
}

// ==========================================
// INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
// ==========================================

function initFadeInAnimations() {
    const faders = document.querySelectorAll('.fade-in-section');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
}

// ==========================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ==========================================

function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    const highlightNav = debounce(() => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100; // Offset for header
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');

                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    }
                });
            }
        });
    }, 100);

    window.addEventListener('scroll', highlightNav);
}

// ==========================================
// BUTTON LOADING STATE
// ==========================================

function handleButtonLoading(button, action, duration = 1500) {
    if (!button) return;

    button.classList.add('loading');
    button.disabled = true;

    return new Promise((resolve) => {
        setTimeout(() => {
            button.classList.remove('loading');
            button.disabled = false;

            if (action) action();
            resolve();
        }, duration);
    });
}

// ==========================================
// PRIMARY BUTTON INTERACTION
// ==========================================

function initPrimaryButton() {
    const btn = document.getElementById('primary-btn');

    if (btn) {
        btn.addEventListener('click', async () => {
            await handleButtonLoading(btn, () => {
                // Scroll to contact section
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 800);
        });
    }
}



// ==========================================
// STICKY HEADER EFFECT
// ==========================================

function initStickyHeader() {
    const header = document.querySelector('.site-header');

    // Initial check
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }

    const handleScroll = debounce(() => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 10);

    window.addEventListener('scroll', handleScroll);
}

// ==========================================
// TYPING ANIMATION
// ==========================================

function initTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const roles = [
        "Nephrologist",
        "Internal Medicine Specialist",
        "Fiction & Non-Fiction Writer",
        "Translator",
        "Web Developer",
        "Self-Taught Programmer",
        "IT & AI Enthusiast"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Faster when deleting
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // Normal typing speed
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing
    type();
}

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================

function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (!menuToggle || !navLinks) return;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    body.appendChild(overlay);

    // Toggle menu
    function toggleMenu() {
        const isActive = navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        overlay.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isActive);

        // Prevent body scroll when menu is open
        if (isActive) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }

    // Close menu
    function closeMenu() {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
    }

    // Event listeners
    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    // Close menu when clicking nav links
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close menu on window resize if screen becomes large
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMenu();
        }
    }, 150));
}

// ==========================================
// BACK TO TOP BUTTON
// ==========================================

function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    // Show/hide button based on scroll position
    const toggleButton = debounce(() => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, 100);

    window.addEventListener('scroll', toggleButton);

    // Scroll to top on click
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// HANDLE SYSTEM THEME CHANGES
// ==========================================

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only apply if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
        const isDark = e.matches;
        document.body.classList.toggle('dark-mode', isDark);

        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            if (isDark) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    }
});

// ==========================================
// PREMIUM ENHANCEMENTS - NEW FEATURES
// ==========================================

// ==========================================
// SCROLL PROGRESS INDICATOR
// ==========================================

function initScrollProgress() {
    // Create scroll progress element
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    const updateProgress = debounce(() => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    }, 10);

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call
}

// ==========================================
// PARTICLE EFFECTS SYSTEM
// ==========================================

function initParticleEffects() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Create particles container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    heroSection.style.position = 'relative';
    heroSection.insertBefore(particlesContainer, heroSection.firstChild);

    // Create particles
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    // Random animation delay
    particle.style.animationDelay = `${Math.random() * 20}s`;
    particle.style.animationDuration = `${15 + Math.random() * 10}s`;

    container.appendChild(particle);
}

// ==========================================
// TOAST NOTIFICATION SYSTEM
// ==========================================

class ToastNotification {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ'
        };

        const titles = {
            success: 'Success',
            error: 'Error',
            info: 'Info'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-content">
                <div class="toast-title">${titles[type] || titles.info}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close notification">×</button>
        `;

        this.container.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.hide(toast));

        // Auto hide
        if (duration > 0) {
            setTimeout(() => this.hide(toast), duration);
        }

        return toast;
    }

    hide(toast) {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// Global toast instance
const toast = new ToastNotification();

// ==========================================
// ENHANCED FORM SUBMISSION WITH TOAST
// ==========================================

function initEnhancedContactForm() {
    const form = document.querySelector('.contact-form');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const formData = new FormData(form);

            // Get form values
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Start loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            try {
                const response = await fetch('contact-handler.php', {
                    method: 'POST',
                    body: formData
                });

                let result = null;
                try {
                    result = await response.json();
                } catch {
                    result = null;
                }

                // Remove loading state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                if (response.ok && result && result.success) {
                    // Success feedback with toast
                    toast.success(result.message || `Thank you for your message, ${name}! I'll get back to you soon.`);
                    form.reset();
                } else {
                    // Error feedback with toast
                    toast.error((result && result.message) || 'There was an error sending your message. Please try again.');
                }
            } catch (error) {
                console.error('Form submission error:', error);

                // Remove loading state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                toast.error('Unable to reach the server. Please try again in a moment.');
            }
        });

        // Enhanced real-time validation feedback
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => {
                validateField(input);
            });

            // Clear error on input
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    input.classList.remove('error');
                    input.style.borderColor = '';
                }
            });
        });

        // Field validation helper
        function validateField(input) {
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.classList.add('error');
                input.style.borderColor = '#ef4444';
                return false;
            } else if (input.type === 'email' && input.value && !input.validity.valid) {
                input.classList.add('error');
                input.style.borderColor = '#ef4444';
                return false;
            } else {
                input.classList.remove('error');
                input.style.borderColor = '';
                return true;
            }
        }
    }
}

// ==========================================
// ANIMATED STATISTICS COUNTER
// ==========================================

function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count') || element.textContent);
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, duration / steps);
}

// ==========================================
// SKILL BARS ANIMATION
// ==========================================

function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length === 0) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const percentage = entry.target.getAttribute('data-percentage');
                entry.target.style.width = `${percentage}%`;
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => observer.observe(bar));
}

// ==========================================
// PARALLAX SCROLL EFFECT
// ==========================================

function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length === 0) return;

    const handleScroll = debounce(() => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax') || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 10);

    window.addEventListener('scroll', handleScroll);
}

// ==========================================
// SERVICE WORKER REGISTRATION
// ==========================================

// ==========================================
// SERVICE WORKER CLEANUP (Fix for reload loops)
// ==========================================

function initServiceWorker() {
    // Intentionally left as a no-op. Keep function for compatibility.
}

// ==========================================
// DYNAMIC YEAR UPDATE
// ==========================================

function initYearUpdate() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// ==========================================
// ENHANCED INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initDarkMode();
    initMobileMenu();
    initStickyHeader();
    initTypingAnimation();
    initSmoothScrolling();
    initFadeInAnimations();
    initActiveNavigation();
    initPrimaryButton();
    initEnhancedContactForm(); // Enhanced version with toast
    initBackToTop();
    initServiceWorker(); // PWA support

    // NEW PREMIUM FEATURES
    initScrollProgress();
    initParticleEffects();
    initStatsCounter();
    initSkillBars();
    initParallaxEffect();
    initYearUpdate(); // Add year update

    // Performance logging removed in production.
});
