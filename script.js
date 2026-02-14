document.addEventListener('DOMContentLoaded', () => {
    // --- Sticky Navigation & Link Highlighting ---
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    // Toggle Mobile Menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

    // Scroll Logic (Sticky Header, Active Link, Parallax)
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Sticky Header
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Link Highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });

        // Parallax Effect for Hero Content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrollY * 0.4}px)`;
            heroContent.style.opacity = 1 - (scrollY / 700);
        }
    });


    // --- Hero Slideshow ---
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Auto play slideshow
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    const heroSection = document.getElementById('hero');
    heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
    heroSection.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000));


    // --- Scroll Animations (Reveal on Scroll) ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // --- Feature Details Expansion ---
    const expandBtns = document.querySelectorAll('.expand-btn');

    expandBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !expanded);

            const details = btn.nextElementSibling;
            if (!expanded) {
                details.classList.add('open');
                btn.textContent = 'Show Less';
            } else {
                details.classList.remove('open');
                btn.textContent = 'Learn More';
            }
        });
    });


    // --- Specs Accordion ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;

            // Close other items (Optional: remove this block if you want multiple open)
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });

            // Toggle active state
            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // Open first accordion item by default
    if (accordionHeaders.length > 0) {
        accordionHeaders[0].click();
    }


    // --- Gallery Carousel ---
    const galleryTrack = document.querySelector('.gallery-track');
    const galleryImgs = document.querySelectorAll('.gallery-img');
    const prevBtn = document.querySelector('.gallery-nav.prev');
    const nextBtn = document.querySelector('.gallery-nav.next');

    let currentImgIndex = 0;

    function updateGallery() {
        if (galleryImgs.length === 0) return;
        galleryTrack.style.transform = `translateX(-${currentImgIndex * 100}%)`;
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            currentImgIndex = (currentImgIndex + 1) % galleryImgs.length;
            updateGallery();
        });

        prevBtn.addEventListener('click', () => {
            currentImgIndex = (currentImgIndex - 1 + galleryImgs.length) % galleryImgs.length;
            updateGallery();
        });
    }

    // Smooth Scroll for Internal Links (Handling fixed header offset if needed)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});
