const colorInput = document.getElementById('colorInput');
    const mainPreview = document.getElementById('mainPreview');
    const hexDisplay = document.getElementById('hexDisplay');
    const hexResult = document.getElementById('hexResult');
    const rgbResult = document.getElementById('rgbResult');
    const variationList = document.getElementById('variationList');
    const paletteList = document.getElementById('paletteList');
    const rareName = document.getElementById('rareName');
    const rareDetail = document.getElementById('rareDetail');
    const catLabel = document.getElementById('catLabel');
    const catSlider = document.getElementById('catSlider');
    const sliderBar = document.getElementById('sliderBar');
    const imageUpload = document.getElementById('imageUpload');
    const imageCanvas = document.getElementById('imageCanvas');
    const ctx = imageCanvas.getContext('2d');

    let currentCategory = 'all';

    const categories = [
        { id: "all", name: "Semua", color: "linear-gradient(45deg, #ff0000, #00ff00, #0000ff)" },
        { id: "red", name: "Merah", color: "#FF0000" },
        { id: "orange", name: "Oranye", color: "#FF7F00" },
        { id: "yellow", name: "Kuning", color: "#FFFF00" },
        { id: "green", name: "Hijau", color: "#00FF00" },
        { id: "cyan", name: "Cyan", color: "#00FFFF" },
        { id: "blue", name: "Biru", color: "#0000FF" },
        { id: "violet", name: "Violet", color: "#7F00FF" }
    ];

    function slideCategories(direction) {
        const scrollAmount = 100;
        catSlider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }

    catSlider.addEventListener('scroll', () => {
        const maxScroll = catSlider.scrollWidth - catSlider.clientWidth;
        const percentage = (catSlider.scrollLeft / maxScroll) * 100;
        sliderBar.style.width = percentage + '%';
    });

    function rollSpecificRare() {
        const rareColors = {
            all: [
                {n: "Cyber Neon", c: "#00f2ff", d: "Vibe masa depan yang terang"},
                {n: "Vaporwave Pink", c: "#ff71ce", d: "Estetika retro 80-an"},
                {n: "Deep Void", c: "#0a0b10", d: "Hitam pekat yang elegan"},
                {n: "Slime Green", c: "#32ff7e", d: "Hijau neon yang mencolok"},
                {n: "Electric Purple", c: "#bf5af2", d: "Ungu modern yang tajam"},
                {n: "Solar Flare", c: "#ff9f0a", d: "Oranye panas matahari"}
            ],
            red: [
                {n: "Crimson Ghost", c: "#990000", d: "Merah hantu yang misterius"},
                {n: "Cherry Blossom", c: "#ffb7c5", d: "Merah muda bunga sakura"},
                {n: "Blood Orange", c: "#ff4500", d: "Perpaduan merah dan oranye"}
            ],
            blue: [
                {n: "Deep Sea", c: "#000080", d: "Biru kedalaman samudera"},
                {n: "Sky High", c: "#0fbcf9", d: "Biru langit yang cerah"},
                {n: "Midnight", c: "#1e272e", d: "Biru gelap tengah malam"}
            ],
            green: [
                {n: "Emerald City", c: "#05c46b", d: "Hijau permata yang mewah"},
                {n: "Minty Fresh", c: "#80ffdb", d: "Hijau mint yang segar"},
                {n: "Forest", c: "#1e3799", d: "Hijau hutan pinus"}
            ],
            yellow: [
                {n: "Golden Hour", c: "#ffc312", d: "Cahaya emas sore hari"},
                {n: "Neon Lemon", c: "#fff200", d: "Kuning stabilo yang tajam"}
            ],
            orange: [
                {n: "Tiger Lily", c: "#fa8231", d: "Oranye bunga yang kuat"},
                {n: "Sunset", c: "#fd9644", d: "Warna langit saat terbenam"}
            ],
            cyan: [
                {n: "Aquamarine", c: "#7efff5", d: "Biru air laut tropis"},
                {n: "Biohazard", c: "#18dcff", d: "Cyan yang sangat cerah"}
            ],
            violet: [
                {n: "Ametyst", c: "#a55eea", d: "Ungu batu mulia"},
                {n: "Dark Lavender", c: "#82589f", d: "Lavender yang menenangkan"}
            ]
        };

        const list = rareColors[currentCategory] || rareColors.all;
        
        const pick = list[Math.floor(Math.random() * list.length)];
        
        rareName.style.opacity = 0;
        rareDetail.style.opacity = 0;
        
        setTimeout(() => {
            rareName.innerText = pick.n;
            rareDetail.innerText = pick.d;
            colorInput.value = pick.c;
            updateEverything(pick.c);
            
            rareName.style.opacity = 1;
            rareDetail.style.opacity = 1;
        }, 150);
    }

    function generateGenealogy(r, g, b) {
        variationList.innerHTML = '';
        const [h, s, l] = rgbToHsl(r, g, b);
        
        const schemes = [
            { name: "Light Tint", color: `hsl(${h}, ${s}%, ${Math.min(95, l + 20)}%)`, desc: "Highlight lembut." },
            { name: "Deep Shade", color: `hsl(${h}, ${s}%, ${Math.max(5, l - 20)}%)`, desc: "Shadow mendalam." },
            { name: "Muted Vibe", color: `hsl(${h}, ${Math.max(0, s - 30)}%, ${l}%)`, desc: "Warna tenang." },
            { name: "Vibrant Punch", color: `hsl(${h}, ${Math.min(100, s + 30)}%, ${l}%)`, desc: "Intensitas tinggi." },
            { name: "Complementary", color: `hsl(${(h + 180) % 360}, ${s}%, ${l}%)`, desc: "Lawan roda warna." },
            { name: "Analogous L", color: `hsl(${(h + 30) % 360}, ${s}%, ${l}%)`, desc: "Tetangga kiri." },
            { name: "Analogous R", color: `hsl(${(h - 30 + 360) % 360}, ${s}%, ${l}%)`, desc: "Tetangga kanan." },
            { name: "Soft Pastel", color: `hsl(${h}, 70%, 85%)`, desc: "Versi pastel estetik." }
        ];

        schemes.forEach(v => {
            const item = document.createElement('div');
            item.className = 'variation-item';
            item.onclick = () => {
                const hex = rgbToHexFromStr(v.color);
                colorInput.value = hex;
                updateEverything(hex);
            };
            item.innerHTML = `<div class="var-swatch" style="background: ${v.color}"></div><div class="var-info"><span class="var-name">${v.name}</span><span class="var-desc">${v.desc}</span></div>`;
            variationList.appendChild(item);
        });
    }

    function rgbToHexFromStr(col) {
        const temp = document.createElement("div");
        temp.style.color = col;
        document.body.appendChild(temp);
        const style = window.getComputedStyle(temp).color;
        const res = style.match(/\d+/g).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
        document.body.removeChild(temp);
        return "#" + res;
    }

    function updateEverything(hex) {
        mainPreview.style.background = hex;
        hexDisplay.innerText = hex.toUpperCase();
        hexResult.innerText = hex.toUpperCase();
        const r = parseInt(hex.substr(1,2), 16), g = parseInt(hex.substr(3,2), 16), b = parseInt(hex.substr(5,2), 16);
        rgbResult.innerText = `rgb(${r}, ${g}, ${b})`;
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        hexDisplay.style.color = brightness > 125 ? '#000' : '#fff';
        generateGenealogy(r, g, b);
    }

    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) h = s = 0;
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
            else if (max === g) h = (b - r) / d + 2;
            else h = (r - g) / d + 4;
            h /= 6;
        }
        return [h * 360, s * 100, l * 100];
    }

    imageUpload.addEventListener('change', function(e) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                imageCanvas.width = img.width;
                imageCanvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                imageCanvas.style.display = 'block';
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    });

    imageCanvas.addEventListener('click', function(e) {
        const rect = imageCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (imageCanvas.width / rect.width);
        const y = (e.clientY - rect.top) * (imageCanvas.height / rect.height);
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const hex = "#" + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1);
        colorInput.value = hex;
        updateEverything(hex);
    });

    function saveColor() {
        const swatch = document.createElement('div');
        swatch.className = 'swatch-item';
        swatch.style.background = colorInput.value;
        swatch.onclick = () => { 
            const hex = rgbToHexFromStr(swatch.style.backgroundColor);
            colorInput.value = hex; 
            updateEverything(hex); 
        };
        paletteList.appendChild(swatch);
    }

    function copyText(id) {
        const text = document.getElementById(id).innerText;
        navigator.clipboard.writeText(text);
        const el = document.getElementById(id);
        const ori = el.innerText;
        el.innerText = "COPIED!";
        setTimeout(() => el.innerText = ori, 1000);
    }

    categories.forEach(cat => {
        const dot = document.createElement('div');
        dot.className = `cat-dot ${cat.id === 'all' ? 'active' : ''}`;
        dot.style.background = cat.color;
        dot.onclick = () => {
            document.querySelectorAll('.cat-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            currentCategory = cat.id;
            catLabel.innerText = cat.name.toUpperCase();
        };
        catSlider.appendChild(dot);
    });

    colorInput.addEventListener('input', (e) => updateEverything(e.target.value));
    updateEverything(colorInput.value);