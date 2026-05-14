// Chatbot Support System - Afaan Oromoo
class ChatbotSupport {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatWidget();
        this.setupEventListeners();
        this.addWelcomeMessage();
    }

    createChatWidget() {
        const chatWidget = document.createElement('div');
        chatWidget.id = 'chatbot-widget';
        chatWidget.innerHTML = `
            <div id="chat-button" class="chat-button">
                <span class="chat-icon">💬</span>
                <span class="chat-text">Gargaarsa</span>
            </div>
            
            <div id="chat-window" class="chat-window" style="display: none;">
                <div class="chat-header">
                    <div class="chat-header-content">
                        <span class="chat-avatar">🤖</span>
                        <div>
                            <h4>ClickICT Gargaarsa</h4>
                            <p class="chat-status">Online</p>
                        </div>
                    </div>
                    <button id="close-chat" class="close-chat-btn">✕</button>
                </div>
                
                <div id="chat-messages" class="chat-messages">
                    <!-- Messages will be added here -->
                </div>
                
                <div class="chat-input-container">
                    <input type="text" id="chat-input" class="chat-input" placeholder="Gaafii keessan barreessaa..." />
                    <button id="send-message" class="send-btn">➤</button>
                </div>
                
                <div class="quick-questions">
                    <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 0.5rem;">Gaaffii Saffisaa:</p>
                    <button class="quick-btn" data-question="Akkamitti kompitara baradha?">Kompitara barachuu</button>
                    <button class="quick-btn" data-question="Bilbila koo suphaa taasisuu barbaada">Bilbila suphaa</button>
                    <button class="quick-btn" data-question="AI maal jechuu dha?">AI hubachuu</button>
                </div>
            </div>
        `;
        document.body.appendChild(chatWidget);
    }

    setupEventListeners() {
        const chatButton = document.getElementById('chat-button');
        const closeChat = document.getElementById('close-chat');
        const sendMessage = document.getElementById('send-message');
        const chatInput = document.getElementById('chat-input');
        const quickBtns = document.querySelectorAll('.quick-btn');

        chatButton.addEventListener('click', () => this.toggleChat());
        closeChat.addEventListener('click', () => this.toggleChat());
        sendMessage.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                this.sendUserMessage(question);
            });
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('chat-window');
        const chatButton = document.getElementById('chat-button');
        
        if (this.isOpen) {
            chatWindow.style.display = 'flex';
            chatButton.style.display = 'none';
        } else {
            chatWindow.style.display = 'none';
            chatButton.style.display = 'flex';
        }
    }

    addWelcomeMessage() {
        setTimeout(() => {
            this.addBotMessage("Baga nagaan dhuftan! Ani ClickICT gargaarsa bot. Akkamittin isin gargaaruu danda'a?");
        }, 500);
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message) {
            this.sendUserMessage(message);
            input.value = '';
        }
    }

    sendUserMessage(message) {
        this.addMessage(message, 'user');
        setTimeout(() => {
            this.generateBotResponse(message);
        }, 500);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addBotMessage(text) {
        this.addMessage(text, 'bot');
    }

    generateBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        let response = '';

        // Kompitara related
        if (message.includes('kompitara') || message.includes('computer')) {
            response = "Kompitara waa'ee barachuuf fuula kompitara.html keessa seenaa. Achitti hardware, software fi troubleshooting barachuu dandeessu. Gargaarsa dabalataa barbaadduu?";
        }
        // Bilbila related
        else if (message.includes('bilbila') || message.includes('phone') || message.includes('suphaa')) {
            response = "Bilbila suphaa taasisuuf fuula bilbila.html keessa seenaa. Secret codes, apps gaarii fi troubleshooting tips argachuu dandeessu. Maal barbaaddu?";
        }
        // AI related
        else if (message.includes('ai') || message.includes('artificial intelligence')) {
            response = "AI (Artificial Intelligence) waa'ee barachuuf fuula ai.html keessa seenaa. AI maal akka ta'e, akkamitti hojjetu fi faayidaa isaa hubachuu dandeessu.";
        }
        // Technology related
        else if (message.includes('teeknoloojii') || message.includes('technology')) {
            response = "Teeknoloojii haaraa waa'ee barachuuf fuula teeknoloojii.html keessa seenaa. Oduu teeknoloojii fi barnoota bal'aa argachuu dandeessu.";
        }
        // Registration/Login
        else if (message.includes('galmaa') || message.includes('register') || message.includes('login')) {
            response = "Galmaa'uuf user-register.html fuula keessa seenaa. Yoo duraan galmaa'tan ta'e, user-login.html irraa seenuu dandeessu.";
        }
        // Greeting
        else if (message.includes('nagaa') || message.includes('hello') || message.includes('hi')) {
            response = "Nagaan! Akkam jirtu? Maal isin gargaaruu danda'a?";
        }
        // Help
        else if (message.includes('gargaarsa') || message.includes('help')) {
            response = "Gargaarsa barbaaddanii? Kompitara, Bilbila, AI ykn Teeknoloojii waa'ee gaafachuu dandeessu. Akkasumas galmaa'uu fi seenuu keessatti gargaaruu danda'a.";
        }
        // Default response
        else {
            response = "Galatoomaa gaafii keessaniif! Gargaarsa dabalataa argachuuf:<br>💻 Kompitara barachuu<br>📱 Bilbila suphaa taasisuu<br>🤖 AI hubachuu<br>🌐 Teeknoloojii haaraa<br><br>Maal barbaaddu?";
        }

        this.addBotMessage(response);
    }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatbotSupport();
});
