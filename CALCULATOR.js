let currentInput = "";
let isCalculated = false;

const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1023456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const alphabet = katakana.split('');

const fontSize = 16;
let columns = canvas.width / fontSize;
const rainDrops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(5, 6, 10, 0.12)'; // Efek trail menghilang slowly
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        
        ctx.fillStyle = i % 2 === 0 ? '#00f2ff' : '#bc13fe';
        ctx.font = fontSize + 'px monospace';
        
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    }
}
setInterval(drawMatrix, 33);

function playClickSound(value) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    let frequency = 600;

    if (!isNaN(value)) {
        frequency = 550 + (parseInt(value) * 35); 
    } else if (value === '=') {
        frequency = 880; 
    } else if (['+', '-', '*', '/'].includes(value)) {
        frequency = 420; 
    }

    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

function createParticle(e) {
    const button = e.currentTarget;
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('span');
        particle.style.position = 'absolute';
        particle.style.width = '4px'; particle.style.height = '4px';
        particle.style.backgroundColor = '#00f2ff';
        particle.style.borderRadius = '50%'; particle.style.pointerEvents = 'none';
        
        particle.style.left = '50%'; particle.style.top = '50%';
        
        const destinationX = (Math.random() - 0.5) * 65;
        const destinationY = (Math.random() - 0.5) * 65;
        
        button.appendChild(particle);
        const animation = particle.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${destinationX}px), calc(-50% + ${destinationY}px)) scale(0)`, opacity: 0 }
        ], { duration: 250 + Math.random() * 150, easing: 'cubic-bezier(0, .9, .57, 1)' });
        
        animation.onfinish = () => { particle.remove(); };
    }
}

function updateConverters(numArray) {
    const binText = document.getElementById('bin-text');
    const hexText = document.getElementById('hex-text');
    
    let num = parseFloat(numArray);
    
    if (isNaN(num) || !isFinite(num)) {
        binText.innerText = "0";
        hexText.innerText = "0";
        return;
    }

    let integerPart = Math.floor(Math.abs(num));
    
    binText.innerText = integerPart.toString(2);
    hexText.innerText = "0x" + integerPart.toString(16).toUpperCase();
}

function appendToDisplay(value) {
    const displayText = document.getElementById('display-text');
    playClickSound(value);

    displayText.classList.remove('num-animate');
    void displayText.offsetWidth; 

    if (isCalculated && !['+', '-', '*', '/'].includes(value)) {
        currentInput = "";
        isCalculated = false;
    } else {
        isCalculated = false;
    }

    if (currentInput === "0" && value !== ".") {
        currentInput = value;
    } else {
        currentInput += value;
    }
    
    displayText.innerText = currentInput;
    displayText.classList.add('num-animate');
    updateConverters(currentInput);
}

function clearDisplay() {
    playClickSound('0');
    currentInput = "";
    document.getElementById('display-text').innerText = "0";
    document.getElementById('history-text').innerText = "";
    updateConverters("0");
}

function deleteLast() {
    playClickSound('-');
    const displayText = document.getElementById('display-text');
    currentInput = currentInput.slice(0, -1);
    displayText.innerText = currentInput || "0";
    updateConverters(currentInput || "0");
}

function calculate() {
    playClickSound('=');
    const displayText = document.getElementById('display-text');
    const historyText = document.getElementById('history-text');
    
    if (currentInput === "") return;
    
    try {
        historyText.innerText = currentInput + " =";
        let result = eval(currentInput);
        currentInput = result.toString();
        displayText.innerText = currentInput;
        isCalculated = true;

        updateConverters(currentInput);

        if (result >= 100000) {
            Swal.fire({
                title: '👑 SULTAN NODE DETECTED 👑',
                text: `Aliran dana VIP terdeteksi sebesar: ${result.toLocaleString('id-ID')}`,
                background: '#05060a',
                color: '#ffffff',
                confirmButtonColor: '#bc13fe',
                icon: 'success',
                backdrop: `rgba(0, 242, 255, 0.15)`
            });
        }
    } catch (e) {
        displayText.innerText = "Error";
        currentInput = "";
        historyText.innerText = "";
    }
}

function copyToClipboard() {
    const currentVal = document.getElementById('display-text').innerText;
    if (currentVal === "0" || currentVal === "Error") return;

    navigator.clipboard.writeText(currentVal).then(() => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            background: '#05060a',
            color: '#00f2ff',
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });
        
        Toast.fire({
            icon: 'success',
            title: 'DATA COPIED TO CLIPBOARD'
        });
    });
}


function calcPower2() {
    playClickSound('2');
    const displayText = document.getElementById('display-text');
    if (currentInput === "") return;
    
    try {
        let num = parseFloat(currentInput);
        let result = Math.pow(2, num);
        document.getElementById('history-text').innerText = `2^(${currentInput}) =`;
        currentInput = result.toString();
        displayText.innerText = currentInput;
        updateConverters(currentInput);
        isCalculated = true;
    } catch (e) {
        displayText.innerText = "Error";
        currentInput = "";
    }
}

function calcSquare() {
    playClickSound('3');
    const displayText = document.getElementById('display-text');
    if (currentInput === "") return;
    
    try {
        let num = parseFloat(currentInput);
        let result = num * num;
        document.getElementById('history-text').innerText = `sqr(${currentInput}) =`;
        currentInput = result.toString();
        displayText.innerText = currentInput;
        updateConverters(currentInput);
        isCalculated = true;
    } catch (e) {
        displayText.innerText = "Error";
        currentInput = "";
    }
}

function calcRoot() {
    playClickSound('4');
    const displayText = document.getElementById('display-text');
    if (currentInput === "") return;
    
    try {
        let num = parseFloat(currentInput);
        if (num < 0) {
            displayText.innerText = "Error";
            currentInput = "";
            return;
        }
        let result = Math.sqrt(num);
        document.getElementById('history-text').innerText = `√(${currentInput}) =`;
        currentInput = result.toString();
        displayText.innerText = currentInput;
        updateConverters(currentInput);
        isCalculated = true;
    } catch (e) {
        displayText.innerText = "Error";
        currentInput = "";
    }
}