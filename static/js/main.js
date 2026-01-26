// Main JavaScript for portfolio site

document.addEventListener('DOMContentLoaded', function() {
    // Highlight active navigation link
    highlightActiveNav();
    
    // Add smooth scrolling
    addSmoothScrolling();
    
    // Add project card interactions
    initProjectCards();
    
    // Initialize gallery
    initProjectsGallery();
});

function highlightActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
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
