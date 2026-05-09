document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.classList.add("js-enabled");

    // ── PAGE FADE IN ──────────────────────────────────────────
    document.body.classList.add("page-transition");
    requestAnimationFrame(() => {
        document.body.classList.add("page-visible");
    });

    // ── NAVBAR ────────────────────────────────────────────────
    const navbar      = document.getElementById("navbar");
    const hamburger   = document.getElementById("hamburgerBtn");
    const navLinks    = document.getElementById("navLinks");
    const searchBtn   = document.getElementById("searchBtn");
    const searchBar   = document.getElementById("searchBar");
    const searchInput = document.getElementById("searchInput");
    const searchClose = document.getElementById("searchClose");

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
                spans[1].style.opacity   = "0";
                spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
            } else {
                spans[0].style.transform = "";
                spans[1].style.opacity   = "";
                spans[2].style.transform = "";
            }
        });
    }

    document.querySelectorAll(".nav-item.has-dropdown .nav-link").forEach(link => {
        link.addEventListener("click", e => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                link.closest(".nav-item")?.classList.toggle("open");
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
        searchClose.addEventListener("click", () => searchBar.classList.remove("open"));
    }

    if (searchBar) {
        document.addEventListener("keydown", e => {
            if (e.key === "Escape") searchBar.classList.remove("open");
        });
    }

    // ── ACTIVE NAV LINK ───────────────────────────────────────
    const currentPath = window.location.pathname;
    document.querySelectorAll(".nav-link").forEach(link => {
        const href = link.getAttribute("href");
        if (href && href !== "#" && href !== "/" && currentPath.includes(href)) {
            link.closest(".nav-item")?.classList.add("active");
        }
    });

    // ── SLIDESHOW ─────────────────────────────────────────────
    const slides = document.querySelectorAll(".slide");
    const dots   = document.querySelectorAll(".dot");
    let current = 0, slideInterval;

    if (slides.length > 0 && dots.length > 0) {
        const changeSlide = n => {
            slides[current].classList.remove("active");
            dots[current].classList.remove("active");
            current = (n + slides.length) % slides.length;
            slides[current].classList.add("active");
            dots[current].classList.add("active");
        };

        const autoSlide = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => changeSlide(current + 1), 5000);
        };

        dots.forEach((dot, i) => dot.addEventListener("click", () => {
            changeSlide(i);
            autoSlide();
        }));

        document.addEventListener("keydown", e => {
            if (e.key === "ArrowRight") { changeSlide(current + 1); autoSlide(); }
            if (e.key === "ArrowLeft")  { changeSlide(current - 1); autoSlide(); }
        });

        autoSlide();
    }

    // ── SCROLL REVEAL ─────────────────────────────────────────
    const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

    if (reveals.length > 0) {
        const revealScroll = () => {
            reveals.forEach(el => {
                if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                    el.classList.add("active");
                }
            });
        };
        window.addEventListener("scroll", revealScroll, { passive: true });
        revealScroll();
    }

    // ── PAGE TRANSITION ON LINK CLICK ─────────────────────────
    document.querySelectorAll("a").forEach(link => {
        const href = link.getAttribute("href");

        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            link.hostname !== window.location.hostname
        ) return;

        link.addEventListener("click", e => {
            e.preventDefault();
            document.body.classList.remove("page-visible");
            setTimeout(() => { window.location.href = href; }, 280);
        });
    });

    // ── PAGE LOADER ───────────────────────────────────────────
    const loader = document.getElementById("pageLoader");
    if (loader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                loader.classList.add("hidden");
            }, 600);
        });
    }

});