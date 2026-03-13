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
        const sliderContent = wrapper.querySelector('.cast-slider, .netflix-row, .store-slider, .slider-content');

        if (leftArrow && rightArrow && sliderContent) {
            const getScrollAmount = () => {
                const firstSlide = sliderContent.querySelector('.store-slide, .actor-poster-wrapper, .movie-card, .bts-video');
                if (firstSlide) {
                    // Get width including gap
                    const style = window.getComputedStyle(sliderContent);
                    const gap = parseFloat(style.gap) || 0;
                    return firstSlide.offsetWidth + gap;
                }
                return sliderContent.clientWidth * 0.8;
            };

            leftArrow.addEventListener('click', () => {
                sliderContent.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
            });

            rightArrow.addEventListener('click', () => {
                sliderContent.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
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

    // Interactive Magnifying Glass Effect
    const zoomContainers = document.querySelectorAll('.zoom-container');
    zoomContainers.forEach(container => {
        const img = container.querySelector('img');

        const handleZoom = (e) => {
            const rect = container.getBoundingClientRect();
            let x, y;

            if (e.type === 'mousemove') {
                x = e.clientX - rect.left;
                y = e.clientY - rect.top;
            } else if (e.type === 'touchmove') {
                x = e.touches[0].clientX - rect.left;
                y = e.touches[0].clientY - rect.top;
            }

            // Constrain coordinates within the container
            const xPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            const yPercent = Math.max(0, Math.min(100, (y / rect.height) * 100));

            // Apply zoom with smooth transition from the cursor point
            img.style.transformOrigin = `${xPercent}% ${yPercent}%`;
            img.style.transform = 'scale(2.8)'; // Slightly more zoom for better detail
        };

        const resetZoom = () => {
            img.style.transform = 'scale(1)';
            img.style.transformOrigin = 'center center';
        };

        container.addEventListener('mousemove', handleZoom);
        container.addEventListener('mouseleave', resetZoom);
        
        // Touch support for mobile devices
        container.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling while zooming
            handleZoom(e);
        }, { passive: false });
        container.addEventListener('touchend', resetZoom);
    });

    // --- Cast Modal Logic (Dedicated Lightbox) ---
    const castModal = document.getElementById('castModal');
    const castModalBody = document.getElementById('castModalBody');
    const closeCast = document.querySelector('.close-cast');
    const castWrappers = document.querySelectorAll('.actor-poster-wrapper');

    castWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Get the card content
            const cardContent = wrapper.querySelector('.netflix-card').innerHTML;
            castModalBody.innerHTML = cardContent;
            
            // Show modal
            castModal.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
    });

    const closeCastModal = () => {
        castModal.classList.remove('active');
        document.body.style.overflow = '';
        castModalBody.innerHTML = '';
    };

    closeCast.addEventListener('click', closeCastModal);
    castModal.addEventListener('click', (e) => {
        if (e.target === castModal) closeCastModal();
    });

    // Handle Escape for Cast Modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && castModal.classList.contains('active')) {
            closeCastModal();
        }
    });
    
    // --- Video Modal Logic ---
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const closeModal = document.querySelector('.close-modal');
    const btsVideos = document.querySelectorAll('.bts-video video');

    btsVideos.forEach(video => {
        // Change cursor directly via JS to indicate clickability
        video.style.cursor = 'pointer';
        
        video.addEventListener('click', (e) => {
            e.preventDefault();
            const videoSrc = video.getAttribute('src');
            modalVideo.src = videoSrc;
            modalVideo.muted = true;
            
            // Forzar horizontal en móviles verticales
            if (window.innerHeight > window.innerWidth && window.innerWidth < 768) {
                videoModal.classList.add('forced-landscape');
            } else {
                videoModal.classList.remove('forced-landscape');
            }
            
            videoModal.classList.add('active');
            modalVideo.play();
            
            // Disable background scrolling
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        videoModal.classList.remove('active');
        videoModal.classList.remove('forced-landscape');
        modalVideo.pause();
        modalVideo.src = '';
        document.body.style.overflow = '';
    };

    closeModal.addEventListener('click', closeLightbox);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeLightbox();
    });

    // Close Modal on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeLightbox();
        }
    });

    // --- Mobile Menu Logic ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Volume Lockdown Logic ---
    const lockVolume = (v) => {
        v.muted = true;
        v.volume = 0;
    };


    // Apply to all gossip and modal videos
    const allGossipVideos = document.querySelectorAll('.bts-video video, #modalVideo');
    allGossipVideos.forEach(v => {
        v.addEventListener('volumechange', () => lockVolume(v));
    });

    // --- Background Music Logic ---
    const bgMusic = document.getElementById('bgMusic');
    const audioToggle = document.getElementById('audioToggle');
    const audioStatus = audioToggle.querySelector('.audio-status');
    let isPlaying = false;
    let pausedByVideo = false;

    const updateAudioUI = () => {
        if (isPlaying) {
            audioToggle.classList.add('playing');
            audioStatus.textContent = 'Sonido ON';
        } else {
            audioToggle.classList.remove('playing');
            audioStatus.textContent = 'Sonido OFF';
        }
    };

    const playMusic = () => {
        bgMusic.play().then(() => {
            isPlaying = true;
            updateAudioUI();
        }).catch(e => console.log("Error playing audio:", e));
    };

    const pauseMusic = (byVideo = false) => {
        bgMusic.pause();
        isPlaying = false;
        if (byVideo) pausedByVideo = true;
        updateAudioUI();
    };

    const toggleMusic = () => {
        if (isPlaying) {
            pauseMusic();
            pausedByVideo = false; // Manual pause overrides auto-resume
        } else {
            playMusic();
            pausedByVideo = false;
        }
    };

    audioToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMusic();
    });

    // Smart Pause: Pause music when any video starts playing
    document.querySelectorAll('video').forEach(video => {
        if (video.id === 'bgMusic') return;
        
        video.addEventListener('play', () => {
            if (isPlaying) {
                pauseMusic(true);
            }
        });
        
        // Optional: Resume when video ends or is paused (if it was the one that paused it)
        video.addEventListener('pause', () => {
            if (pausedByVideo) {
                playMusic();
                pausedByVideo = false;
            }
        });
    });

    // Auto-play attempt on first interaction
    const startAudioOnFirstInteraction = () => {
        if (!isPlaying && !pausedByVideo) {
            playMusic();
        }
        document.removeEventListener('click', startAudioOnFirstInteraction);
        document.removeEventListener('scroll', startAudioOnFirstInteraction);
    };

    document.addEventListener('click', startAudioOnFirstInteraction);
    document.addEventListener('scroll', startAudioOnFirstInteraction);

});
