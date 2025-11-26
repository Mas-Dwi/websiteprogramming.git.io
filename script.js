// ===== GLOBAL VARIABLES =====
let userProgress = JSON.parse(localStorage.getItem('pastijagoProgress')) || {
    level1: 0,
    level2: 0,
    level3: 0
};

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== INITIALIZATION FUNCTION =====
function initializeApp() {
    try {
        // Initialize all components
        initNavigation();
        initAnimations();
        initTypingEffect();
        initProgressSystem();
        initThemeSystem();
        initScrollEffects();
        
        // Welcome message
        showWelcomeMessage();
        
        // Set body visible after initialization
        document.body.style.opacity = '1';
        
        console.log('🚀 Pasti Jago initialized successfully!');
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// ===== NAVIGATION SYSTEM =====
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Handle internal links with smooth scroll
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    // Close mobile menu if open
                    if (navMenu && navMenu.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                    
                    // Smooth scroll to section
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            // External links and page navigation will follow normal behavior
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active') && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('.hamburger')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            // Navbar background on scroll
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll direction
            if (window.scrollY > lastScrollY && window.scrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = window.scrollY;
            
            // Parallax effect for hero section
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-content h1');
    
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        // Add cursor element
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '|';
        heroTitle.appendChild(cursor);
        
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80, cursor);
        }, 1000);
    }
}

function typeWriter(element, text, speed = 100, cursor) {
    let i = 0;
    const textNode = document.createTextNode('');
    element.insertBefore(textNode, cursor);
    
    function type() {
        if (i < text.length) {
            textNode.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
            
            // Blink cursor while typing
            if (cursor) {
                cursor.style.animation = 'blink 0.7s infinite';
            }
        } else {
            // Remove cursor when finished
            if (cursor) {
                setTimeout(() => {
                    cursor.remove();
                }, 500);
            }
        }
    }
    type();
}

// ===== ANIMATIONS SYSTEM =====
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.95)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease';
        observer.observe(card);
    });

    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-content');
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // Observe other elements
    const animatedElements = document.querySelectorAll('.btn, .code-editor');
    animatedElements.forEach(el => {
        el.style.transition = 'all 0.3s ease';
    });
}

// ===== PROGRESS SYSTEM =====
function initProgressSystem() {
    updateProgressUI();
    
    // Auto-save progress every 30 seconds
    setInterval(() => {
        localStorage.setItem('pastijagoProgress', JSON.stringify(userProgress));
    }, 30000);
}

function updateProgress(level, progress) {
    try {
        // Validate input
        if (!['level1', 'level2', 'level3'].includes(level)) {
            throw new Error('Invalid level specified');
        }
        
        if (progress < 0 || progress > 100) {
            throw new Error('Progress must be between 0 and 100');
        }
        
        userProgress[level] = Math.min(100, Math.max(0, progress));
        localStorage.setItem('pastijagoProgress', JSON.stringify(userProgress));
        updateProgressUI();
        
        // Show achievement if progress reaches 100%
        if (progress === 100) {
            showAchievement(`Selamat! Anda menyelesaikan ${level}! 🎉`);
        }
        
        return true;
    } catch (error) {
        console.error('Error updating progress:', error);
        return false;
    }
}

function updateProgressUI() {
    const progressBars = document.querySelectorAll('.progress-bar');
    const progressTexts = document.querySelectorAll('.progress-text');
    
    progressBars.forEach(bar => {
        const level = bar.dataset.level;
        const progress = userProgress[level] || 0;
        bar.style.width = progress + '%';
    });
    
    progressTexts.forEach(text => {
        const level = text.dataset.level;
        const progress = userProgress[level] || 0;
        text.textContent = `${progress}% selesai`;
    });
}

// ===== THEME SYSTEM =====
function initThemeSystem() {
    const savedTheme = localStorage.getItem('pastijagoTheme') || 'light';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Use saved theme, or system preference if no saved theme
    const theme = savedTheme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : savedTheme;
    
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    // Update theme toggle button if exists
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    const theme = isDark ? 'dark' : 'light';
    
    localStorage.setItem('pastijagoTheme', theme);
    
    // Update toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = isDark ? '☀️' : '🌙';
    }
    
    // Show theme change notification
    showNotification(`Theme changed to ${theme} mode`);
}

// ===== BUTTON FUNCTIONS =====
function mulaiBelajar() {
    showLoading('Mempersiapkan materi belajar...');
    
    setTimeout(() => {
        hideLoading();
        window.location.href = 'pages/belajar.html';
    }, 1500);
}

function lihatMateri() {
    window.location.href = 'pages/belajar.html';
}

function runCode() {
    const code = `// Welcome to Pasti Jago!
function belajarProgramming() {
    console.log("🎉 Selamat datang!");
    return "Kamu pasti jago!";
}

// Jalankan function
const hasil = belajarProgramming();
console.log(hasil);`;

    try {
        // Show execution in console
        console.log('🧪 Menjalankan code demo...');
        
        // Create and execute function
        const result = new Function(code)();
        
        // Show success message
        showNotification('✅ Code berhasil dijalankan! Lihat console untuk hasilnya.', 'success');
        
        return result;
    } catch (error) {
        console.error('Error executing code:', error);
        showNotification('❌ Error dalam code: ' + error.message, 'error');
        return null;
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--lighter);
                color: var(--dark);
                padding: 1rem 1.5rem;
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-xl);
                border-left: 4px solid var(--primary);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            }
            .notification-success { border-left-color: var(--success); }
            .notification-error { border-left-color: var(--error); }
            .notification-warning { border-left-color: var(--warning); }
            .notification-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function showAchievement(message) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement';
    achievement.innerHTML = `
        <div class="achievement-content">
            <span class="achievement-icon">🏆</span>
            <div class="achievement-text">
                <strong>Achievement Unlocked!</strong>
                <span>${message}</span>
            </div>
        </div>
    `;
    
    // Add achievement styles
    if (!document.querySelector('#achievement-styles')) {
        const styles = document.createElement('style');
        styles.id = 'achievement-styles';
        styles.textContent = `
            .achievement {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                background: var(--gradient-primary);
                color: white;
                padding: 2rem;
                border-radius: var(--radius-xl);
                box-shadow: var(--shadow-2xl);
                z-index: 10000;
                animation: achievementPop 0.5s ease forwards;
            }
            .achievement-content {
                display: flex;
                align-items: center;
                gap: 1rem;
                text-align: center;
            }
            .achievement-icon { font-size: 2rem; }
            .achievement-text { display: flex; flex-direction: column; }
            @keyframes achievementPop {
                0% { transform: translate(-50%, -50%) scale(0); }
                70% { transform: translate(-50%, -50%) scale(1.1); }
                100% { transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(achievement);
    
    setTimeout(() => {
        achievement.remove();
    }, 3000);
}

function showLoading(message = 'Loading...') {
    const loading = document.createElement('div');
    loading.className = 'loading-overlay';
    loading.innerHTML = `
        <div class="loading-spinner"></div>
        <p>${message}</p>
    `;
    
    // Add loading styles
    if (!document.querySelector('#loading-styles')) {
        const styles = document.createElement('style');
        styles.id = 'loading-styles';
        styles.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                color: white;
            }
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid transparent;
                border-top: 3px solid var(--primary);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 1rem;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(loading);
    document.body.style.overflow = 'hidden';
}

function hideLoading() {
    const loading = document.querySelector('.loading-overlay');
    if (loading) {
        loading.remove();
    }
    document.body.style.overflow = '';
}

// ===== UTILITY FUNCTIONS =====
function showWelcomeMessage() {
    console.log(`
    🌈 Welcome to Pasti Jago!
    🚀 Belajar programming jadi lebih mudah!
    📚 Mari mulai perjalanan coding-mu!
    
    "Setiap expert pernah menjadi pemula.
     Yang membedakan adalah konsistensi."
    `);
    
    // Show welcome notification after a delay
    setTimeout(() => {
        showNotification('Selamat datang di Pasti Jago! 🎉', 'success');
    }, 2000);
}

function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Nama harus minimal 2 karakter');
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push('Email harus valid');
    }
    
    if (formData.password && formData.password.length < 6) {
        errors.push('Password harus minimal 6 karakter');
    }
    
    return errors;
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
window.mulaiBelajar = mulaiBelajar;
window.lihatMateri = lihatMateri;
window.runCode = runCode;
window.toggleTheme = toggleTheme;
window.updateProgress = updateProgress;
window.validateForm = validateForm;
window.showNotification = showNotification;