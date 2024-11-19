const API_KEY = "AIzaSyBzkyoW3w_8BNtzV1ciDwBPrug3oQlb-aQ"
const genAI = async (prompt)=>{
  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "contents": [
    {
      "parts": [
        {
          "text": prompt
        }
      ]
    }
  ]
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
};

try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, requestOptions);
    const result = await response.text();
    console.log(result);
    return result;
} catch (error) {
    console.error(error);
    throw error;
}
}

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
            const response = await genAI(message);
            const parsedResponse = JSON.parse(response);
            const textMessage = parsedResponse.candidates[0].content.parts[0].text;
            addMessage(textMessage, false);
        } catch (error) {
            addMessage("I apologize, but I'm having trouble connecting. Please try again.", false);
            console.error('Error:', error);
        }

        typingIndicator.style.display = 'none';
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


// const r = {
//     "candidates": [
//       {
//         "content": {
//           "parts": [
//             {
//               "text": "\"Football\" can refer to two very different sports, depending on where in the world you are:\n\n* **American Football:** This is a contact sport played with an oval-shaped ball, primarily in the United States and Canada.  Two teams of eleven players try to advance the ball down the field by running with it or throwing it.  The objective is to score by getting the ball into the opposing team's end zone.\n\n* **Association Football (Soccer):** This is the most popular sport in the world.  Two teams of eleven players use their feet (and sometimes their heads and chests) to move a round ball down the field.  The objective is to score by getting the ball into the opposing team's goal.\n\nTo avoid confusion, it's always best to specify which type of football you mean.\n"
//             }
//           ],
//           "role": "model"
//         },
//         "finishReason": "STOP",
//         "avgLogprobs": -0.12374247723852681
//       }
//     ],
//     "usageMetadata": {
//       "promptTokenCount": 3,
//       "candidatesTokenCount": 171,
//       "totalTokenCount": 174
//     },
//     "modelVersion": "gemini-1.5-flash-002"
//   }
  
