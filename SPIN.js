const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin-btn");
const resultText = document.getElementById("result-text");
const congratsTitle = document.getElementById("congrats-title");
const optionInput = document.getElementById("option-input");
const addBtn = document.getElementById("add-btn");
const pasteBtn = document.getElementById("paste-btn"); 
const tagsContainer = document.getElementById("tags-container");
const leaderboardList = document.getElementById("leaderboard-list");

const congratsModal = document.getElementById("congrats-modal");
const modalTitle = document.getElementById("modal-title");
const modalWinner = document.getElementById("modal-winner");
const closeModalBtn = document.getElementById("close-modal-btn");

let options = [];
let lastWinnerIndex = null; 
let leaderboardData = {};

const cyberColors = ["#0e0f19", "#17192b", "#1f223a", "#282b4a", "#30345a", "#393d6a"];

function drawWheel() {
    const size = canvas.width;
    const center = size / 2;
    ctx.clearRect(0, 0, size, size);

    if (options.length === 0) {
        ctx.beginPath();
        ctx.fillStyle = "#11121b";
        ctx.arc(center, center, center - 5, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.font = "14px Poppins";
        ctx.textAlign = "center";
        ctx.fillText("Roda Masih Kosong", center, center + 5);
        ctx.restore();
        return;
    }

    const numSegments = options.length;
    const segmentAngle = (2 * Math.PI) / numSegments;

    for (let i = 0; i < numSegments; i++) {
        const angle = i * segmentAngle;
        
        ctx.beginPath();
        ctx.fillStyle = cyberColors[i % cyberColors.length];
        ctx.moveTo(center, center);
        ctx.arc(center, center, center - 5, angle, angle + segmentAngle);
        ctx.lineTo(center, center);
        ctx.fill();

        ctx.strokeStyle = "rgba(0, 242, 255, 0.2)";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(angle + segmentAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px Poppins";
        
        let text = options[i];
        if (text.length > 10) text = text.substring(0, 8) + "..";
        
        ctx.fillText(text, center - 25, 5);
        ctx.restore();
    }
}

function updateLeaderboard(newWinner) {
    if (leaderboardData[newWinner]) {
        leaderboardData[newWinner] += 1;
    } else {
        leaderboardData[newWinner] = 1;
    }

    let sortedRanks = Object.keys(leaderboardData).map(name => {
        return { name: name, wins: leaderboardData[name], lastUpdated: Date.now() };
    });

    sortedRanks.sort((a, b) => {
        if (b.wins !== a.wins) {
            return b.wins - a.wins;
        }
        return b.lastUpdated - a.lastUpdated;
    });

    leaderboardList.innerHTML = "";

    sortedRanks.forEach((rank, index) => {
        const row = document.createElement("div");
        row.className = `rank-row ${index === 0 ? 'top-rank' : ''}`;
        
        row.innerHTML = `
            <div class="rank-number">#${index + 1}</div>
            <div class="rank-name">${rank.name}</div>
            <div class="rank-score">${rank.wins} WINS</div>
        `;
        leaderboardList.appendChild(row);
    });
}

function updateTags() {
    tagsContainer.innerHTML = "";
    options.forEach((opt, index) => {
        const tag = document.createElement("div");
        tag.className = "chip-tag";
        tag.innerHTML = `${opt} <span class="remove-btn" onclick="removeOption(${index})">×</span>`;
        tagsContainer.appendChild(tag);
    });
    drawWheel();
}

function addOption() {
    const value = optionInput.value.trim();
    if (value !== "") {
        options.push(value);
        optionInput.value = "";
        updateTags();
        if(options.length >= 2) {
            resultText.style.color = "var(--text-main)";
            resultText.innerText = "Sistem Siap. Klik SPIN!";
        }
    }
}

function processBulkInput(text) {
    const rawItems = text.split(/[\n,]+/);
    let addedCount = 0;
    rawItems.forEach(item => {
        const cleaned = item.trim();
        if (cleaned !== "") {
            options.push(cleaned);
            addedCount++;
        }
    });
    if (addedCount > 0) {
        updateTags();
        resultText.style.color = "var(--cyber-green)";
        resultText.innerText = `📋 Berhasil menambahkan ${addedCount} opsi dari Clipboard!`;
    }
}

window.removeOption = function(index) {
    options.splice(index, 1);
    updateTags();
    if(options.length < 2) {
        resultText.style.color = "var(--text-main)";
        resultText.innerText = "Isi list di bawah dulu yuk!";
        congratsTitle.innerText = "";
    }
}

let isSpinning = false;

function spin() {
    if (isSpinning) return;
    if (options.length < 2) {
        resultText.style.color = "#ff4d4d";
        resultText.innerText = "⚠️ Masukin minimal 2 opsi dulu!";
        return;
    }

    isSpinning = true;
    
    const mainCard = document.querySelector(".card");
    const wheelContainer = document.querySelector(".wheel-container");
    const pointer = document.querySelector(".pointer");

    mainCard.classList.add("screen-shake"); 
    wheelContainer.classList.add("rgb-active"); 
    pointer.classList.add("pointer-active"); 
    
    resultText.parentElement.classList.add("cyber-glint"); 
    resultText.parentElement.classList.remove("flash-effect");

    congratsTitle.innerText = "🎰 EXECUTING RANDOMIZER...";
    resultText.style.color = "var(--text-dim)";
    resultText.innerText = "Memproses roda takdir...";

    const numSegments = options.length;
    lastWinnerIndex = Math.floor(Math.random() * numSegments);
    
    const segmentAngle = 360 / numSegments;
    const targetAngle = 270 - (lastWinnerIndex * segmentAngle) - (segmentAngle / 2);
    
    const totalRotation = - (4320 + ((targetAngle + 360) % 360));
    
    let startTimestamp = null;
    const duration = 8000;

    function animate(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 5);
        
        const rotationDegrees = easeOut * totalRotation;
        canvas.style.transform = `rotate(${rotationDegrees}deg)`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            
            mainCard.classList.remove("screen-shake");
            wheelContainer.classList.remove("rgb-active");
            pointer.classList.remove("pointer-active");
            resultText.parentElement.classList.remove("cyber-glint");
            
            const ucapanSeru = ["HOREEE! 🎉", "MANTAP! 🔥", "GOKIL SANGAT! 🚀", "BERHASIL! 👑", "WADIDAW! ✨"];
            const kataAcak = ucapanSeru[Math.floor(Math.random() * ucapanSeru.length)];

            const sangPemenang = options[lastWinnerIndex];

            congratsTitle.innerText = `✨ ${kataAcak} SYSTEM CHOSEN ✨`;
            resultText.style.color = "var(--cyber-green)";
            resultText.innerText = `>> ${sangPemenang} <<`;
            resultText.parentElement.classList.add("flash-effect");

            updateLeaderboard(sangPemenang);

            setTimeout(() => {
                modalTitle.innerText = kataAcak;
                modalWinner.innerText = `>> ${sangPemenang} <<`;
                congratsModal.classList.add("show"); 
            }, 400); 
        }
    }
    
    requestAnimationFrame(animate);
}

addBtn.addEventListener("click", addOption);
optionInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addOption();
});
spinBtn.addEventListener("click", spin);

optionInput.addEventListener("paste", (e) => {
    e.preventDefault(); 
    const pastedText = (e.clipboardData || window.clipboardData).getData("text");
    if (pastedText.trim() !== "") {
        processBulkInput(pastedText);
    }
});

pasteBtn.addEventListener("click", async () => {
    try {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText.trim() !== "") {
            processBulkInput(clipboardText);
            return; 
        }
    } catch (err) {

        optionInput.focus();
        
        try {
            document.execCommand("paste");
        } catch (execErr) {
            resultText.style.color = "var(--accent-neon)";
            resultText.innerText = "💡 Browser mengunci clipboard otomatis. Tekan Ctrl + V sekarang!";
            optionInput.placeholder = "👉 TEKAN CTRL + V DI SINI SEKARANG... 👈";            
            setTimeout(() => {
                optionInput.placeholder = "Tulis opsi atau tempel list...";
            }, 4000);
        }
    }
});

closeModalBtn.addEventListener("click", () => {
    congratsModal.classList.remove("show");
    document.querySelector(".wheel-container").classList.remove("rgb-active");
    document.querySelector(".pointer").classList.remove("pointer-active");

    if (lastWinnerIndex !== null) {
        options.splice(lastWinnerIndex, 1); 
        lastWinnerIndex = null; 
        updateTags(); 
        
        if (options.length < 2) {
            resultText.style.color = "var(--text-main)";
            resultText.innerText = options.length === 1 ? "Tinggal sisa 1 opsi nih, isi list lagi yuk!" : "Roda habis! Isi list di bawah dulu yuk!";
            congratsTitle.innerText = "";
        } else {
            resultText.style.color = "var(--text-main)";
            resultText.innerText = "Pemenang dieliminasi. Siap putar lagi!";
        }
    }
});

drawWheel();