// Text Slideshow for Hero Section (3 minutes interval)
let currentTextSlide = 0;
const textSlides = document.querySelectorAll('.text-slide');
const textSlideInterval = 35000; // 35 seconds in milliseconds

function showTextSlide(index) {
    textSlides.forEach((slide, i) => {
        slide.classList.remove('active-slide');
        if (i === index) {
            slide.classList.add('active-slide');
        }
    });
}

function nextTextSlide() {
    currentTextSlide = (currentTextSlide + 1) % textSlides.length;
    showTextSlide(currentTextSlide);
}

// Start text slideshow if slides exist
if (textSlides.length > 0) {
    setInterval(nextTextSlide, textSlideInterval);
}
// Automatic Image Slideshow
let currentSlide = 0;
const slides = document.querySelectorAll('.slideshow-image');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Auto-advance slideshow every 3 seconds
if (slides.length > 0) {
    setInterval(nextSlide, 3000);
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
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

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Load dynamic content from admin
function loadDynamicContent() {
    const websiteContent = JSON.parse(localStorage.getItem('website_content') || '{}');
    const posts = (websiteContent.posts || []).filter(p => p.status === 'published');

    // ── Ticker bar ──────────────────────────────────────────
    const tickerBar   = document.getElementById('posts-ticker-bar');
    const tickerTrack = document.getElementById('posts-ticker-track');

    if (tickerBar && tickerTrack && posts.length > 0) {
        tickerBar.style.display = 'block';
        // Duplicate items so the scroll loops seamlessly
        const items = [...posts, ...posts].map(p =>
            `<span style="display:inline-flex; align-items:center; gap:8px; padding:0 32px; color:#e2e8f0; font-size:0.88rem; border-right:1px solid #334155;">
                <span style="background:#2563eb; color:white; padding:2px 8px; border-radius:4px; font-size:0.75rem; font-weight:700; text-transform:uppercase;">${p.category}</span>
                <span style="color:white; font-weight:500;">${p.title}</span>
            </span>`
        ).join('');
        tickerTrack.innerHTML = items;
        // Adjust animation speed based on content length
        const speed = Math.max(20, posts.length * 8);
        tickerTrack.style.animationDuration = speed + 's';
    } else if (tickerBar) {
        tickerBar.style.display = 'none';
    }

    // ── Main posts grid ──────────────────────────────────────
    updateRecentPosts(posts);
}

function updateRecentPosts(posts) {
    const grid = document.getElementById('main-posts-grid');
    if (!grid) return;

    // Clear skeleton loaders
    grid.innerHTML = '';

    const sorted = [...posts]
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sorted.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:4rem 2rem; color:#94a3b8;">
                <div style="font-size:3rem; margin-bottom:1rem;">📝</div>
                <p style="font-size:1.1rem; font-weight:500;">Barreeffamni hin jiru. Admin barreeffama haaraa dabaluu qaba.</p>
            </div>`;
        return;
    }

    sorted.forEach(post => {
        const card = document.createElement('article');
        card.className = 'post-card';

        const categoryColors = {
            kompitara:   { bg: '#dbeafe', color: '#1d4ed8' },
            bilbila:     { bg: '#dcfce7', color: '#15803d' },
            teeknoloojii:{ bg: '#fce7f3', color: '#9d174d' },
            seenaa:      { bg: '#fef3c7', color: '#92400e' },
            ai:          { bg: '#ede9fe', color: '#6d28d9' }
        };
        const cat = categoryColors[post.category] || { bg: '#e0e7ff', color: '#3730a3' };

        const imageHtml = post.image
            ? `<div class="post-image" style="background-image:url('${post.image}'); background-size:cover; background-position:center;"></div>`
            : `<div class="post-image" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); display:flex; align-items:center; justify-content:center; font-size:3rem;">📄</div>`;

        const excerpt = post.subtitle || post.content.substring(0, 120) + '...';
        const dateStr = new Date(post.date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });

        card.innerHTML = `
            ${imageHtml}
            <div class="post-content">
                <span class="post-category" style="background:${cat.bg}; color:${cat.color};">${post.category}</span>
                <h3>${post.title}</h3>
                <p>${excerpt}</p>
                <div class="post-meta">
                    <span>📅 ${dateStr}</span>
                    <span style="color:#059669; font-weight:600; font-size:0.8rem;">ClickICT</span>
                </div>
                ${post.link
                    ? `<a href="${post.link}" target="_blank" class="btn btn-primary" style="margin-top:1rem; display:inline-block; font-size:0.85rem; padding:8px 18px;">Dabalata Dubbisaa →</a>`
                    : `<button onclick="showPostModal(${JSON.stringify(post).replace(/"/g, '&quot;')})" class="btn btn-primary" style="margin-top:1rem; font-size:0.85rem; padding:8px 18px; border:none; cursor:pointer;">Dabalata Dubbisaa →</button>`
                }
            </div>`;

        grid.appendChild(card);
    });
}

// ── Post detail modal ────────────────────────────────────────
function showPostModal(post) {
    // Remove existing modal if any
    const existing = document.getElementById('post-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'post-modal';
    modal.style.cssText = `
        position:fixed; inset:0; background:rgba(0,0,0,0.6);
        z-index:9000; display:flex; align-items:center; justify-content:center;
        padding:20px; animation:fadeInModal 0.25s ease;`;

    const imageHtml = post.image
        ? `<img src="${post.image}" alt="${post.title}" style="width:100%; max-height:300px; object-fit:cover; border-radius:8px; margin-bottom:1.5rem;">`
        : '';

    const categoryColors = {
        kompitara:   { bg: '#dbeafe', color: '#1d4ed8' },
        bilbila:     { bg: '#dcfce7', color: '#15803d' },
        teeknoloojii:{ bg: '#fce7f3', color: '#9d174d' },
        seenaa:      { bg: '#fef3c7', color: '#92400e' },
        ai:          { bg: '#ede9fe', color: '#6d28d9' }
    };
    const cat = categoryColors[post.category] || { bg: '#e0e7ff', color: '#3730a3' };
    const dateStr = new Date(post.date).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });

    modal.innerHTML = `
        <div style="background:white; border-radius:16px; max-width:700px; width:100%;
                    max-height:90vh; overflow-y:auto; padding:2rem; position:relative;
                    box-shadow:0 20px 60px rgba(0,0,0,0.3);">
            <button onclick="document.getElementById('post-modal').remove()"
                style="position:absolute; top:1rem; right:1rem; background:#f1f5f9;
                       border:none; width:36px; height:36px; border-radius:50%;
                       cursor:pointer; font-size:1.2rem; display:flex; align-items:center;
                       justify-content:center; transition:background 0.2s;"
                onmouseover="this.style.background='#e2e8f0'"
                onmouseout="this.style.background='#f1f5f9'">✕</button>
            ${imageHtml}
            <span style="background:${cat.bg}; color:${cat.color}; padding:3px 12px;
                         border-radius:20px; font-size:0.78rem; font-weight:700;
                         text-transform:uppercase; letter-spacing:0.3px;">${post.category}</span>
            <h2 style="margin:1rem 0 0.5rem; color:#0f172a; font-size:1.6rem; line-height:1.3;">${post.title}</h2>
            ${post.subtitle ? `<p style="color:#2563eb; font-weight:500; margin-bottom:1rem;">${post.subtitle}</p>` : ''}
            <div style="color:#64748b; font-size:0.85rem; margin-bottom:1.5rem; display:flex; gap:1rem;">
                <span>📅 ${dateStr}</span>
                <span style="color:#059669; font-weight:600;">by ClickICT</span>
            </div>
            <div style="color:#374151; line-height:1.8; font-size:1rem; white-space:pre-wrap;">${post.content}</div>
            ${post.link ? `<a href="${post.link}" target="_blank" class="btn btn-primary" style="margin-top:1.5rem; display:inline-block; text-decoration:none;">🔗 Dabalata Dubbisaa</a>` : ''}
        </div>`;

    // Close on backdrop click
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
}

// Add modal animation keyframe once
if (!document.getElementById('modal-style')) {
    const s = document.createElement('style');
    s.id = 'modal-style';
    s.textContent = `
        @keyframes fadeInModal { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        @keyframes tickerScroll { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
        @keyframes skeletonPulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    `;
    document.head.appendChild(s);
}

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .post-card, .content-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Load dynamic content
    loadDynamicContent();
    
    // Listen for content updates from admin panel
    window.addEventListener('contentUpdated', () => {
        loadDynamicContent();
    });
    
    // Also listen for storage changes (when admin updates content)
    window.addEventListener('storage', (e) => {
        if (e.key === 'website_content') {
            loadDynamicContent();
        }
    });
});
// Form validation and submission
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            alert('Maaloo galmee hunda guutaa!');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Email sirrii ta\'e galchaa!');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Ergamaa jira...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Ergaan keessan milkaa\'inaan ergameera! Deebii gaafannee siif kennina.');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Search functionality (if search box exists)
const searchBox = document.querySelector('#search-box');
if (searchBox) {
    searchBox.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const searchResults = document.querySelector('#search-results');
        
        if (searchTerm.length > 2) {
            // Simulate search results
            searchResults.innerHTML = `
                <div class="search-result">
                    <h4>Barbaada: "${searchTerm}"</h4>
                    <p>Bu'aa barbaacha...</p>
                </div>
            `;
            searchResults.style.display = 'block';
        } else {
            searchResults.style.display = 'none';
        }
    });
}

// Language switching is handled by language-switcher.js

// Dark mode toggle (if implemented)
const darkModeToggle = document.querySelector('#dark-mode-toggle');
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
    
    // Load saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}


// Live Clock - 12 Hour Format with AM/PM
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Determine AM or PM
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // If 0, make it 12
    
    // Add leading zeros
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');
    
    // Update clock display
    const clockTime = document.getElementById('clock-time');
    const clockPeriod = document.getElementById('clock-period');
    
    if (clockTime && clockPeriod) {
        clockTime.textContent = `${hoursStr}:${minutesStr}:${secondsStr}`;
        clockPeriod.textContent = period;
    }
}

// Initialize clock
document.addEventListener('DOMContentLoaded', () => {
    // Update clock immediately
    updateClock();
    
    // Update clock every second
    setInterval(updateClock, 1000);
});


// Reading Mode Functionality
function initReadingMode() {
    // Create reading mode toggle button
    const readingModeBtn = document.createElement('button');
    readingModeBtn.className = 'reading-mode-toggle';
    readingModeBtn.innerHTML = '<span>📖</span><span>Reading Mode</span>';
    readingModeBtn.setAttribute('aria-label', 'Toggle Reading Mode');
    document.body.appendChild(readingModeBtn);
    
    // Check if reading mode was previously enabled
    const isReadingMode = localStorage.getItem('readingMode') === 'true';
    if (isReadingMode) {
        document.body.classList.add('reading-mode');
        readingModeBtn.innerHTML = '<span>📱</span><span>Normal Mode</span>';
    }
    
    // Toggle reading mode on click
    readingModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('reading-mode');
        const isEnabled = document.body.classList.contains('reading-mode');
        
        if (isEnabled) {
            readingModeBtn.innerHTML = '<span>📱</span><span>Normal Mode</span>';
            localStorage.setItem('readingMode', 'true');
        } else {
            readingModeBtn.innerHTML = '<span>📖</span><span>Reading Mode</span>';
            localStorage.setItem('readingMode', 'false');
        }
    });
}

// Initialize reading mode when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReadingMode);
} else {
    initReadingMode();
}
