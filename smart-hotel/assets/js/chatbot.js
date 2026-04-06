// Chatbot functionality for SmartHotel

// Predefined responses database
const responses = {
    greetings: [
        "Hello! How can I assist you today?",
        "Hi there! Welcome to SmartHotel. What can I help you with?",
        "Greetings! I'm here to help with your hotel needs."
    ],
    availability: {
        response: "I'd be happy to help you check room availability! We have several room types available:<br><br>• Standard Room - $129/night<br>• Executive Room - $199/night<br>• Deluxe Suite - $299/night<br>• Presidential Suite - $499/night<br><br>What dates are you interested in?",
        keywords: ['availability', 'available', 'book', 'reserve', 'reservation']
    },
    services: {
        response: "SmartHotel offers a wide range of premium services:<br><br>🍽️ Fine Dining & 24/7 Room Service<br>💆 Luxury Spa & Wellness Center<br>🏊 Infinity Pool & Fitness Center<br>🚗 Airport Transfer & Valet Parking<br>💼 Business Center & Meeting Rooms<br>🎉 Event Venues & Wedding Planning<br><br>Would you like more details about any specific service?",
        keywords: ['service', 'amenities', 'facilities', 'spa', 'pool', 'restaurant', 'dining']
    },
    attractions: {
        response: "Great question! Here are some popular attractions near SmartHotel:<br><br>🏛️ City Museum (5 min walk)<br>🌳 Central Park (10 min walk)<br>🎭 Theater District (15 min drive)<br>🛍️ Shopping Mall (20 min walk)<br>🏖️ Beach (25 min drive)<br>🎨 Art Gallery (12 min walk)<br><br>I can also arrange tours and transportation for you!",
        keywords: ['attraction', 'nearby', 'local', 'recommend', 'visit', 'see', 'do', 'activities']
    },
    checkin: {
        response: "Check-in and check-out information:<br><br>⏰ Check-in: 3:00 PM<br>⏰ Check-out: 11:00 AM<br><br>Early check-in and late check-out are available upon request (subject to availability). We also offer digital key access through our mobile app for your convenience!",
        keywords: ['check-in', 'check in', 'checkin', 'check-out', 'check out', 'checkout', 'arrival', 'departure']
    },
    pricing: {
        response: "Our room rates are:<br><br>Standard Room: $129/night<br>Executive Room: $199/night<br>Deluxe Suite: $299/night<br>Presidential Suite: $499/night<br><br>All rates include:<br>✓ Free WiFi<br>✓ Breakfast buffet<br>✓ Fitness center & pool access<br>✓ 24/7 room service<br><br>Special packages and discounts are available for extended stays!",
        keywords: ['price', 'cost', 'rate', 'how much', 'expensive', 'cheap', 'discount']
    },
    cancellation: {
        response: "Our cancellation policy:<br><br>• Free cancellation up to 48 hours before check-in<br>• Cancellations within 48 hours: 50% charge<br>• No-shows: full charge<br><br>For modifications to existing bookings, please contact us at least 24 hours in advance. Premium and special rate bookings may have different policies.",
        keywords: ['cancel', 'cancellation', 'refund', 'policy', 'change', 'modify']
    },
    parking: {
        response: "Parking options at SmartHotel:<br><br>🚗 Valet Parking: $20/day<br>🅿️ Self-Parking: $15/day<br>🔌 EV Charging Stations: Available<br><br>All parking areas are secure and monitored 24/7. Valet service includes car wash and detailing upon request.",
        keywords: ['parking', 'park', 'valet', 'car', 'vehicle']
    },
    wifi: {
        response: "WiFi Information:<br><br>✓ Free high-speed WiFi throughout the hotel<br>✓ No password required - automatic connection<br>✓ Premium bandwidth for business guests<br>✓ Technical support available 24/7<br><br>Simply connect to 'SmartHotel-WiFi' network!",
        keywords: ['wifi', 'wi-fi', 'internet', 'connection', 'network']
    },
    pets: {
        response: "Pet Policy:<br><br>🐕 We are a pet-friendly hotel!<br>• Pets up to 25 lbs: $50/stay<br>• Pets over 25 lbs: $75/stay<br>• Maximum 2 pets per room<br>• Pet amenities available<br><br>Please inform us in advance so we can prepare a pet-friendly room for you!",
        keywords: ['pet', 'dog', 'cat', 'animal', 'pet-friendly']
    },
    breakfast: {
        response: "Breakfast at SmartHotel:<br><br>🍳 Complimentary breakfast buffet<br>⏰ Served 6:30 AM - 10:30 AM daily<br>📍 Located in our main restaurant<br><br>Menu includes:<br>• Fresh pastries and breads<br>• Hot breakfast items<br>• Fresh fruits and yogurt<br>• Coffee, tea, and juices<br>• Vegetarian and vegan options",
        keywords: ['breakfast', 'morning', 'food', 'eat', 'meal']
    }
};

// Initialize chatbot
document.addEventListener('DOMContentLoaded', () => {
    loadChatHistory();
});

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    const chatMessages = document.getElementById('chatMessages');
    
    // Add user message
    addMessage(message, 'user');
    
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Save to chat history
    saveChatMessage(message, 'user');
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate bot thinking and respond
    setTimeout(() => {
        hideTypingIndicator();
        const botResponse = getBotResponse(message);
        addMessage(botResponse, 'bot');
        saveChatMessage(botResponse, 'bot');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
            <div class="message-avatar">👤</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <p>Typing...</p>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function getBotResponse(message) {
    const msg = message.toLowerCase();
    
    // Check for greetings
    if (msg.match(/^(hi|hello|hey|greetings)/)) {
        return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
    }
    
    // Check for specific topics
    for (const [key, value] of Object.entries(responses)) {
        if (key === 'greetings') continue;
        
        if (value.keywords && value.keywords.some(keyword => msg.includes(keyword))) {
            return value.response;
        }
    }
    
    // Check for help or general questions
    if (msg.includes('help') || msg.includes('question')) {
        return "I'm here to help! You can ask me about:<br><br>• Room availability and booking<br>• Hotel services and amenities<br>• Check-in/check-out times<br>• Local attractions and dining<br>• Pricing and special offers<br>• Cancellation policies<br>• WiFi, parking, and more<br><br>What would you like to know?";
    }
    
    // Default response
    return "Thank you for your message! I'm here to assist with bookings, hotel information, and local recommendations. Could you please provide more details about what you'd like to know? You can also use the quick action buttons below for common requests!";
}

function sendQuickMessage(message) {
    document.getElementById('messageInput').value = message;
    sendMessage();
}

function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `
        <div class="message bot-message">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <p>Chat cleared! How can I help you?</p>
            </div>
        </div>
    `;
    localStorage.removeItem('chatHistory');
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Chat history functions
function saveChatMessage(message, sender) {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    history.push({
        message,
        sender,
        timestamp: new Date().toISOString()
    });
    // Keep only last 50 messages
    if (history.length > 50) {
        history.shift();
    }
    localStorage.setItem('chatHistory', JSON.stringify(history));
}

function loadChatHistory() {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const chatMessages = document.getElementById('chatMessages');
    
    // Only load if there is history
    if (history.length > 0) {
        // Clear default message
        chatMessages.innerHTML = '';
        
        history.forEach(item => {
            addMessage(item.message, item.sender);
        });
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Export for backend integration
async function sendToBackend(message) {
    try {
        const response = await fetch('backend/api/chatbot.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error communicating with chatbot backend:', error);
        return getBotResponse(message);
    }
}