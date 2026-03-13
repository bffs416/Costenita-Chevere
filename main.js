document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
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

    // Auto-add animate-reveal class
    const elementsToReveal = document.querySelectorAll('.section-header, .catalog-row, .actor-poster-wrapper, .video-container, .rsvp-card');
    elementsToReveal.forEach(el => el.classList.add('animate-reveal'));

    // Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.animate-reveal');
    revealElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.5, 0, 0, 1), transform 0.8s cubic-bezier(0.5, 0, 0, 1)';
        observer.observe(el);
    });

    // Dynamic style for revealed
    const style = document.createElement('style');
    style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Slider Arrows
    const sliderWrappers = document.querySelectorAll('.slider-wrapper');
    sliderWrappers.forEach(wrapper => {
        const leftArrow = wrapper.querySelector('.slider-arrow.left');
        const rightArrow = wrapper.querySelector('.slider-arrow.right');
        const sliderContent = wrapper.querySelector('.cast-slider, .netflix-row, .store-slider, .slider-content');

        if (leftArrow && rightArrow && sliderContent) {
            const getScrollAmount = () => {
                const firstSlide = sliderContent.querySelector('.store-slide, .actor-poster-wrapper, .movie-card, .bts-video');
                if (firstSlide) {
                    const style = window.getComputedStyle(sliderContent);
                    const gap = parseFloat(style.gap) || 0;
                    return firstSlide.offsetWidth + gap;
                }
                return sliderContent.clientWidth * 0.8;
            };
            leftArrow.addEventListener('click', () => sliderContent.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' }));
            rightArrow.addEventListener('click', () => sliderContent.scrollBy({ left: getScrollAmount(), behavior: 'smooth' }));
        }
    });

    // --- Cast & Store Modal Logic ---
    const castModal = document.getElementById('castModal');
    const castModalBody = document.getElementById('castModalBody');
    const closeCast = document.querySelector('.close-cast');
    const castWrappers = document.querySelectorAll('.actor-poster-wrapper');
    const zoomContainers = document.querySelectorAll('.zoom-container');

    const openModal = (content) => {
        castModalBody.innerHTML = content;
        castModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        castModal.classList.remove('active');
        document.body.style.overflow = '';
        castModalBody.innerHTML = '';
    };

    castWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(wrapper.querySelector('.netflix-card').innerHTML);
        });
    });

    zoomContainers.forEach(container => {
        const img = container.querySelector('img');
        container.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(`<img src="${img.src}" style="width:100%; border-radius:12px; display:block;">`);
        });
    });

    if (closeCast) closeCast.addEventListener('click', closeModal);
    if (castModal) {
        castModal.addEventListener('click', (e) => {
            if (e.target === castModal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && castModal && castModal.classList.contains('active')) closeModal();
    });

    // --- Video Modal Logic ---
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const closeModalBtn = document.querySelector('.close-modal');
    const btsVideos = document.querySelectorAll('.bts-video video');

    btsVideos.forEach(video => {
        video.style.cursor = 'pointer';
        video.addEventListener('click', (e) => {
            e.preventDefault();
            modalVideo.src = video.getAttribute('src');
            modalVideo.muted = true;
            if (window.innerHeight > window.innerWidth && window.innerWidth < 768) {
                videoModal.classList.add('forced-landscape');
            } else {
                videoModal.classList.remove('forced-landscape');
            }
            videoModal.classList.add('active');
            modalVideo.play();
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

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeLightbox);
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeLightbox();
        });
    }

    // --- Background Music Logic ---
    const bgMusic = document.getElementById('bgMusic');
    const audioToggle = document.getElementById('audioToggle');
    const audioStatus = audioToggle ? audioToggle.querySelector('.audio-status') : null;
    let isPlaying = true;
    let pausedByVideo = false;

    const updateAudioUI = () => {
        if (!audioToggle) return;
        if (isPlaying) {
            audioToggle.classList.add('playing');
            if (audioStatus) audioStatus.textContent = 'Sonido ON';
        } else {
            audioToggle.classList.remove('playing');
            if (audioStatus) audioStatus.textContent = 'Sonido OFF';
        }
    };

    const playMusic = () => {
        if (!bgMusic) return;
        bgMusic.play().then(() => {
            isPlaying = true;
            updateAudioUI();
        }).catch(e => console.log("Autoplay waiting for gesture"));
    };

    const pauseMusic = (byVideo = false) => {
        if (!bgMusic) return;
        bgMusic.pause();
        isPlaying = false;
        if (byVideo) pausedByVideo = true;
        updateAudioUI();
    };

    const toggleMusic = () => {
        if (isPlaying) {
            pauseMusic();
            pausedByVideo = false;
        } else {
            playMusic();
            pausedByVideo = false;
        }
    };

    if (audioToggle) audioToggle.addEventListener('click', toggleMusic);

    // Audio triggers
    ['click', 'touchstart', 'scroll', 'mousedown', 'keydown', 'wheel', 'touchmove'].forEach(event => {
        document.addEventListener(event, () => {
            if (bgMusic && bgMusic.paused && !pausedByVideo) playMusic();
        }, { once: true });
    });

    // Smart Pause
    document.querySelectorAll('video').forEach(video => {
        if (video.id === 'bgMusic') return;
        video.addEventListener('play', () => {
            if (video.classList.contains('hero-video') || video.muted) return;
            if (isPlaying) pauseMusic(true);
        });
        video.addEventListener('pause', () => {
            if (pausedByVideo) {
                playMusic();
                pausedByVideo = false;
            }
        });
    });

    // Initial attempt
    playMusic();
});
