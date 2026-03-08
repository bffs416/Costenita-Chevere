document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect - adapted for Pastel theme
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            navbar.style.padding = '1rem 4%';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.2)';
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '1.2rem 4%';
        }
    });

    // Auto-add animate-reveal class to key elements for scroll animations
    const elementsToReveal = document.querySelectorAll('.section-header, .catalog-row, .actor-poster-wrapper, .video-container, .rsvp-card');
    elementsToReveal.forEach(el => el.classList.add('animate-reveal'));

    // Intersection Observer for revealing elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.animate-reveal');
    revealElements.forEach((el) => {
        // Add initial state via inline styles or CSS
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.5, 0, 0, 1), transform 0.8s cubic-bezier(0.5, 0, 0, 1)';

        observer.observe(el);
    });

    // Dynamic class for revealed elements
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form submission simulation
    const rsvpForm = document.querySelector('.rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = rsvpForm.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'Verificando Lista...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = '¡INVITACIÓN CONFIRMADA!';
                btn.style.backgroundColor = '#98d8d8'; // Pastel mint color
                btn.style.borderColor = '#98d8d8';
                rsvpForm.reset();

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                }, 3000);
            }, 1000);
        });
    }

    // Video placeholder click simulation
    const videoPlaceholder = document.querySelector('.video-placeholder-main');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', () => {
            alert('¡Próximamente! El trailer completo se revelará aquí.');
        });
    }

    // Slider Navigation Arrows
    const sliderWrappers = document.querySelectorAll('.slider-wrapper');
    sliderWrappers.forEach(wrapper => {
        const leftArrow = wrapper.querySelector('.slider-arrow.left');
        const rightArrow = wrapper.querySelector('.slider-arrow.right');
        const sliderContent = wrapper.querySelector('.cast-slider, .netflix-row, .store-slider');

        if (leftArrow && rightArrow && sliderContent) {
            leftArrow.addEventListener('click', () => {
                const scrollAmount = sliderContent.clientWidth * 0.8; // Scroll 80% of visible width
                sliderContent.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });

            rightArrow.addEventListener('click', () => {
                const scrollAmount = sliderContent.clientWidth * 0.8;
                sliderContent.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
    });

    // Auto-play for Collectibles Slideshow
    const storeSlider = document.querySelector('.store-slider');
    if (storeSlider) {
        let isHovered = false;

        // Pause on hover
        storeSlider.addEventListener('mouseenter', () => isHovered = true);
        storeSlider.addEventListener('mouseleave', () => isHovered = false);
        storeSlider.addEventListener('touchstart', () => isHovered = true);
        storeSlider.addEventListener('touchend', () => isHovered = false);

        setInterval(() => {
            if (!isHovered) {
                const maxScrollLeft = storeSlider.scrollWidth - storeSlider.clientWidth;
                // Add a small threshold (e.g. 50px) because fractional pixels can make it never perfectly equal
                if (Math.ceil(storeSlider.scrollLeft) >= maxScrollLeft - 50) {
                    storeSlider.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    // Determine width of ONE slide to slide cleanly
                    let slideWidth = storeSlider.querySelector('.store-slide')?.offsetWidth || window.innerWidth;
                    storeSlider.scrollBy({ left: slideWidth, behavior: 'smooth' });
                }
            }
        }, 3000); // Change slide every 3 seconds
    }
});
