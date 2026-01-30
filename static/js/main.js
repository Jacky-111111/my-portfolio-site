// Main JavaScript for portfolio site

const ROUTE_ORDER = { '/': 0, '/about': 1, '/contact': 2 };
const ROUTE_PATHS = ['/', '/about', '/contact'];

document.addEventListener('DOMContentLoaded', function() {
    // Highlight active navigation link
    highlightActiveNav();
    
    // Page transition: intercept nav, slide left/right
    initPageTransitions();
    
    // Add smooth scrolling
    addSmoothScrolling();
    
    // Add project card interactions
    initProjectCards();
    
    // Initialize gallery
    initProjectsGallery();
    
    // Contact page: copy email and toast
    initContactPage();
});

function initPageTransitions() {
    const internalLinks = document.querySelectorAll('.header a[href^="/"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href.indexOf('#') === 0) return;
            const targetPath = new URL(href, window.location.origin).pathname;
            if (ROUTE_ORDER[targetPath] === undefined) return;
            const currentPath = window.location.pathname;
            if (targetPath === currentPath) return;

            e.preventDefault();
            navigateWithTransition(href, targetPath);
        });
    });

    window.addEventListener('popstate', function() {
        loadPageContent(window.location.pathname, false);
    });
}

function navigateWithTransition(href, targetPath) {
    const currentPath = window.location.pathname;
    const currentIndex = ROUTE_ORDER[currentPath] ?? 0;
    const targetIndex = ROUTE_ORDER[targetPath] ?? 0;
    const goForward = targetIndex > currentIndex;

    fetch(href, { headers: { Accept: 'text/html' } })
        .then(r => r.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newMain = doc.querySelector('main.main-content .main-content-inner');
            const newContentHTML = newMain ? newMain.innerHTML : (doc.querySelector('main.main-content')?.innerHTML || '');
            if (!newContentHTML) {
                window.location.href = href;
                return;
            }
            runSlideTransition(targetPath, newContentHTML, goForward, href);
        })
        .catch(() => { window.location.href = href; });
}

function runSlideTransition(targetPath, newContentHTML, goForward, fullHref) {
    const main = document.querySelector('main.main-content');
    const inner = document.getElementById('mainContentInner');
    if (!main || !inner) return;

    const currentHTML = inner.innerHTML;
    const viewport = document.createElement('div');
    viewport.className = 'main-transition-viewport';
    viewport.dataset.direction = goForward ? 'forward' : 'back';

    const panelCurrent = document.createElement('div');
    panelCurrent.className = 'slide-panel current';
    panelCurrent.innerHTML = currentHTML;

    const panelNext = document.createElement('div');
    panelNext.className = 'slide-panel next slide-initial';
    panelNext.innerHTML = newContentHTML;

    viewport.appendChild(panelCurrent);
    viewport.appendChild(panelNext);

    main.classList.add('is-transitioning');
    main.innerHTML = '';
    main.appendChild(viewport);

    let finished = false;
    function finish() {
        if (finished) return;
        finished = true;
        main.classList.remove('is-transitioning');
        main.innerHTML = '<div class="main-content-inner" id="mainContentInner">' + newContentHTML + '</div>';
        history.pushState({ path: targetPath }, '', fullHref);
        highlightActiveNav();
        reinitPageModules();
    }

    panelNext.addEventListener('transitionend', function onEnd(e) {
        if (e.target !== panelNext || e.propertyName !== 'transform') return;
        finish();
    }, { once: true });

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            panelNext.classList.remove('slide-initial');
        });
    });

    setTimeout(finish, 450);
}

function loadPageContent(path, addHistory) {
    const href = path === '/' ? '/' : path;
    fetch(href, { headers: { Accept: 'text/html' } })
        .then(r => r.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newMain = doc.querySelector('main.main-content .main-content-inner');
            const newContentHTML = newMain ? newMain.innerHTML : (doc.querySelector('main.main-content')?.innerHTML || '');
            if (!newContentHTML) return;
            const main = document.querySelector('main.main-content');
            const inner = document.getElementById('mainContentInner');
            if (!main || !inner) return;
            inner.innerHTML = newContentHTML;
            if (addHistory) history.pushState({ path: path }, '', href);
            highlightActiveNav();
            reinitPageModules();
        })
        .catch(() => { window.location.href = href; });
}

function reinitPageModules() {
    addSmoothScrolling();
    initProjectCards();
    initProjectsGallery();
    initContactPage();
    if ('IntersectionObserver' in window) initScrollAnimations();
}

function highlightActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.classList.add('active');
        }
    });
}

function addSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Future: Add modal or navigation to project detail page
            console.log('Project card clicked:', this);
        });
    });
}

// Add fade-in animation on scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Initialize scroll animations if supported
if ('IntersectionObserver' in window) {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
}

// Projects Gallery Functions
function initProjectsGallery() {
    const gallery = document.getElementById('projectsGallery');
    const prevBtn = document.querySelector('.gallery-nav.prev');
    const nextBtn = document.querySelector('.gallery-nav.next');
    const indicators = document.getElementById('galleryIndicators');
    
    if (!gallery || !prevBtn || !nextBtn) return;
    
    const cards = gallery.querySelectorAll('.project-card');
    const cardWidth = 320 + 24; // card width + gap
    let currentIndex = 0;
    const totalCards = cards.length;
    let isScrolling = false; // 标记是否正在程序化滚动
    
    // 计算 padding offset（让卡片在边缘露出一半）
    const getPaddingOffset = () => Math.max(0, (window.innerWidth / 2) - 160);
    
    // 计算可见卡片数量（考虑 padding）
    const getCardsPerView = () => {
        const paddingOffset = getPaddingOffset();
        const visibleWidth = gallery.offsetWidth - (paddingOffset * 2);
        return Math.max(1, Math.floor(visibleWidth / cardWidth));
    };
    
    let cardsPerView = getCardsPerView();
    let totalPages = Math.ceil(totalCards / cardsPerView);
    
    // Create indicators - 为每个项目创建一个指示器
    if (indicators) {
        indicators.innerHTML = ''; // 清空现有指示器
        for (let i = 0; i < totalCards; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'gallery-indicator';
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => scrollToCard(i));
            indicators.appendChild(indicator);
        }
    }
    
    function updateButtons() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalPages - 1;
    }
    
    function updateIndicators() {
        if (indicators) {
            const indicatorElements = indicators.querySelectorAll('.gallery-indicator');
            // 计算当前视图中最居中的卡片索引
            const scrollPosition = gallery.scrollLeft;
            const currentPaddingOffset = getPaddingOffset();
            const adjustedScroll = Math.max(0, scrollPosition - currentPaddingOffset);
            const centerCardIndex = Math.round(adjustedScroll / cardWidth);
            const activeCardIndex = Math.max(0, Math.min(centerCardIndex, totalCards - 1));
            
            indicatorElements.forEach((ind, i) => {
                ind.classList.toggle('active', i === activeCardIndex);
            });
        }
    }
    
    function scrollToPage(page) {
        const targetIndex = Math.max(0, Math.min(page, totalPages - 1));
        if (targetIndex === currentIndex) return; // 如果已经在目标页面，不执行
        
        currentIndex = targetIndex;
        const currentPaddingOffset = getPaddingOffset();
        // 计算滚动位置：初始 padding + 页面偏移
        const scrollPosition = currentPaddingOffset + (currentIndex * cardsPerView * cardWidth);
        
        isScrolling = true;
        gallery.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        updateButtons();
        
        // 延迟更新指示器，等待滚动完成
        setTimeout(() => {
            isScrolling = false;
            updateIndicators();
        }, 600);
    }
    
    function scrollToCard(cardIndex) {
        const targetPage = Math.floor(cardIndex / cardsPerView);
        scrollToPage(targetPage);
    }
    
    // 按钮事件监听
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentIndex > 0 && !isScrolling) {
            scrollToPage(currentIndex - 1);
        }
    });
    
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentIndex < totalPages - 1 && !isScrolling) {
            scrollToPage(currentIndex + 1);
        }
    });
    
    // Update on scroll
    let scrollTimeout;
    gallery.addEventListener('scroll', () => {
        if (isScrolling) return; // 如果正在程序化滚动，不更新页面索引
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollPosition = gallery.scrollLeft;
            const currentPaddingOffset = getPaddingOffset();
            const adjustedScroll = Math.max(0, scrollPosition - currentPaddingOffset);
            const centerCardIndex = Math.round(adjustedScroll / cardWidth);
            const newPageIndex = Math.floor(centerCardIndex / cardsPerView);
            
            if (newPageIndex !== currentIndex && newPageIndex >= 0 && newPageIndex < totalPages) {
                currentIndex = newPageIndex;
                updateButtons();
            }
            // 总是更新指示器以反映当前可见的卡片
            updateIndicators();
        }, 100);
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newCardsPerView = Math.floor(gallery.offsetWidth / cardWidth);
            const newTotalPages = Math.ceil(cards.length / newCardsPerView);
            if (newTotalPages !== totalPages) {
                // Reinitialize if needed
                location.reload();
            }
        }, 250);
    });
    
    // Initialize - scroll to show first card half outside
    // Wait for layout to be ready
    setTimeout(() => {
        const initialPaddingOffset = getPaddingOffset();
        const initialScroll = initialPaddingOffset > 0 ? initialPaddingOffset : 0;
        gallery.scrollLeft = initialScroll;
        updateIndicators();
    }, 100);
    
    updateButtons();
    updateIndicators();
    
    // Enable mouse drag scrolling
    let isDown = false;
    let startX;
    let scrollLeft;
    
    gallery.addEventListener('mousedown', (e) => {
        isDown = true;
        gallery.style.cursor = 'grabbing';
        startX = e.pageX - gallery.offsetLeft;
        scrollLeft = gallery.scrollLeft;
    });
    
    gallery.addEventListener('mouseleave', () => {
        isDown = false;
        gallery.style.cursor = 'grab';
    });
    
    gallery.addEventListener('mouseup', () => {
        isDown = false;
        gallery.style.cursor = 'grab';
    });
    
    gallery.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - gallery.offsetLeft;
        const walk = (x - startX) * 2;
        gallery.scrollLeft = scrollLeft - walk;
    });
    
    gallery.style.cursor = 'grab';
}

// Contact page: copy-to-clipboard and toast
function initContactPage() {
    const copyBtn = document.querySelector('.contact-copy-btn');
    const toast = document.getElementById('contactToast');
    const emailCard = document.querySelector('.contact-card-email .contact-value');
    if (!copyBtn || !toast) return;

    copyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const email = emailCard ? emailCard.getAttribute('data-email') || emailCard.textContent.trim() : '';
        if (!email) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).then(function() {
                showContactToast(copyBtn, toast);
            }).catch(function() {
                fallbackCopy(email, copyBtn, toast);
            });
        } else {
            fallbackCopy(email, copyBtn, toast);
        }
    });
}

function fallbackCopy(text, copyBtn, toast) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
        document.execCommand('copy');
        showContactToast(copyBtn, toast);
    } catch (err) { /* ignore */ }
    document.body.removeChild(ta);
}

function showContactToast(copyBtn, toast) {
    copyBtn.classList.add('copied');
    toast.classList.add('visible');
    setTimeout(function() {
        toast.classList.remove('visible');
    }, 2000);
    setTimeout(function() {
        copyBtn.classList.remove('copied');
    }, 2500);
}
