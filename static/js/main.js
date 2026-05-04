document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.classList.add("js-enabled");

    const navbar = document.getElementById("navbar");
    const hamburger = document.getElementById("hamburgerBtn");
    const navLinks = document.getElementById("navLinks");
    const searchBtn = document.getElementById("searchBtn");
    const searchBar = document.getElementById("searchBar");
    const searchClose = document.getElementById("searchClose");
    const searchInput = document.getElementById("searchInput");

    if (navbar) {
        window.addEventListener("scroll", () => {
            navbar.classList.toggle("scrolled", window.scrollY > 10);
        }, { passive: true });
    }

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("open");
            const spans = hamburger.querySelectorAll("span");

            if (navLinks.classList.contains("open")) {
                spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
                spans[1].style.opacity = "0";
                spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
            } else {
                spans[0].style.transform = "";
                spans[1].style.opacity = "";
                spans[2].style.transform = "";
            }
        });
    }

    document.querySelectorAll(".nav-item.has-dropdown .nav-link").forEach(link => {
        link.addEventListener("click", (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const item = link.closest(".nav-item");
                if (item) {
                    item.classList.toggle("open");
                }
            }
        });
    });

    if (searchBtn && searchBar && searchInput) {
        searchBtn.addEventListener("click", () => {
            searchBar.classList.add("open");
            setTimeout(() => searchInput.focus(), 250);
        });
    }

    if (searchClose && searchBar) {
        searchClose.addEventListener("click", () => {
            searchBar.classList.remove("open");
        });
    }

    if (searchBar) {
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                searchBar.classList.remove("open");
            }
        });
    }

    const currentPath = window.location.pathname;
    document.querySelectorAll(".nav-link").forEach(link => {
        const href = link.getAttribute("href");
        if (href && href !== "#" && href !== "/" && currentPath.startsWith(href)) {
            const item = link.closest(".nav-item");
            if (item) {
                item.classList.add("active");
            }
        }
    });

    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    let current = 0;
    let slideInterval;

    if (slides.length > 0 && dots.length > 0) {
        function changeSlide(n) {
            slides.forEach(slide => slide.classList.remove("active"));
            dots.forEach(dot => dot.classList.remove("active"));

            current = (n + slides.length) % slides.length;
            slides[current].classList.add("active");
            dots[current].classList.add("active");
        }

        function nextSlide() {
            changeSlide(current + 1);
        }

        function autoSlide() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }

        // Dot click functionality
        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                changeSlide(index);
                autoSlide();
            });
        });

        // Keyboard navigation
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") {
                changeSlide(current + 1);
                autoSlide();
            } else if (e.key === "ArrowLeft") {
                changeSlide(current - 1);
                autoSlide();
            }
        });

        // Start auto-slide
        autoSlide();
    }

    const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

    if (reveals.length > 0) {
        function revealScroll() {
            reveals.forEach(el => {
                const top = el.getBoundingClientRect().top;
                const visible = window.innerHeight - 100;

                if (top < visible) {
                    el.classList.add("active");
                }
            });
        }

        window.addEventListener("scroll", revealScroll);
        revealScroll();
    }
});