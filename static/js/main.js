// ── FOUC FIX — run immediately ────────────────────────────
document.documentElement.style.visibility = "visible";
document.documentElement.style.opacity = "1";

document.addEventListener("DOMContentLoaded", () => {

    document.documentElement.classList.add("js-enabled");

    // ── PAGE FADE IN ──────────────────────────────────────────
    document.body.classList.add("page-transition");
    requestAnimationFrame(() => {
        document.body.classList.add("page-visible");
    });

    // ── NAVBAR ELEMENTS ───────────────────────────────────────
    const navbar      = document.getElementById("navbar");
    const hamburger   = document.getElementById("hamburgerBtn");
    const navLinks    = document.getElementById("navLinks");

    const searchBtn   = document.getElementById("searchBtn");
    const searchBar   = document.getElementById("searchBar");
    const searchInput = document.getElementById("searchInput");
    const searchClose = document.getElementById("searchClose");

    // ── NAVBAR SCROLL EFFECT ──────────────────────────────────
    if (navbar) {
        window.addEventListener("scroll", () => {
            navbar.classList.toggle("scrolled", window.scrollY > 10);
        }, { passive: true });
    }

    // ── MOBILE OVERLAY ────────────────────────────────────────
    const overlay = document.createElement("div");
    overlay.className = "nav-overlay";
    document.body.appendChild(overlay);

    // ── CLOSE MENU FUNCTION ───────────────────────────────────
    const closeMenu = () => {
        navLinks?.classList.remove("open");
        overlay.classList.remove("active");
        hamburger?.classList.remove("active");
        hamburger?.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");

        document.querySelectorAll(".nav-item.open").forEach(item => {
            item.classList.remove("open");
        });
    };

    // ── HAMBURGER TOGGLE ──────────────────────────────────────
    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {

            const isOpen = navLinks.classList.toggle("open");

            hamburger.classList.toggle("active", isOpen);
            overlay.classList.toggle("active", isOpen);
            document.body.classList.toggle("menu-open", isOpen);

            hamburger.setAttribute("aria-expanded", isOpen);
        });
    }

    overlay.addEventListener("click", closeMenu);

    // ── MOBILE DROPDOWNS ──────────────────────────────────────
document.querySelectorAll(".nav-item.has-dropdown").forEach(item => {

    const link = item.querySelector(".nav-link");

    link.addEventListener("click", (e) => {

        if (window.innerWidth <= 768) {

            e.preventDefault(); // stop navigation

            const isOpen = item.classList.contains("open");

            // close others
            document.querySelectorAll(".nav-item.has-dropdown.open").forEach(el => {
                if (el !== item) el.classList.remove("open");
            });

            // toggle this one
            item.classList.toggle("open", !isOpen);
        }
    });
});

    // ── CLOSE MENU ON LINK CLICK ──────────────────────────────
    document.querySelectorAll(".dropdown a").forEach(link => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    // ── FIX ON RESIZE ─────────────────────────────────────────
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // ── SEARCH ────────────────────────────────────────────────
    if (searchBtn && searchBar && searchInput) {
        searchBtn.addEventListener("click", () => {
            searchBar.classList.add("open");
            setTimeout(() => searchInput.focus(), 200);
        });
    }

    if (searchClose && searchBar) {
        searchClose.addEventListener("click", () => {
            searchBar.classList.remove("open");
        });
    }

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            searchBar?.classList.remove("open");
        }
    });

    // ── ACTIVE LINK HIGHLIGHT ────────────────────────────────
    const currentPath = window.location.pathname;

    document.querySelectorAll(".nav-link").forEach(link => {
        const href = link.getAttribute("href");
        if (href && currentPath.includes(href)) {
            link.closest(".nav-item")?.classList.add("active");
        }
    });

    // ── LEGAL PAGE TOC INTERACTIONS ──────────────────────────
    const tocLinks = document.querySelectorAll(".legal-toc .toc-link");
    const legalSections = document.querySelectorAll(".legal-block[id]");

    const updateLegalToc = () => {
        if (!tocLinks.length || !legalSections.length) return;

        const scrollPosition = window.scrollY + 140;
        let activeSectionId = legalSections[0]?.id;

        legalSections.forEach(section => {
            if (section.offsetTop <= scrollPosition) {
                activeSectionId = section.id;
            }
        });

        tocLinks.forEach(link => {
            const href = link.getAttribute("href");
            if (href === `#${activeSectionId}`) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    };

    tocLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return;

        link.addEventListener("click", e => {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                history.replaceState(null, "", href);
                tocLinks.forEach(el => el.classList.remove("active"));
                link.classList.add("active");
            }
        });
    });

    window.addEventListener("scroll", updateLegalToc, { passive: true });
    updateLegalToc();

    // ── SLIDESHOW ─────────────────────────────────────────────
    const slides = document.querySelectorAll(".slide");
    const dots   = document.querySelectorAll(".dot");

    let current = 0;
    let interval;

    if (slides.length && dots.length) {

        const changeSlide = (n) => {
            slides[current].classList.remove("active");
            dots[current].classList.remove("active");

            current = (n + slides.length) % slides.length;

            slides[current].classList.add("active");
            dots[current].classList.add("active");
        };

        const auto = () => {
            clearInterval(interval);
            interval = setInterval(() => changeSlide(current + 1), 5000);
        };

        dots.forEach((dot, i) => {
            dot.addEventListener("click", () => {
                changeSlide(i);
                auto();
            });
        });

        document.addEventListener("keydown", e => {
            if (e.key === "ArrowRight") changeSlide(current + 1);
            if (e.key === "ArrowLeft") changeSlide(current - 1);
            auto();
        });

        auto();
    }

    // ── SCROLL REVEAL ─────────────────────────────────────────
    const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

    const revealScroll = () => {
        reveals.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", revealScroll, { passive: true });
    revealScroll();

    // ── FIXED PAGE TRANSITION (IMPORTANT FIX) ─────────────────
    document.querySelectorAll("a").forEach(link => {

        const href = link.getAttribute("href");

        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            link.target === "_blank"
        ) return;

        link.addEventListener("click", e => {

            e.preventDefault();

            document.body.classList.remove("page-visible");

            setTimeout(() => {
                window.location.href = href;
            }, 250);
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