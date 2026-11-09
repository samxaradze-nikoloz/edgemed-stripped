// ── EARLY FLAG (runs immediately, so .reveal elements never flash) ──
document.documentElement.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", () => {

    // ── ELEMENTS ──────────────────────────────────────────────
    const navbar      = document.getElementById("navbar");
    const hamburger   = document.getElementById("hamburgerBtn");
    const navLinks    = document.getElementById("navLinks");

    const searchBtn   = document.getElementById("searchBtn");
    const searchBar   = document.getElementById("searchBar");
    const searchInput = document.getElementById("searchInput");
    const searchClose = document.getElementById("searchClose");

    // ── MOBILE OVERLAY ────────────────────────────────────────
    const overlay = document.createElement("div");
    overlay.className = "nav-overlay";
    document.body.appendChild(overlay);

    // ── MENU OPEN / CLOSE ─────────────────────────────────────
    const closeMenu = () => {
        navLinks?.classList.remove("open");
        overlay.classList.remove("active");
        hamburger?.classList.remove("active");
        hamburger?.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
        document.querySelectorAll(".nav-item.open").forEach(item => item.classList.remove("open"));
    };

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            hamburger.classList.toggle("active", isOpen);
            overlay.classList.toggle("active", isOpen);
            document.body.classList.toggle("menu-open", isOpen);
            hamburger.setAttribute("aria-expanded", String(isOpen));
        });
    }

    overlay.addEventListener("click", closeMenu);

    // ── MOBILE DROPDOWNS ──────────────────────────────────────
    document.querySelectorAll(".nav-item.has-dropdown").forEach(item => {
        const link = item.querySelector(".nav-link");
        if (!link) return;

        link.addEventListener("click", e => {
            if (window.innerWidth > 768) return;
            e.preventDefault();

            const wasOpen = item.classList.contains("open");
            document.querySelectorAll(".nav-item.has-dropdown.open").forEach(el => {
                if (el !== item) el.classList.remove("open");
            });
            item.classList.toggle("open", !wasOpen);
        });
    });

    document.querySelectorAll(".dropdown a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) closeMenu();
    });

    // ── SEARCH (only works if your HTML has these ids + CSS) ──
    if (searchBtn && searchBar && searchInput) {
        searchBtn.addEventListener("click", () => {
            searchBar.classList.add("open");
            setTimeout(() => searchInput.focus(), 200);
        });
    }
    searchClose?.addEventListener("click", () => searchBar?.classList.remove("open"));

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            searchBar?.classList.remove("open");
            closeMenu();
        }
    });

    // ── ACTIVE LINK HIGHLIGHT (exact path match) ──────────────
    const normalize = p => (p.length > 1 ? p.replace(/\/+$/, "") : p);
    const here = normalize(window.location.pathname);

    document.querySelectorAll(".nav-link[href], .dropdown a[href]").forEach(link => {
        const href = link.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

        let path;
        try { path = normalize(new URL(href, window.location.href).pathname); }
        catch { return; }

        if (path === here) link.closest(".nav-item")?.classList.add("active");
    });

    // ── TABLE OF CONTENTS (legal / policy pages) ──────────────
    const tocLinks = document.querySelectorAll(".legal-toc a[href^='#'], .toc a[href^='#']");
    const tocSections = document.querySelectorAll(".legal-block[id], .policy-section[id]");

    const updateToc = () => {
        if (!tocLinks.length || !tocSections.length) return;

        const line = 140;
        let activeId = tocSections[0].id;

        tocSections.forEach(section => {
            if (section.getBoundingClientRect().top <= line) activeId = section.id;
        });

        tocLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
        });
    };

    tocLinks.forEach(link => {
        link.addEventListener("click", e => {
            const target = document.querySelector(link.getAttribute("href"));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            history.replaceState(null, "", link.getAttribute("href"));
            tocLinks.forEach(el => el.classList.remove("active"));
            link.classList.add("active");
        });
    });

    // ── ONE THROTTLED SCROLL HANDLER ──────────────────────────
    let ticking = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            navbar?.classList.toggle("scrolled", window.scrollY > 10);
            updateToc();
            ticking = false;
        });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ── SLIDESHOW ─────────────────────────────────────────────
    const slides = document.querySelectorAll(".slide");
    const dots   = document.querySelectorAll(".dot");

    if (slides.length) {
        let current = 0;
        let timer;

        const changeSlide = n => {
            slides[current].classList.remove("active");
            dots[current]?.classList.remove("active");
            current = (n + slides.length) % slides.length;
            slides[current].classList.add("active");
            dots[current]?.classList.add("active");
        };

        const auto = () => {
            clearInterval(timer);
            timer = setInterval(() => changeSlide(current + 1), 5000);
        };

        dots.forEach((dot, i) => {
            dot.addEventListener("click", () => { changeSlide(i); auto(); });
        });

        document.addEventListener("keydown", e => {
            if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
            if (e.key === "ArrowRight") { changeSlide(current + 1); auto(); }
            if (e.key === "ArrowLeft")  { changeSlide(current - 1); auto(); }
        });

        // don't run the timer while the tab is hidden
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) clearInterval(timer); else auto();
        });

        auto();
    }

    // ── SCROLL REVEAL (IntersectionObserver) ──────────────────
    const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px -80px 0px", threshold: 0.05 });

        reveals.forEach(el => io.observe(el));
    } else {
        reveals.forEach(el => el.classList.add("active"));
    }

    // ── PAGE LOADER ───────────────────────────────────────────
    const loader = document.getElementById("pageLoader");

    if (loader) {
        const hideLoader = () => loader.classList.add("hidden");

        if (document.readyState === "complete") {
            setTimeout(hideLoader, 200);
        } else {
            window.addEventListener("load", () => setTimeout(hideLoader, 200));
        }
        // safety net: never block the page longer than 4s
        setTimeout(hideLoader, 4000);
    }
});