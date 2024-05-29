const userInput = document.getElementById('user-input');
const chatHistory = document.getElementById('chat-history');

let apiKey = '';

window.electronAPI.receiveApiKey((key) => {
    apiKey = key;
    console.log('API Key received:', apiKey);  
});

document.addEventListener('DOMContentLoaded', (event) => {
    const sendButton = document.getElementById('send-button');
    console.log(sendButton); 

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                userInput.value += '\n';
                event.preventDefault();  
            } else {
                event.preventDefault();  
                sendMessage();
            }
        }
    });

    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    } else {
        console.error('Send button not found');
    }
});

function sendMessage() {
    console.log('메시지 전송 시도');
    const input = userInput.value.trim();
    if (input) {
        const userMessage = document.createElement('p');
        userMessage.textContent = input; 
        userMessage.className = 'message user-message'; 
        chatHistory.appendChild(userMessage);
        userInput.value = '';
        fetchChatResponse(input);
    }
}

function fetchChatResponse(input) {
    const data = {
        model: "gpt-4",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: input }
        ]
    };

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.choices && data.choices.length > 0) {
            const aiMessage = document.createElement('p');
            aiMessage.textContent = data.choices[0].message.content; 
            aiMessage.className = 'message ai-message'; 
            chatHistory.appendChild(aiMessage);
        } else {
            const errorElement = document.createElement('p');
            errorElement.textContent = '응답 처리 중 오류 발생';
            errorElement.className = 'message ai-message'; 
            chatHistory.appendChild(errorElement);
        }
    })
    .catch(error => {
        const errorElement = document.createElement('p');
        errorElement.textContent = `네트워크 오류 - ${error.message}`;
        errorElement.className = 'message ai-message'; 
        chatHistory.appendChild(errorElement);
    });
}