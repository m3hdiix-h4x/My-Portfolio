// Floating Chatbot Widget for SmartHotel

class FloatingChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createWidget();
        this.attachEventListeners();
        this.loadChatHistory();
    }

    createWidget() {
        // Create chatbot button
        const chatbotButton = document.createElement('div');
        chatbotButton.id = 'floatingChatbotBtn';
        chatbotButton.innerHTML = `
            <div class="chatbot-btn-icon">🤖</div>
            <span class="chatbot-btn-badge">1</span>
        `;
        document.body.appendChild(chatbotButton);

        // Create chatbot window
        const chatbotWindow = document.createElement('div');
        chatbotWindow.id = 'floatingChatbotWindow';
        chatbotWindow.className = 'chatbot-window';
        chatbotWindow.innerHTML = `
            <div class="chatbot-window-header">
                <div class="chatbot-window-title">
                    <div class="chatbot-avatar-small">🤖</div>
                    <div>
                        <h4 data-translate="chatbotTitle">SmartHotel AI Assistant</h4>
                        <p class="chatbot-status-small" data-translate="chatbotStatus">Online - Available 24/7</p>
                    </div>
                </div>
                <div class="chatbot-window-actions">
                    <button class="chatbot-minimize-btn" id="minimizeChatbot">−</button>
                    <button class="chatbot-close-btn" id="closeChatbot">✕</button>
                </div>
            </div>
            <div class="chatbot-window-messages" id="floatingChatMessages">
                <div class="chatbot-welcome-message">
                    <div class="message-avatar-small">🤖</div>
                    <div class="message-content-small">
                        <p data-translate="chatbotWelcome">Hello! 👋 Welcome to SmartHotel. I'm your AI assistant, here to help you 24/7.</p>
                    </div>
                </div>
            </div>
            <div class="chatbot-quick-actions-small">
                <button class="quick-action-btn" onclick="window.floatingChatbot.sendQuickMessage('Check room availability')">
                    🏨 Availability
                </button>
                <button class="quick-action-btn" onclick="window.floatingChatbot.sendQuickMessage('Tell me about services')">
                    ⭐ Services
                </button>
                <button class="quick-action-btn" onclick="window.floatingChatbot.sendQuickMessage('Local attractions')">
                    🗺️ Attractions
                </button>
            </div>
            <div class="chatbot-window-input">
                <input type="text" id="floatingChatInput" placeholder="Type your message..." data-translate-placeholder="chatbotPlaceholder">
                <button class="chatbot-send-btn" id="floatingSendBtn">
                    <span>📤</span>
                </button>
            </div>
        `;
        document.body.appendChild(chatbotWindow);
    }

    attachEventListeners() {
        const chatbotBtn = document.getElementById('floatingChatbotBtn');
        const closeChatbot = document.getElementById('closeChatbot');
        const minimizeChatbot = document.getElementById('minimizeChatbot');
        const sendBtn = document.getElementById('floatingSendBtn');
        const input = document.getElementById('floatingChatInput');

        chatbotBtn.addEventListener('click', () => this.toggleChatbot());
        closeChatbot.addEventListener('click', () => this.closeChatbot());
        minimizeChatbot.addEventListener('click', () => this.minimizeChatbot());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    toggleChatbot() {
        this.isOpen = !this.isOpen;
        const chatbotWindow = document.getElementById('floatingChatbotWindow');
        const chatbotBtn = document.getElementById('floatingChatbotBtn');

        if (this.isOpen) {
            chatbotWindow.classList.add('active');
            chatbotBtn.classList.add('active');
            this.removeBadge();
            this.scrollToBottom();
        } else {
            chatbotWindow.classList.remove('active');
            chatbotBtn.classList.remove('active');
        }
    }

    closeChatbot() {
        this.isOpen = false;
        const chatbotWindow = document.getElementById('floatingChatbotWindow');
        const chatbotBtn = document.getElementById('floatingChatbotBtn');
        chatbotWindow.classList.remove('active');
        chatbotBtn.classList.remove('active');
    }

    minimizeChatbot() {
        this.closeChatbot();
    }

    removeBadge() {
        const badge = document.querySelector('.chatbot-btn-badge');
        if (badge) {
            badge.style.display = 'none';
        }
    }

    sendMessage() {
        const input = document.getElementById('floatingChatInput');
        const message = input.value.trim();

        if (message === '') return;

        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate bot response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.getBotResponse(message);
            this.addMessage(response, 'bot');
        }, 1000);
    }

    sendQuickMessage(message) {
        const input = document.getElementById('floatingChatInput');
        input.value = message;
        this.sendMessage();
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('floatingChatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message-small ${sender}-message-small`;

        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="message-content-small">
                    <p>${text}</p>
                </div>
                <div class="message-avatar-small">👤</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar-small">🤖</div>
                <div class="message-content-small">
                    <p>${text}</p>
                </div>
            `;
        }

        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        this.saveToHistory(text, sender);
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('floatingChatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message-small bot-message-small typing-indicator';
        typingDiv.id = 'typingIndicatorFloating';
        typingDiv.innerHTML = `
            <div class="message-avatar-small">🤖</div>
            <div class="message-content-small">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicatorFloating');
        if (indicator) {
            indicator.remove();
        }
    }

    getBotResponse(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('availability') || msg.includes('book') || msg.includes('reserve')) {
            return "I'd be happy to help you check room availability! We have several room types: Standard ($129/night), Executive ($199/night), Deluxe ($299/night), and Presidential Suite ($499/night). What dates are you interested in?";
        } else if (msg.includes('service') || msg.includes('amenities')) {
            return "SmartHotel offers: Fine Dining, Spa & Wellness, Infinity Pool, Fitness Center, Airport Transfer, Business Center, and more! Which service would you like to know about?";
        } else if (msg.includes('attraction') || msg.includes('local')) {
            return "Popular attractions nearby: City Museum (5 min), Central Park (10 min), Theater District (15 min), Shopping Mall (20 min), and Beach (25 min). Would you like directions?";
        } else if (msg.includes('price') || msg.includes('cost')) {
            return "Our room rates are: Standard Room ($129/night), Executive Room ($199/night), Deluxe Suite ($299/night), Presidential Suite ($499/night). All include free WiFi, breakfast, and pool access!";
        } else if (msg.includes('check')) {
            return "Check-in: 3:00 PM | Check-out: 11:00 AM. Early check-in and late check-out available upon request!";
        } else {
            return "Thank you for your message! I can help with room availability, services, pricing, check-in times, and local recommendations. What would you like to know?";
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('floatingChatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    saveToHistory(message, sender) {
        const history = JSON.parse(localStorage.getItem('floatingChatHistory') || '[]');
        history.push({ message, sender, timestamp: new Date().toISOString() });
        
        // Keep only last 50 messages
        if (history.length > 50) {
            history.shift();
        }
        
        localStorage.setItem('floatingChatHistory', JSON.stringify(history));
    }

    loadChatHistory() {
        const history = JSON.parse(localStorage.getItem('floatingChatHistory') || '[]');
        history.forEach(item => {
            this.addMessageWithoutSaving(item.message, item.sender);
        });
    }

    addMessageWithoutSaving(text, sender) {
        const messagesContainer = document.getElementById('floatingChatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message-small ${sender}-message-small`;

        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="message-content-small">
                    <p>${text}</p>
                </div>
                <div class="message-avatar-small">👤</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar-small">🤖</div>
                <div class="message-content-small">
                    <p>${text}</p>
                </div>
            `;
        }

        messagesContainer.appendChild(messageDiv);
    }

    updateWelcomeMessage() {
        const lang = getCurrentLanguage();
        const trans = translations[lang];
        
        // Update welcome message if needed
        const welcomeMsg = document.querySelector('.chatbot-welcome-message p');
        if (welcomeMsg && trans.chatbotWelcome) {
            welcomeMsg.textContent = trans.chatbotWelcome;
        }
    }
}

// Initialize floating chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.floatingChatbot = new FloatingChatbot();
});