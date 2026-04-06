// Accessibility Features for SmartHotel

class AccessibilityPanel {
    constructor() {
        this.settings = {
            fontSize: 100,
            lineHeight: 150,
            letterSpacing: 0,
            cursorSize: 100,
            highContrast: false,
            textToSpeech: false,
            screenReader: false,
            dyslexiaFont: false,
            hideImages: false,
            readingGuide: false,
            linkHighlight: false,
            stopAnimations: false
        };
        this.init();
    }

    init() {
        this.loadSettings();
        this.createAccessibilityButton();
        this.createAccessibilityPanel();
        this.applySettings();
        this.initTextToSpeech();
        this.initKeyboardNavigation();
    }

    createAccessibilityButton() {
        const button = document.createElement('button');
        button.id = 'accessibilityBtn';
        button.className = 'accessibility-btn';
        button.setAttribute('aria-label', 'Open Accessibility Menu');
        button.innerHTML = `
            <span class="accessibility-icon">♿</span>
        `;
        document.body.appendChild(button);

        button.addEventListener('click', () => this.togglePanel());
    }

    createAccessibilityPanel() {
        const panel = document.createElement('div');
        panel.id = 'accessibilityPanel';
        panel.className = 'accessibility-panel';
        panel.innerHTML = `
            <div class="accessibility-panel-header">
                <h3>Accessibility Options</h3>
                <button class="close-panel-btn" id="closeAccessibilityPanel">✕</button>
            </div>
            
            <div class="accessibility-panel-content">
                <!-- Text Size -->
                <div class="accessibility-option">
                    <label>
                        <span class="option-icon">🔤</span>
                        <span>Text Size</span>
                    </label>
                    <div class="slider-controls">
                        <button class="control-btn" onclick="accessibilityPanel.decreaseFontSize()">-</button>
                        <span id="fontSizeValue">100%</span>
                        <button class="control-btn" onclick="accessibilityPanel.increaseFontSize()">+</button>
                    </div>
                </div>

                <!-- Line Height -->
                <div class="accessibility-option">
                    <label>
                        <span class="option-icon">📏</span>
                        <span>Line Height</span>
                    </label>
                    <div class="slider-controls">
                        <button class="control-btn" onclick="accessibilityPanel.decreaseLineHeight()">-</button>
                        <span id="lineHeightValue">150%</span>
                        <button class="control-btn" onclick="accessibilityPanel.increaseLineHeight()">+</button>
                    </div>
                </div>

                <!-- Letter Spacing -->
                <div class="accessibility-option">
                    <label>
                        <span class="option-icon">📝</span>
                        <span>Letter Spacing</span>
                    </label>
                    <div class="slider-controls">
                        <button class="control-btn" onclick="accessibilityPanel.decreaseLetterSpacing()">-</button>
                        <span id="letterSpacingValue">0px</span>
                        <button class="control-btn" onclick="accessibilityPanel.increaseLetterSpacing()">+</button>
                    </div>
                </div>

                <!-- Cursor Size -->
                <div class="accessibility-option">
                    <label>
                        <span class="option-icon">👆</span>
                        <span>Cursor Size</span>
                    </label>
                    <div class="slider-controls">
                        <button class="control-btn" onclick="accessibilityPanel.decreaseCursorSize()">-</button>
                        <span id="cursorSizeValue">100%</span>
                        <button class="control-btn" onclick="accessibilityPanel.increaseCursorSize()">+</button>
                    </div>
                </div>

                <!-- High Contrast -->
                <div class="accessibility-option">
                    <label>
                        <span class="option-icon">🎨</span>
                        <span>High Contrast</span>
                    </label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="highContrastToggle" onchange="accessibilityPanel.toggleHighContrast()">
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <!-- Dyslexia Friendly Font -->
                <div class="accessibility-option">
                    <label>
                        <span class="option-icon">📖</span>
                        <span>Dyslexia Font</span>
                    </label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="dyslexiaFontToggle" onchange="accessibilityPanel.toggleDyslexiaFont()">
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <!-- Hide Images -->
                <div class="accessibility-option">
                    <label>
                        <span class="option-icon">🖼️</span>
                        <span>Hide Images</span>
                    </label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="hideImagesToggle" onchange="accessibilityPanel.toggleHideImages()">
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <!-- Reading Guide -->
                <div class="accessibility-option">
                    <label>
                        <span class="option-icon">📍</span>
                        <span>Reading Guide</span>
                    </label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="readingGuideToggle" onchange="accessibilityPanel.toggleReadingGuide()">
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <!-- Link Highlight -->
                <div class="accessibility-option">
                    <label>
                        <span class="option-icon">🔗</span>
                        <span>Highlight Links</span>
                    </label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="linkHighlightToggle" onchange="accessibilityPanel.toggleLinkHighlight()">
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <!-- Stop Animations -->
                <div class="accessibility-option">
                    <label>
                        <span class="option-icon">⏸️</span>
                        <span>Stop Animations</span>
                    </label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="stopAnimationsToggle" onchange="accessibilityPanel.toggleStopAnimations()">
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <!-- Text to Speech -->
                <div class="accessibility-option">
                    <label>
                        <span class="option-icon">🔊</span>
                        <span>Text to Speech</span>
                    </label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="textToSpeechToggle" onchange="accessibilityPanel.toggleTextToSpeech()">
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <!-- Screen Reader Mode -->
                <div class="accessibility-option">
                    <label>
                        <span class="option-icon">📢</span>
                        <span>Screen Reader Mode</span>
                    </label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="screenReaderToggle" onchange="accessibilityPanel.toggleScreenReader()">
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <!-- Reset Button -->
                <div class="accessibility-option">
                    <button class="reset-btn" onclick="accessibilityPanel.resetSettings()">
                        <span>🔄 Reset All Settings</span>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('closeAccessibilityPanel').addEventListener('click', () => this.togglePanel());
    }

    togglePanel() {
        const panel = document.getElementById('accessibilityPanel');
        panel.classList.toggle('active');
    }

    // Font Size Controls
    increaseFontSize() {
        this.settings.fontSize = Math.min(this.settings.fontSize + 10, 200);
        this.applySettings();
    }

    decreaseFontSize() {
        this.settings.fontSize = Math.max(this.settings.fontSize - 10, 80);
        this.applySettings();
    }

    // Line Height Controls
    increaseLineHeight() {
        this.settings.lineHeight = Math.min(this.settings.lineHeight + 10, 250);
        this.applySettings();
    }

    decreaseLineHeight() {
        this.settings.lineHeight = Math.max(this.settings.lineHeight - 10, 120);
        this.applySettings();
    }

    // Letter Spacing Controls
    increaseLetterSpacing() {
        this.settings.letterSpacing = Math.min(this.settings.letterSpacing + 1, 10);
        this.applySettings();
    }

    decreaseLetterSpacing() {
        this.settings.letterSpacing = Math.max(this.settings.letterSpacing - 1, 0);
        this.applySettings();
    }

    // Cursor Size Controls
    increaseCursorSize() {
        this.settings.cursorSize = Math.min(this.settings.cursorSize + 20, 200);
        this.applySettings();
    }

    decreaseCursorSize() {
        this.settings.cursorSize = Math.max(this.settings.cursorSize - 20, 100);
        this.applySettings();
    }

    // Toggle Features
    toggleHighContrast() {
        this.settings.highContrast = !this.settings.highContrast;
        this.applySettings();
    }

    toggleDyslexiaFont() {
        this.settings.dyslexiaFont = !this.settings.dyslexiaFont;
        this.applySettings();
    }

    toggleHideImages() {
        this.settings.hideImages = !this.settings.hideImages;
        this.applySettings();
    }

    toggleReadingGuide() {
        this.settings.readingGuide = !this.settings.readingGuide;
        if (this.settings.readingGuide) {
            this.createReadingGuide();
        } else {
            this.removeReadingGuide();
        }
        this.applySettings();
    }

    toggleLinkHighlight() {
        this.settings.linkHighlight = !this.settings.linkHighlight;
        this.applySettings();
    }

    toggleStopAnimations() {
        this.settings.stopAnimations = !this.settings.stopAnimations;
        this.applySettings();
    }

    toggleTextToSpeech() {
        this.settings.textToSpeech = !this.settings.textToSpeech;
        if (this.settings.textToSpeech) {
            this.enableTextToSpeech();
        } else {
            this.disableTextToSpeech();
        }
        this.applySettings();
    }

    toggleScreenReader() {
        this.settings.screenReader = !this.settings.screenReader;
        this.applySettings();
    }

    applySettings() {
        const root = document.documentElement;

        // Font Size
        root.style.fontSize = `${this.settings.fontSize}%`;
        document.getElementById('fontSizeValue').textContent = `${this.settings.fontSize}%`;

        // Line Height
        document.body.style.lineHeight = `${this.settings.lineHeight / 100}`;
        document.getElementById('lineHeightValue').textContent = `${this.settings.lineHeight}%`;

        // Letter Spacing
        document.body.style.letterSpacing = `${this.settings.letterSpacing}px`;
        document.getElementById('letterSpacingValue').textContent = `${this.settings.letterSpacing}px`;

        // Cursor Size
        document.body.style.cursor = this.settings.cursorSize > 100 ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'%3E%3Cpath d=\'M0 0 L0 24 L8 16 L14 28 L18 26 L12 14 L24 14 Z\' fill=\'%23000\' stroke=\'%23fff\' stroke-width=\'2\'/%3E%3C/svg%3E") 0 0, auto' : 'auto';
        document.getElementById('cursorSizeValue').textContent = `${this.settings.cursorSize}%`;

        // High Contrast
        if (this.settings.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        document.getElementById('highContrastToggle').checked = this.settings.highContrast;

        // Dyslexia Font
        if (this.settings.dyslexiaFont) {
            document.body.classList.add('dyslexia-font');
        } else {
            document.body.classList.remove('dyslexia-font');
        }
        document.getElementById('dyslexiaFontToggle').checked = this.settings.dyslexiaFont;

        // Hide Images
        if (this.settings.hideImages) {
            document.body.classList.add('hide-images');
        } else {
            document.body.classList.remove('hide-images');
        }
        document.getElementById('hideImagesToggle').checked = this.settings.hideImages;

        // Link Highlight
        if (this.settings.linkHighlight) {
            document.body.classList.add('highlight-links');
        } else {
            document.body.classList.remove('highlight-links');
        }
        document.getElementById('linkHighlightToggle').checked = this.settings.linkHighlight;

        // Stop Animations
        if (this.settings.stopAnimations) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }
        document.getElementById('stopAnimationsToggle').checked = this.settings.stopAnimations;

        // Screen Reader Mode
        if (this.settings.screenReader) {
            document.body.classList.add('screen-reader-mode');
        } else {
            document.body.classList.remove('screen-reader-mode');
        }
        document.getElementById('screenReaderToggle').checked = this.settings.screenReader;

        // Save settings
        this.saveSettings();
    }

    createReadingGuide() {
        const guide = document.createElement('div');
        guide.id = 'readingGuide';
        guide.className = 'reading-guide';
        document.body.appendChild(guide);

        document.addEventListener('mousemove', this.updateReadingGuide);
    }

    removeReadingGuide() {
        const guide = document.getElementById('readingGuide');
        if (guide) {
            guide.remove();
        }
        document.removeEventListener('mousemove', this.updateReadingGuide);
    }

    updateReadingGuide(e) {
        const guide = document.getElementById('readingGuide');
        if (guide) {
            guide.style.top = `${e.clientY}px`;
        }
    }

    initTextToSpeech() {
        if ('speechSynthesis' in window) {
            this.speech = window.speechSynthesis;
        }
    }

    enableTextToSpeech() {
        document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, li').forEach(element => {
            element.addEventListener('click', this.speakText);
            element.style.cursor = 'pointer';
            element.setAttribute('data-tts-enabled', 'true');
        });
    }

    disableTextToSpeech() {
        document.querySelectorAll('[data-tts-enabled]').forEach(element => {
            element.removeEventListener('click', this.speakText);
            element.removeAttribute('data-tts-enabled');
        });
        if (this.speech) {
            this.speech.cancel();
        }
    }

    speakText(event) {
        if (window.accessibilityPanel && window.accessibilityPanel.speech) {
            window.accessibilityPanel.speech.cancel();
            const text = event.target.textContent || event.target.innerText;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            window.accessibilityPanel.speech.speak(utterance);
        }
    }

    initKeyboardNavigation() {
        // Add visible focus indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Alt + A to open accessibility panel
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                this.togglePanel();
            }
        });
    }

    saveSettings() {
        localStorage.setItem('accessibilitySettings', JSON.stringify(this.settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('accessibilitySettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }

    resetSettings() {
        this.settings = {
            fontSize: 100,
            lineHeight: 150,
            letterSpacing: 0,
            cursorSize: 100,
            highContrast: false,
            textToSpeech: false,
            screenReader: false,
            dyslexiaFont: false,
            hideImages: false,
            readingGuide: false,
            linkHighlight: false,
            stopAnimations: false
        };
        this.removeReadingGuide();
        this.disableTextToSpeech();
        this.applySettings();
        alert('Accessibility settings have been reset to default.');
    }
}

// Initialize accessibility panel
let accessibilityPanel;
document.addEventListener('DOMContentLoaded', () => {
    accessibilityPanel = new AccessibilityPanel();
    window.accessibilityPanel = accessibilityPanel; // Make it globally accessible
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityPanel;
}