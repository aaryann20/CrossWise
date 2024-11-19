document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const chatMessages = document.getElementById('chatMessages');
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const typingIndicator = document.getElementById('typingIndicator');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const clearChatButton = document.getElementById('clearChat');
    const exportChatButton = document.getElementById('exportChat');

    let messages = [];
    let isDarkMode = false;

    function loadChatHistory() {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
            messages = JSON.parse(savedHistory);
            renderMessages();
        }
    }

    function saveChatHistory() {
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    }

    function sendWelcomeMessage() {
        const welcomeMessage = "Hello! I'm the CrossWise AI assistant, specialized in international trade. I can help you with:\n\n" +
            "• HS code classification\n" +
            "• Export documentation\n" +
            "• Trade compliance requirements\n" +
            "• Government incentives\n" +
            "• Market entry strategies\n\n" +
            "How can I assist you today?";
        addMessage(welcomeMessage, false);
    }

    function addMessage(text, isUser) {
        messages.push({ text, isUser });
        renderMessages();
        saveChatHistory();
    }

    function renderMessages() {
        chatMessages.innerHTML = '';
        messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${message.isUser ? 'user-message' : 'bot-message'}`;
            messageDiv.textContent = message.text;
            chatMessages.appendChild(messageDiv);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function handleUserInput(e) {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        userInput.value = '';
        typingIndicator.style.display = 'flex';

        try {
            const response = await mockGeminiAPI(message);
            addMessage(response, false);
        } catch (error) {
            addMessage("I apologize, but I'm having trouble connecting. Please try again.", false);
            console.error('Error:', error);
        }

        typingIndicator.style.display = 'none';
    }

    function mockGeminiAPI(message) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const responses = {
                    "hs code": "HS (Harmonized System) codes are standardized numerical codes used globally to classify traded products. For example, '090111' represents non-roasted coffee. Would you like me to help you find the correct HS code for your product?",
                    "export": "Exporting involves several key steps:\n\n1. Market Research\n2. Compliance Check\n3. Documentation\n4. Logistics Planning\n5. Payment Terms\n\nWhich aspect would you like to explore further?",
                    "documentation": "Essential export documents include:\n\n• Commercial Invoice\n• Bill of Lading\n• Certificate of Origin\n• Export License\n• Packing List\n\nWhich document would you like to learn more about?"
                };

                const defaultResponse = "I can help you with information about HS codes, export processes, documentation, compliance, and trade regulations. Could you please specify which area you'd like to explore?";

                const matchedResponse = Object.entries(responses).find(([key]) => 
                    message.toLowerCase().includes(key)
                );

                resolve(matchedResponse ? matchedResponse[1] : defaultResponse);
            }, 1000);
        });
    }

    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        app.classList.toggle('dark-mode');
        darkModeToggle.innerHTML = `<i class="fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}"></i>`;
    }

    function clearChat() {
        messages = [];
        renderMessages();
        sendWelcomeMessage();
    }

    function exportChat() {
        const chatContent = messages
            .map(msg => `${msg.isUser ? 'User' : 'AI'}: ${msg.text}`)
            .join('\n\n');
        
        const blob = new Blob([chatContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat_export.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    chatForm.addEventListener('submit', handleUserInput);
    darkModeToggle.addEventListener('click', toggleDarkMode);
    clearChatButton.addEventListener('click', clearChat);
    exportChatButton.addEventListener('click', exportChat);

    loadChatHistory();
    if (messages.length === 0) {
        sendWelcomeMessage();
    }
});