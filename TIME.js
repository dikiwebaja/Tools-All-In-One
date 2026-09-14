
document.addEventListener('DOMContentLoaded', () => {
    let targetDate = null;
    let countdownInterval = null;
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const indonesianHolidays = {
        "1-0": "Tahun Baru 2026 Masehi",
        "17-1": "Isra Mikraj Nabi Muhammad SAW",
        "17-2": "Hari Suci Nyepi (Tahun Baru Saka 1948)",
        "3-3": "Wafat Yesus Kristus",
        "5-3": "Hari Paskah",
        "1-4": "Hari Buruh Internasional",
        "14-4": "Kenaikan Yesus Kristus",
        "20-4": "Hari Raya Waisak 2570",
        "21-4": "Hari Raya Idul Fitri 1447 H",
        "22-4": "Cuti Bersama Idul Fitri",
        "1-5": "Hari Lahir Pancasila",
        "27-5": "Hari Raya Idul Adha 1447 H",
        "16-6": "Tahun Baru Islam 1448 H",
        "17-7": "Hari Kemerdekaan RI Ke-81",
        "25-7": "Maulid Nabi Muhammad SAW",
        "25-11": "Hari Raya Natal"
    };

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            const targetTab = button.getAttribute('data-tab');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    const openPickerBtn = document.getElementById('open-picker');
    const closePickerBtn = document.getElementById('close-picker');
    const modal = document.getElementById('date-picker-modal');
    const applyDateBtn = document.getElementById('apply-custom-date');
    const selectedText = document.getElementById('selected-datetime-text');
    const modalPreview = document.getElementById('modal-preview-text');

    const spinDay = document.getElementById('spin-day');
    const spinMonth = document.getElementById('spin-month');
    const spinYear = document.getElementById('spin-year');
    const spinHour = document.getElementById('spin-hour');
    const spinMin = document.getElementById('spin-min');

    if(openPickerBtn && modal) {
        openPickerBtn.addEventListener('click', () => { 
            modal.classList.add('show'); 
            updateModalPreview(); 
        });
    }
    if(closePickerBtn && modal) {
        closePickerBtn.addEventListener('click', () => { 
            modal.classList.remove('show'); 
        });
    }

    function updateModalPreview() {
        if (!spinDay || !spinMonth || !spinYear || !spinHour || !spinMin || !modalPreview) return;
        const d = String(spinDay.innerText).padStart(2, '0');
        const mText = spinMonth.innerText;
        const y = spinYear.innerText;
        const h = String(spinHour.innerText).padStart(2, '0');
        const mn = String(spinMin.innerText).padStart(2, '0');
        modalPreview.innerText = `${d} ${mText} ${y} | Pukul ${h}:${mn}`;
    }

    function setupSpinner(upId, downId, valueEl, min, max, isMonth = false) {
        const upBtn = document.getElementById(upId);
        const downBtn = document.getElementById(downId);
        if(!upBtn || !downBtn || !valueEl) return;

        upBtn.addEventListener('click', () => {
            if (isMonth) {
                let currentVal = parseInt(valueEl.getAttribute('data-val')) || 0;
                currentVal = currentVal >= 11 ? 0 : currentVal + 1;
                valueEl.setAttribute('data-val', currentVal);
                valueEl.innerText = months[currentVal];
            } else {
                let currentVal = parseInt(valueEl.innerText) || min;
                currentVal = currentVal >= max ? min : currentVal + 1;
                valueEl.innerText = String(currentVal).padStart(2, '0');
            }
            updateModalPreview();
        });

        downBtn.addEventListener('click', () => {
            if (isMonth) {
                let currentVal = parseInt(valueEl.getAttribute('data-val')) || 0;
                currentVal = currentVal <= 0 ? 11 : currentVal - 1;
                valueEl.setAttribute('data-val', currentVal);
                valueEl.innerText = months[currentVal];
            } else {
                let currentVal = parseInt(valueEl.innerText) || min;
                currentVal = currentVal <= min ? max : currentVal - 1;
                valueEl.innerText = String(currentVal).padStart(2, '0');
            }
            updateModalPreview();
        });
    }

    setupSpinner('day-up', 'day-down', spinDay, 1, 31);
    setupSpinner('month-up', 'month-down', spinMonth, 0, 11, true);
    setupSpinner('year-up', 'year-down', spinYear, 2026, 2035);
    setupSpinner('hour-up', 'hour-down', spinHour, 0, 23);
    setupSpinner('min-up', 'min-down', spinMin, 0, 59);

    if(applyDateBtn && modal) {
        applyDateBtn.addEventListener('click', () => {
            if (!spinDay || !spinMonth || !spinYear || !spinHour || !spinMin) return;
            const d = parseInt(spinDay.innerText);
            const m = parseInt(spinMonth.getAttribute('data-val')) || 0;
            const y = parseInt(spinYear.innerText);
            const h = parseInt(spinHour.innerText);
            const mn = parseInt(spinMin.innerText);

            targetDate = new Date(y, m, d, h, mn, 0);
            
            if(selectedText) {
                selectedText.innerText = `${String(d).padStart(2, '0')} ${months[m]} ${y} - ${String(h).padStart(2, '0')}:${String(mn).padStart(2, '0')}`;
                selectedText.style.color = "var(--accent-neon)";
            }
            modal.classList.remove('show');
        });
    }

    const btnSetCountdown = document.getElementById('btn-set-countdown');
    const countdownTitle = document.getElementById('countdown-title');
    const inputTitle = document.getElementById('input-title');
    const elDays = document.getElementById('days');
    const elHours = document.getElementById('hours');
    const elMinutes = document.getElementById('minutes');
    const elSeconds = document.getElementById('seconds');

    if(btnSetCountdown) {
        btnSetCountdown.addEventListener('click', () => {
            if (!targetDate) {
                alert('Pilih target waktunya dulu ya! 😊');
                return;
            }
            const customTitle = inputTitle ? inputTitle.value.trim() : "";
            if(countdownTitle) countdownTitle.innerHTML = customTitle !== "" ? `${customTitle} ⚡` : `Menuju <span class="accent-neon">Hari H</span> - ?`;

            clearInterval(countdownInterval);
            countdownInterval = setInterval(() => {
                const now = new Date().getTime();
                const difference = targetDate.getTime() - now;

                if (difference <= 0) {
                    clearInterval(countdownInterval);
                    if(elDays) { elDays.innerText = "00"; elHours.innerText = "00"; elMinutes.innerText = "00"; elSeconds.innerText = "00"; }
                    if(countdownTitle) countdownTitle.innerHTML = `🎉 WAKTU SUDAH TIBA! 🎉`;
                    return;
                }
                if(elDays && elHours && elMinutes && elSeconds) {
                    elDays.innerText = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0');
                    elHours.innerText = String(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
                    elMinutes.innerText = String(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                    elSeconds.innerText = String(Math.floor((difference % (1000 * 60)) / 1000)).padStart(2, '0');
                }
            }, 1000);
        });
    }

    function updateClocks() {
        const now = new Date();
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

        if(document.getElementById('clock-wib')) document.getElementById('clock-wib').innerText = now.toLocaleTimeString('id-ID', { ...options, timeZone: 'Asia/Jakarta' });
        if(document.getElementById('clock-wita')) document.getElementById('clock-wita').innerText = now.toLocaleTimeString('id-ID', { ...options, timeZone: 'Asia/Makassar' });
        if(document.getElementById('clock-wit')) document.getElementById('clock-wit').innerText = now.toLocaleTimeString('id-ID', { ...options, timeZone: 'Asia/Jayapura' });

        if(document.getElementById('clock-tky')) document.getElementById('clock-tky').innerText = now.toLocaleTimeString('id-ID', { ...options, timeZone: 'Asia/Tokyo' });
        if(document.getElementById('clock-sol')) document.getElementById('clock-sol').innerText = now.toLocaleTimeString('id-ID', { ...options, timeZone: 'Asia/Seoul' });
        if(document.getElementById('clock-bjg')) document.getElementById('clock-bjg').innerText = now.toLocaleTimeString('id-ID', { ...options, timeZone: 'Asia/Shanghai' });
        if(document.getElementById('clock-sgp')) document.getElementById('clock-sgp').innerText = now.toLocaleTimeString('id-ID', { ...options, timeZone: 'Asia/Singapore' });
    }
    setInterval(updateClocks, 1000);

    let swStartTime = 0, swElapsedTime = 0, swInterval = null, swRunning = false, lapCount = 0;
    const swDisplay = document.getElementById('sw-display'), swStartBtn = document.getElementById('sw-start'), swLapBtn = document.getElementById('sw-lap'), swResetBtn = document.getElementById('sw-reset'), swLapsContainer = document.getElementById('sw-laps');

    if(swStartBtn) {
        swStartBtn.addEventListener('click', () => {
            if (!swRunning) {
                swRunning = true; swStartTime = Date.now() - swElapsedTime;
                swInterval = setInterval(() => { swElapsedTime = Date.now() - swStartTime; swDisplay.innerHTML = formatStopwatch(swElapsedTime); }, 10);
                swStartBtn.innerText = 'STOP'; swStartBtn.style.background = '#ff0055'; if(swLapBtn) swLapBtn.removeAttribute('disabled');
            } else {
                swRunning = false; clearInterval(swInterval); swStartBtn.innerText = 'START'; swStartBtn.style.background = ''; if(swLapBtn) swLapBtn.setAttribute('disabled', 'true');
            }
        });
        if(swLapBtn) {
            swLapBtn.addEventListener('click', () => {
                if (swRunning && swLapsContainer) {
                    lapCount++; const lapDiv = document.createElement('div');
                    lapDiv.style = "display:flex; justify-content:space-between; padding:5px 10px; border-bottom:1px solid rgba(255,255,255,0.05); font-family:'JetBrains Mono'; font-size:0.9rem;";
                    lapDiv.innerHTML = `<span style="color:var(--text-dim);">LAP ${lapCount}</span><span class="accent-neon">${formatLapTime(swElapsedTime)}</span>`;
                    swLapsContainer.prepend(lapDiv);
                }
            });
        }
        swResetBtn.addEventListener('click', () => {
            swRunning = false; clearInterval(swInterval); swElapsedTime = 0; lapCount = 0;
            if(swDisplay) swDisplay.innerHTML = `00:00:00<span style="font-size: 1.2rem; color: var(--text-dim);">.00</span>`;
            swStartBtn.innerText = 'START'; swStartBtn.style.background = ''; if(swLapBtn) swLapBtn.setAttribute('disabled', 'true'); if(swLapsContainer) swLapsContainer.innerHTML = '';
        });
    }

    function formatStopwatch(ms) {
        let min = Math.floor(ms / 60000), sec = Math.floor((ms % 60000) / 1000), mil = Math.floor((ms % 1000) / 10);
        return `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}:${String(mil).padStart(2,'0')}<span style="font-size:1.2rem; color:var(--text-dim);">.${String(mil).padStart(2,'0')}</span>`;
    }
    function formatLapTime(ms) {
        let min = Math.floor(ms / 60000), sec = Math.floor((ms % 60000) / 1000), mil = Math.floor((ms % 1000) / 10);
        return `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}.${String(mil).padStart(2,'0')}`;
    }

    let tmInterval = null, tmTimeLeft = 0;
    const tmDisplay = document.getElementById('tm-display'), tmStartBtn = document.getElementById('tm-start'), tmResetBtn = document.getElementById('tm-reset');

    if(tmStartBtn) {
        tmStartBtn.addEventListener('click', () => {
            if (tmInterval) {
                clearInterval(tmInterval); tmInterval = null; tmStartBtn.innerText = 'START'; tmStartBtn.style.background = '';
            } else {
                if (tmTimeLeft === 0) {
                    const hrs = parseInt(document.getElementById('tm-input-hr').value) || 0;
                    const mins = parseInt(document.getElementById('tm-input-min').value) || 0;
                    const secs = parseInt(document.getElementById('tm-input-sec').value) || 0;
                    tmTimeLeft = (hrs * 3600) + (mins * 60) + secs;
                }
                if (tmTimeLeft <= 0) { alert('Masukkan durasi timernya dulu ya!'); return; }

                tmStartBtn.innerText = 'PAUSE'; tmStartBtn.style.background = '#ffaa00';
                tmInterval = setInterval(() => {
                    tmTimeLeft--;
                    if (tmTimeLeft <= 0) {
                        clearInterval(tmInterval); tmInterval = null; tmTimeLeft = 0;
                        if(tmDisplay) tmDisplay.innerText = "00:00:00"; tmStartBtn.innerText = 'START'; tmStartBtn.style.background = '';
                        alert('🚨 Waktu Timer Habis! 🚨');
                    } else {
                        let h = Math.floor(tmTimeLeft / 3600), m = Math.floor((tmTimeLeft % 3600) / 60), s = tmTimeLeft % 60;
                        if(tmDisplay) tmDisplay.innerText = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
                    }
                }, 1000);
            }
        });

        if(tmResetBtn) {
            tmResetBtn.addEventListener('click', () => {
                clearInterval(tmInterval); tmInterval = null; tmTimeLeft = 0;
                if(tmDisplay) tmDisplay.innerText = "00:00:00"; tmStartBtn.innerText = 'START'; tmStartBtn.style.background = '';
                if(document.getElementById('tm-input-hr')) document.getElementById('tm-input-hr').value = '';
                if(document.getElementById('tm-input-min')) document.getElementById('tm-input-min').value = '';
                if(document.getElementById('tm-input-sec')) document.getElementById('tm-input-sec').value = '';
            });
        }
    }

    const dateToday = new Date();
    let viewMonth = dateToday.getMonth();
    let viewYear = dateToday.getFullYear();

    function generateCalendar(month, year) {
        const titleEl = document.getElementById('cal-month-year');
        const gridBox = document.getElementById('calendar-grid-box');
        if(!titleEl || !gridBox) return;
        
        gridBox.classList.remove('fade-active');
        void gridBox.offsetWidth; 
        gridBox.classList.add('fade-active');

        titleEl.innerText = `${months[month].toUpperCase()} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const dayHeaders = `
            <div style="color: #ff0055; font-weight: bold;">Min</div><div style="color: var(--text-dim);">Sen</div><div style="color: var(--text-dim);">Sel</div>
            <div style="color: var(--text-dim);">Rab</div><div style="color: var(--text-dim);">Kam</div><div style="color: var(--text-dim);">Jum</div>
            <div style="color: #00ffcc; font-weight: bold;">Sab</div>
        `;
        
        let cellsHtml = "";
        for (let i = 0; i < firstDay; i++) {
            cellsHtml += `<div style="padding: 5px; opacity: 0.15;">-</div>`;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const holidayKey = `${day}-${month}`;
            let style = "padding: 5px; border-radius: 4px; background: rgba(255,255,255,0.02); font-family: 'JetBrains Mono'; transition: all 0.2s;";
            
            if (day === dateToday.getDate() && month === dateToday.getMonth() && year === dateToday.getFullYear()) {
                style += "border: 1px solid #00ffcc; font-weight: bold; box-shadow: 0 0 8px rgba(0,255,204,0.5); background: rgba(0,255,204,0.05);";
            }
            if (indonesianHolidays[holidayKey]) {
                style += "color: #ff0055; font-weight: bold; background: rgba(255,0,85,0.1);";
            }

            cellsHtml += `<div class="cal-grid-item" style="${style}">${day}</div>`;
        }
        gridBox.innerHTML = dayHeaders + cellsHtml;

        let monthlyHolidays = [];
        for (let key in indonesianHolidays) {
            if(key.endsWith(`-${month}`)) {
                monthlyHolidays.push(`• Tgl ${key.split('-')[0]}: ${indonesianHolidays[key]}`);
            }
        }
        
        const infoBox = document.getElementById('holiday-info');
        if(infoBox) {
            infoBox.innerHTML = monthlyHolidays.length > 0 
                ? `<span style="font-weight:bold;">🔴 TANGGAL MERAH ${months[month].toUpperCase()}:</span>\n${monthlyHolidays.join('\n')}`
                : `* Tidak ada tanggal merah nasional di bulan ${months[month]}.`;
        }
    }

    const prevBtn = document.getElementById('cal-prev');
    const nextBtn = document.getElementById('cal-next');

    if(prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            if (viewMonth === 0) {
                if (viewYear > 2025) { viewMonth = 11; viewYear--; }
            } else { viewMonth--; }
            generateCalendar(viewMonth, viewYear);
        });

        nextBtn.addEventListener('click', () => {
            if (viewMonth === 11) {
                if (viewYear < 2030) { viewMonth = 0; viewYear++; }
                else { alert('Batas kalender proyek sampai tahun 2030 ya, Flutter! 😉'); return; }
            } else { viewMonth++; }
            generateCalendar(viewMonth, viewYear);
        });
    }

    generateCalendar(viewMonth, viewYear);
    updateClocks();
});