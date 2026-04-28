const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('#navbar-menu');
const navLogo = document.querySelector('#navbar__logo');
const bar1 = document.querySelector('#bar1');
const bar2 = document.querySelector('#bar2');
const bar3 = document.querySelector('#bar3');
const mobileSearchToggle = document.querySelector('#mobile-search-toggle');
const mobileSearchDropdown = document.querySelector('#mobile-search-dropdown');

const toggleMobileSearch = () => {
    const isExpanded = mobileSearchToggle.getAttribute('aria-expanded') === 'true';
    mobileSearchToggle.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    mobileSearchDropdown.classList.toggle('opacity-0');
    mobileSearchDropdown.classList.toggle('-translate-y-2');
    mobileSearchDropdown.classList.toggle('pointer-events-none');
};

mobileSearchToggle.addEventListener('click', toggleMobileSearch);

// Display Mobile Menu
const mobileMenu = () => {
    const isActive = menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
    menu.setAttribute('aria-expanded', isActive ? 'true' : 'false');

    if (isActive) {
        bar1.classList.add('translate-y-[8px]', 'rotate-45');
        bar2.classList.add('opacity-0');
        bar3.classList.add('-translate-y-[8px]', '-rotate-45');
        } else {
            bar1.classList.remove('translate-y-[8px]', 'rotate-45');
            bar2.classList.remove('opacity-0');
            bar3.classList.remove('-translate-y-[8px]', '-rotate-45');
        }
};

menu.addEventListener('click', mobileMenu);

// Navbar current-page highlight
const initNavbarHighlight = () => {
    const navLinks = document.querySelectorAll('#navbar-menu a[href]');
    if (!navLinks.length) return;

    const normalizePage = (value) => {
        const raw = (value || '').toLowerCase().split('#')[0].split('?')[0].trim();
        let path = raw.startsWith('/') ? raw : '/' + raw;

        if (path === '' || path === '/') return 'index.html';

        // Treat folder roots as homepage (e.g. /group-project/)
        if (path.endsWith('/')) return 'index.html';

        if (path === '/index' || path === '/index.html' || path === '/home' || path === '/home.html') {
            return 'index.html';
        }

        if (path === '/about' || path === '/about.html') {
            return 'about.html';
        }

        if (path === '/contact-us' || path === '/contact-us.html') {
            return 'contact-us.html';
        }

        if (path === '/blog' || path === '/blog.html') {
            return 'blog.html';
        }

        return path.split('/').pop() || 'index.html';
    };

    const currentPage = normalizePage(window.location.pathname);

    const setActiveNavLink = (activeLink) => {
        navLinks.forEach((link) => {
            link.classList.remove('opacity-100', 'sm:opacity-100');
            link.classList.add('opacity-60', 'sm:opacity-30');
        });

        activeLink.classList.remove('opacity-60', 'sm:opacity-30');
        activeLink.classList.add('opacity-100', 'sm:opacity-100');
    };

    navLinks.forEach((link) => {
        const href = normalizePage(link.getAttribute('href') || '');
        if (href && href === currentPage) {
            setActiveNavLink(link);
        }

        link.addEventListener('click', () => {
            setActiveNavLink(link);
        });
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbarHighlight);
} else {
    initNavbarHighlight();
}
        

// Close mobile menu when clicking on a menu item
const hideMobileMenu = () => {
    const menuBars = document.querySelector('.is-active');
    if (window.innerWidth <= 768 && menuBars) {
        menu.classList.remove('is-active');
        menuLinks.classList.remove('active');
        menu.setAttribute('aria-expanded', 'false');
        bar1.classList.remove('translate-y-[8px]', 'rotate-45');
        bar2.classList.remove('opacity-0');
        bar3.classList.remove('-translate-y-[8px]', '-rotate-45');
    }
};

const hideMobileSearch = () => {
    if (window.innerWidth <= 960 && mobileSearchToggle?.getAttribute('aria-expanded') === 'true') {
        mobileSearchToggle.setAttribute('aria-expanded', 'false');
        mobileSearchDropdown.classList.add('opacity-0', '-translate-y-2', 'pointer-events-none');
    }
};

menuLinks?.addEventListener('click', hideMobileMenu);
menuLinks?.addEventListener('click', hideMobileSearch);
navLogo?.addEventListener('click', hideMobileMenu);
navLogo?.addEventListener('click', hideMobileSearch);

 // Back to Top Button
        const backToTopBtn = document.getElementById('back-to-top');
        
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.remove('hidden');
                    backToTopBtn.classList.add('flex');
                } else {
                    backToTopBtn.classList.add('hidden');
                    backToTopBtn.classList.remove('flex');
                }
            });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
