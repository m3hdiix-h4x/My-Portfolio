

class WebsiteInteractivity {
  constructor() {
    this.state = {
      isDark: false,
      navOpen: false,
      typingActive: true
    };
    
    this.timers = new Set();
    this.observers = new Map();
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.setupNavigation();
    this.setupTheme();
    this.setupForm();
    this.setupCodeModals();
    this.setupScrollEffects();
    this.setupParallax();
    this.setupYear();
    this.setupAccessibility();
  }

 
  setupNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !nav) return;

 
    navToggle.addEventListener('click', this.debounce(() => {
      this.toggleNavigation();
    }, 100));

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        
        this.closeNavigation();
        
        if (href?.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            this.smoothScrollTo(target, 1000);
            this.highlightActiveSection(href);
          }
        }
      });
    });

 
    this.setupTypingAnimation();

    document.addEventListener('click', (e) => {
      if (this.state.navOpen && 
          !nav.contains(e.target) && 
          !navToggle.contains(e.target)) {
        this.closeNavigation();
      }
    }, { passive: true });

    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.navOpen) {
        this.closeNavigation();
        navToggle.focus();
      }
    });
  }

  setupTypingAnimation() {
    const textElement = document.getElementById('animated-text');
    if (!textElement) return;

    const phrases = [
      "Hi, I'm Mehdi",
      "Computer Science Student",
      "Innovator",
      "Problem Solver",
      "Tech Enthusiast"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isErasing = false;

    const type = () => {
      if (!this.state.typingActive) return;

      const currentPhrase = phrases[phraseIndex];
      const cursor = '<span class="cursor">|</span>';

      if (!isErasing && charIndex <= currentPhrase.length) {
        textElement.innerHTML = currentPhrase.substring(0, charIndex) + cursor;
        charIndex++;
        this.setTimer(type, 100);
      } else if (isErasing && charIndex >= 0) {
        textElement.innerHTML = currentPhrase.substring(0, charIndex) + cursor;
        charIndex--;
        this.setTimer(type, 50);
      } else {
        isErasing = !isErasing;
        if (!isErasing) {
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
        this.setTimer(type, 1500);
      }
    };

    type();
  }

  toggleNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    
    this.state.navOpen = !this.state.navOpen;
    nav?.classList.toggle('open', this.state.navOpen);
    navToggle?.classList.toggle('open', this.state.navOpen);
    document.body.style.overflow = this.state.navOpen ? 'hidden' : '';
    
 
    navToggle?.setAttribute('aria-expanded', this.state.navOpen);
  }

  closeNavigation() {
    if (!this.state.navOpen) return;
    
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    
    this.state.navOpen = false;
    nav?.classList.remove('open');
    navToggle?.classList.remove('open');
    document.body.style.overflow = '';
    navToggle?.setAttribute('aria-expanded', 'false');
  }

  smoothScrollTo(element, duration = 1000) {
    const start = window.pageYOffset;
    const target = element.getBoundingClientRect().top + start - 80;
    const distance = target - start;
    let startTime = null;

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
  
      const easeInOutCubic = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      window.scrollTo(0, start + distance * easeInOutCubic);
      
      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }

  highlightActiveSection(hash) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === hash);
    });
  }

  setupTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const stored = localStorage.getItem('prefersDark');
    this.state.isDark = stored !== null ? stored === '1' : prefersDark;

    const themes = {
      dark: {
        '--bg': '#000000',
        '--card': '#0a0a0a',
        '--text': '#ffffff',
        '--muted': '#94a3b8',
        '--accent': '#6ee7b7',
        '--gradient': 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)'
      },
      light: {
        '--bg': '#f6f8fb',
        '--card': '#ffffff',
        '--text': '#071433',
        '--muted': '#455a6b',
        '--accent': '#0ea5a0',
        '--gradient': 'linear-gradient(180deg, #f6f8fb 0%, #eef3f8 100%)'
      }
    };

    const applyTheme = (animated = false) => {
      const theme = this.state.isDark ? themes.dark : themes.light;
      const root = document.documentElement;
      
      if (animated) {
        root.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
      
      Object.entries(theme).forEach(([key, value]) => {
        if (key === '--gradient') {
          document.body.style.background = value;
        } else {
          root.style.setProperty(key, value);
        }
      });

      themeToggle.innerHTML = this.state.isDark 
        ? '☀️ <span>Light</span>' 
        : '🌙 <span>Dark</span>';
      themeToggle.setAttribute('aria-label', 
        `Switch to ${this.state.isDark ? 'light' : 'dark'} theme`);
      
      if (animated) {
        setTimeout(() => root.style.transition = '', 300);
      }
    };

    themeToggle.addEventListener('click', () => {
      this.state.isDark = !this.state.isDark;
      applyTheme(true);
      localStorage.setItem('prefersDark', this.state.isDark ? '1' : '0');
      
  
      themeToggle.style.transform = 'rotate(360deg) scale(0.9)';
      setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg) scale(1)';
      }, 300);
    });

  
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem('prefersDark')) {
          this.state.isDark = e.matches;
          applyTheme(true);
        }
      });

    applyTheme(false);
  }

 
  setupForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleFormSubmit(form);
    });

   
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', this.debounce(() => {
        this.validateField(input, true);
      }, 500));
    });
  }

  async handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = {
      name: formData.get('name')?.toString().trim(),
      email: formData.get('email')?.toString().trim(),
      message: formData.get('message')?.toString().trim()
    };


    if (!data.name || !data.email || !data.message) {
      this.showStatus('Please fill in all fields.', 'error');
      return;
    }

    if (!this.isValidEmail(data.email)) {
      this.showStatus('Please enter a valid email address.', 'error');
      return;
    }

    this.showStatus('Sending your message...', 'loading');
    this.setFormLoading(true);
    
    try {
   
      await this.delay(1500);
      

      this.showStatus('✓ Message sent successfully!', 'success');
      form.reset();
      
    
      this.createConfetti();
      
    } catch (error) {
      this.showStatus('✗ Failed to send. Please try again.', 'error');
    } finally {
      this.setFormLoading(false);
    }
  }

  validateField(field, silent = false) {
    const value = field.value.trim();
    const name = field.getAttribute('name');
    let isValid = true;

    if (!value) {
      isValid = false;
    } else if (name === 'email' && !this.isValidEmail(value)) {
      isValid = false;
    }

    field.style.borderColor = isValid ? '' : '#ef4444';
    field.setAttribute('aria-invalid', !isValid);

    return isValid;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  setFormLoading(loading) {
    const btn = document.querySelector('#contact-form button[type="submit"]');
    if (btn) {
      btn.disabled = loading;
      btn.innerHTML = loading 
        ? '<span class="spinner"></span> Sending...' 
        : 'Send Message';
    }
  }

  showStatus(message, type) {
    const status = document.getElementById('form-status');
    if (status) {
      status.textContent = message;
      status.className = `form-status ${type}`;
      status.style.opacity = '1';
      
      if (type === 'success' || type === 'error') {
        this.setTimer(() => {
          status.style.opacity = '0';
        }, 5000);
      }
    }
  }


  setupScrollEffects() {
    const sections = document.querySelectorAll('section[id]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.highlightActiveSection(`#${entry.target.id}`);
        }
      });
    }, { threshold: 0.2 });

    sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'opacity 0.6s, transform 0.6s';
      observer.observe(section);
    });

    this.observers.set('sections', observer);
  }

  setupParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length === 0) return;

    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  
  setupCodeModals() {
    const buttons = document.querySelectorAll('.view-code');
    const modals = document.querySelectorAll('.code-modal');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const projectId = btn.dataset.project;
        this.openModal(projectId);
      });
    });

    modals.forEach(modal => {
      const close = modal.querySelector('.close-modal');
      
      close?.addEventListener('click', () => this.closeModal(modal));
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal(modal);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.code-modal.active');
        if (activeModal) this.closeModal(activeModal);
      }
    });
  }

  openModal(projectId) {
    const modal = document.getElementById(`code-${projectId}`);
    if (!modal) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.setAttribute('aria-hidden', 'false');
    

    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusable[0]?.focus();
  }

  closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    modal.setAttribute('aria-hidden', 'true');
  }

  setupYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear().toString();
    }
  }

  setupAccessibility() {

    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.prepend(skipLink);


    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    }
  }

  createConfetti() {
    const colors = ['#6ee7b7', '#0ea5a0', '#fbbf24', '#f87171', '#a78bfa'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        opacity: 0;
        animation: confetti-fall ${2 + Math.random() * 2}s ease-out forwards;
        pointer-events: none;
        z-index: 10000;
      `;
      document.body.appendChild(confetti);
      
      this.setTimer(() => confetti.remove(), 4000);
    }
  }

  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setTimer(callback, delay) {
    const timer = setTimeout(callback, delay);
    this.timers.add(timer);
    return timer;
  }

  destroy() {
  
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    
    this.state.typingActive = false;
  }
}


const style = document.createElement('style');
style.textContent = `
  @keyframes confetti-fall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--accent);
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
  }
  
  .skip-link:focus {
    top: 0;
  }
  
  section.visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  
  .cursor {
    animation: blink 1s step-end infinite;
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;
document.head.appendChild(style);


try {
  const website = new WebsiteInteractivity();

  window.addEventListener('beforeunload', () => website.destroy());
} catch (error) {
  console.error('Failed to initialize website:', error);
}