// Theme Switcher for SmartHotel (Dark/Light Mode)

class ThemeSwitcher {
    constructor() {
        this.currentTheme = this.getTheme();
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createThemeToggle();
    }

    getTheme() {
        // Check localStorage first, then system preference, default to dark
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    }

    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme(theme);
        
        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        if (theme === 'light') {
            document.body.style.setProperty('--bg-primary', '#ffffff');
            document.body.style.setProperty('--bg-secondary', '#f5f5f5');
            document.body.style.setProperty('--text-primary', '#0a0a0a');
            document.body.style.setProperty('--text-secondary', '#666666');
            document.body.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.1)');
        } else {
            document.body.style.setProperty('--bg-primary', '#0a0a0a');
            document.body.style.setProperty('--bg-secondary', '#0f0f0f');
            document.body.style.setProperty('--text-primary', '#ffffff');
            document.body.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.7)');
            document.body.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)');
        }

        this.updateToggleButton();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    createThemeToggle() {
        // Create theme toggle button in navbar
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            const themeToggle = document.createElement('li');
            themeToggle.innerHTML = `
                <button id="themeToggle" class="theme-toggle-btn" title="Toggle Dark/Light Mode">
                    <span class="theme-icon">${this.currentTheme === 'dark' ? '☀️' : '🌙'}</span>
                </button>
            `;
            navLinks.appendChild(themeToggle);

            document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        }
    }

    updateToggleButton() {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        }
    }
}

// Initialize theme switcher
let themeSwitcher;
document.addEventListener('DOMContentLoaded', () => {
    themeSwitcher = new ThemeSwitcher();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeSwitcher;
}