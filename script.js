
// DATA PENYIMPANAN
let diaries = JSON.parse(localStorage.getItem("happyDiaries") || "[]");
let moods = JSON.parse(localStorage.getItem("happyMoods") || "[]");

const quotes = [
    "Kamu tidak harus selalu kuat. Tidak apa-apa beristirahat. 💗",
    "Langkah kecil tetap merupakan sebuah kemajuan. 🌷",
    "Jangan terlalu keras kepada dirimu sendiri. 🌸",
    "Kamu layak mendapatkan waktu untuk beristirahat. 🍃",
    "Hari yang sulit bukan berarti hidupmu buruk. 💕"
];

// TANGGAL
document.getElementById("today").textContent =
    new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

document.getElementById("quoteText").textContent =
    quotes[Math.floor(Math.random() * quotes.length)];

// NAVIGASI
function showPage(page) {
    document.querySelectorAll(".page").forEach(item => {
        item.classList.remove("active");
    });

    document.getElementById(page).classList.add("active");

    document.querySelectorAll(".nav").forEach(item => {
        item.classList.toggle("active", item.dataset.page === page);
    });

    if (page === "diary") renderDiaries();
    if (page === "mood") renderMoods();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".nav").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

// FUNGSI PENYIMPANAN
function saveData() {
    localStorage.setItem("happyDiaries", JSON.stringify(diaries));
    localStorage.setItem("happyMoods", JSON.stringify(moods));
}

// DIARY
function saveDiary() {
    const title = document.getElementById("diaryTitle").value.trim();
    const mood = document.getElementById("diaryMood").value;
    const content = document.getElementById("diaryContent").value.trim();

    if (!title || !content) {
        alert("Isi judul dan cerita diary terlebih dahulu ya! 🌸");
        return;
    }

    diaries.unshift({
        id: Date.now(),
        title,
        mood,
        content,
        date: new Date().toLocaleString("id-ID")
    });

    saveData();

    document.getElementById("diaryTitle").value = "";
    document.getElementById("diaryContent").value = "";

    renderDiaries();
    updateStats();

    alert("Diary berhasil disimpan! 💗");
}

function renderDiaries() {
    const list = document.getElementById("diaryList");

    if (diaries.length === 0) {
        list.innerHTML = "<p>Belum ada cerita. Yuk, tulis diary pertamamu! 🌷</p>";
        return;
    }

    list.innerHTML = diaries.map(item => `
        <div class="diary-item">
            <h3>${escapeHTML(item.title)}</h3>
            <small>${escapeHTML(item.date)} · ${escapeHTML(item.mood)}</small>
            <p>${escapeHTML(item.content)}</p>
            <button class="delete-btn" onclick="deleteDiary(${item.id})">
                Hapus catatan
            </button>
        </div>
    `).join("");
}

function deleteDiary(id) {
    if (!confirm("Yakin ingin menghapus catatan ini?")) return;

    diaries = diaries.filter(item => item.id !== id);
    saveData();
    renderDiaries();
    updateStats();
}

// MOOD TRACKER
function chooseMood(emoji, name) {
    moods.unshift({
        id: Date.now(),
        emoji,
        name,
        date: new Date().toLocaleString("id-ID")
    });

    saveData();
    renderMoods();
    updateStats();

    document.getElementById("moodFeedback").textContent =
        `Kamu memilih ${emoji} ${name}. Terima kasih sudah mengenali perasaanmu hari ini. 💗`;
}

function renderMoods() {
    const history = document.getElementById("moodHistory");

    if (moods.length === 0) {
        history.innerHTML = "<p>Belum ada mood yang dicatat.</p>";
        return;
    }

    history.innerHTML = moods.map(item => `
        <div class="history-item">
            <p>${item.emoji} ${escapeHTML(item.name)}</p>
            <small>${escapeHTML(item.date)}</small>
        </div>
    `).join("");
}

// DASHBOARD
function updateStats() {
    document.getElementById("diaryCount").textContent = diaries.length;
    document.getElementById("moodCount").textContent = moods.length;
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// TEMAN CURHAT OTOMATIS
function sendMessage() {
    const input = document.getElementById("chatInput");
    const text = input.value.trim();

    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    setTimeout(() => {
        addMessage(getReply(text), "bot");
    }, 500);
}

function addMessage(text, type) {
    const messages = document.getElementById("messages");
    const message = document.createElement("div");

    message.className = `message ${type}`;
    message.textContent = text;

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

function getReply(text) {
    const message = text.toLowerCase();

    if (
        /bunuh diri|ingin mati|mengakhiri hidup|menyakiti diri|melukai diri|tidak ingin hidup/.test(message)
    ) {
        return "Aku ikut prihatin kamu sedang menghadapi hal seberat ini. Kamu tidak perlu menghadapinya sendirian. Tolong segera ceritakan keadaanmu kepada orang dewasa yang kamu percaya, seperti orang tua, guru BK, atau anggota keluarga. Jika kamu merasa tidak aman sekarang, segera minta bantuan langsung dari orang di dekatmu atau layanan darurat setempat. 💗";
    }

    if (/sedih|nangis|kecewa|kehilangan|sendiri/.test(message)) {
        return "Terima kasih sudah mau bercerita. Sedih dan kecewa adalah perasaan yang boleh kamu rasakan. Kamu tidak harus memaksakan diri untuk baik-baik saja. Cobalah cerita kepada seseorang yang kamu percaya juga ya. 🌷";
    }

    if (/cemas|takut|khawatir|panik|overthinking/.test(message)) {
        return "Sepertinya pikiranmu sedang terasa penuh. Yuk, berhenti sebentar dan ambil napas dengan nyaman. Coba fokus pada satu hal kecil yang bisa kamu lakukan sekarang. Kamu tidak harus menyelesaikan semuanya sekaligus. 🍃";
    }

    if (/marah|kesal|emosi|jengkel/.test(message)) {
        return "Tidak apa-apa merasa marah. Beri dirimu waktu untuk menenangkan pikiran sebelum mengambil keputusan. Kamu bisa menuliskan apa yang membuatmu kesal agar lebih mudah memahaminya. 💗";
    }

    if (/capek|lelah|bosan|burnout/.test(message)) {
        return "Kedengarannya kamu sedang membutuhkan waktu untuk beristirahat. Tidak apa-apa mengambil jeda dan mengerjakan sesuatu secara perlahan. Istirahat juga bagian dari proses. 🌼";
    }

    if (/senang|bahagia|berhasil|berhasil|gembira/.test(message)) {
        return "Wah, senang mendengarnya! 🥰 Jangan lupa menghargai hal-hal baik yang terjadi hari ini. Kamu boleh bangga dengan pencapaianmu, sekecil apa pun itu!";
    }

    if (/terima kasih|makasih/.test(message)) {
        return "Sama-sama! 💗 Terima kasih juga sudah mempercayakan ceritamu di Happy Diary. Semoga harimu terasa lebih ringan.";
    }

    return "Terima kasih sudah berbagi cerita denganku. 🌸 Perasaanmu layak didengarkan. Coba ceritakan lebih lanjut apa yang paling mengganggu pikiranmu, atau pikirkan satu hal kecil yang bisa membuat keadaan sedikit lebih nyaman.";
}

// LATIHAN PERNAPASAN
let breathingTimer = null;
let breathingRunning = false;

function startBreathing() {
    const circle = document.getElementById("breathCircle");
    const text = document.getElementById("breathText");
    const button = document.getElementById("breathButton");

    if (breathingRunning) {
        clearInterval(breathingTimer);
        breathingRunning = false;
        circle.classList.remove("expand");
        circle.textContent = "Siap?";
        text.textContent = "Latihan dihentikan. Kamu bisa beristirahat.";
        button.textContent = "Mulai lagi";
        return;
    }

    breathingRunning = true;
    button.textContent = "Hentikan";

    let step = 0;
    const phases = [
        { label: "Tarik napas", duration: 4, expand: true },
        { label: "Keluarkan napas", duration: 6, expand: false }
    ];

    function nextPhase() {
        if (!breathingRunning) return;

        const phase = phases[step % 2];
        let seconds = phase.duration;

        circle.classList.toggle("expand", phase.expand);
        circle.textContent = seconds;
        text.textContent = phase.label;

        breathingTimer = setInterval(() => {
            seconds--;
            circle.textContent = seconds;

            if (seconds <= 0) {
                clearInterval(breathingTimer);
                step++;
                nextPhase();
            }
        }, 1000);
    }

    nextPhase();
}

// AWAL HALAMAN
renderDiaries();
renderMoods();
updateStats();
