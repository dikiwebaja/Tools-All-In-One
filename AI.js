const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message-cyber', sender === 'user' ? 'user-msg' : 'ai-msg');
    
    const iconClass = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
    
    messageDiv.innerHTML = `
        <i class="${iconClass} icon-msg"></i>
        <div class="message-text">${text}</div>
    `;
    
    chatBox.appendChild(messageDiv);
    
    chatBox.scrollTop = chatBox.scrollHeight;
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

async function sendMessage() {
    const messageText = userInput.value.trim();
    
    if (messageText === '') return;

    appendMessage(messageText, 'user');
    userInput.value = ''; 
    try {
        setTimeout(() => {
            const zeltaReplies = [
                "Wih, mantap abis ketikan kamu, Flutter! Gak berantakan lagi kan tampilannya? 😎",
                "Oke siap, Flutter! Zelta dengerin kok. Lanjuttt!",
                "Hehehe, tampilan baru chat kita emang paling *slebew* deh! Kamu suka gak?",
                "Gimana, Flutter? Udah rapi, responsif, dan *cyber* banget kan sekarang? Gak pusing lagi liatnya!"
            ];
            const randomReply = zeltaReplies[Math.floor(Math.random() * zeltaReplies.length)];
            appendMessage(randomReply, 'ai');
        }, 1200); 

    } catch (error) {
        console.error("Waduh, error nih:", error);
        appendMessage("Aduh Flutter, sori banget... Koneksi Zelta lagi agak 'ngadat' nih. Coba lagi bentar ya!", 'ai');
    }
}