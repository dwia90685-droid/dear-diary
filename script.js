
const STORAGE_KEY = "berryMatchaData";

let data = {
  journals: [],
  moods: [],
  reflections: [],
  thoughts: []
};

let selectedJournalMood = "😊 Senang";
let selectedMood = null;

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);

      data = {
        journals: Array.isArray(parsed.journals) ? parsed.journals : [],
        moods: Array.isArray(parsed.moods) ? parsed.moods : [],
        reflections: Array.isArray(parsed.reflections) ? parsed.reflections : [],
        thoughts: Array.isArray(parsed.thoughts) ? parsed.thoughts : []
      };
    }
  } catch (error) {
    console.error("Gagal membaca data:", error);
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    updateAll();
    return true;
  } catch (error) {
    alert("Penyimpanan gagal. Coba periksa ruang penyimpanan browser.");
    return false;
  }
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function getDate() {
  return new Date().toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function enterApp() {
  document.getElementById("opening").classList.add("hide");
  document.getElementById("app").classList.add("visible");
  updateAll();
}

const pageTitles = {
  home: "A little hello, lovely soul ♡",
  journal: "Your private diary ♡",
  mood: "Understand your feelings ☁",
  reflection: "A moment with yourself ✿",
  thoughts: "Inside your mind ✎",
  growth: "Your journey matters 🌷"
};

function showPage(page) {
  document.querySelectorAll(".page").forEach(item => {
    item.classList.remove("active");
  });

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
  });

  const target = document.getElementById(page);
  if (!target) return;

  target.classList.add("active");

  const nav = document.querySelector(
    `.nav-item[data-page="${page}"]`
  );

  if (nav) nav.classList.add("active");

  document.getElementById("pageHeading").textContent =
    pageTitles[page] || "Berry Matcha";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateDate() {
  document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
}

function updateStats() {
  document.getElementById("journalCount").textContent = data.journals.length;
  document.getElementById("moodCount").textContent = data.moods.length;
  document.getElementById("reflectionCount").textContent = data.reflections.length;

  document.getElementById("growthJournal").textContent = data.journals.length;
  document.getElementById("growthMood").textContent = data.moods.length;
  document.getElementById("growthReflection").textContent = data.reflections.length;
}

function updateAll() {
  updateStats();
  renderJournals();
  renderMoods();
  renderReflections();
  renderThoughts();
  renderRecent();
}

function quickMood(name, emoji) {
  selectedMood = { name, emoji };

  showPage("mood");

  document.querySelectorAll(".mood-picker button").forEach(button => {
    button.classList.toggle(
      "selected",
      button.textContent.includes(name)
    );
  });

  document.getElementById("selectedMood").textContent =
    `${emoji} Kamu memilih perasaan: ${name}`;
}

function selectMood(name, emoji, button) {
  selectedMood = { name, emoji };

  document.querySelectorAll(".mood-picker button").forEach(item => {
    item.classList.remove("selected");
  });

  button.classList.add("selected");

  document.getElementById("selectedMood").textContent =
    `${emoji} Kamu memilih perasaan: ${name}`;
}

function saveMood() {
  if (!selectedMood) {
    showToast("Pilih perasaanmu terlebih dahulu 🌷");
    return;
  }

  data.moods.unshift({
    id: Date.now(),
    name: selectedMood.name,
    emoji: selectedMood.emoji,
    note: document.getElementById("moodNote").value.trim(),
    date: getDate()
  });

  if (saveData()) {
    document.getElementById("moodNote").value = "";
    selectedMood = null;
    document.getElementById("selectedMood").textContent =
      "Belum ada perasaan yang dipilih.";

    document.querySelectorAll(".mood-picker button").forEach(item => {
      item.classList.remove("selected");
    });

    showToast("Perasaanmu berhasil disimpan ♡");
  }
}

document.querySelectorAll("#journalMoods button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll("#journalMoods button").forEach(item => {
      item.classList.remove("selected");
    });

    button.classList.add("selected");
    selectedJournalMood = button.dataset.mood;
  });
});

function saveJournal() {
  const title = document.getElementById("journalTitle").value.trim();
  const story = document.getElementById("journalText").value.trim();
  const need = document.getElementById("journalNeed").value.trim();

  if (!title || !story) {
    showToast("Isi judul dan cerita terlebih dahulu 🌷");
    return;
  }

  data.journals.unshift({
    id: Date.now(),
    title,
    story,
    need,
    mood: selectedJournalMood,
    date: getDate()
  });

  if (saveData()) {
    document.getElementById("journalTitle").value = "";
    document.getElementById("journalText").value = "";
    document.getElementById("journalNeed").value = "";
    showToast("Cerita berhasil disimpan ♡");
  }
}

function renderJournals() {
  const list = document.getElementById("journalList");

  if (!data.journals.length) {
    list.innerHTML = '<div class="empty-state">Belum ada cerita tersimpan. Mulai tulis kisahmu 🌷</div>';
    return;
  }

  list.innerHTML = data.journals.map(item => `
    <article class="story-card">
      <div class="story-meta">${escapeHTML(item.date)} · ${escapeHTML(item.mood)}</div>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.story)}</p>
      ${item.need ? `<div class="need">♡ Yang dibutuhkan: ${escapeHTML(item.need)}</div>` : ""}
      <button class="delete-button" onclick="deleteItem('journals',${item.id})">Hapus cerita</button>
    </article>
  `).join("");
}

function renderRecent() {
  const list = document.getElementById("recentStories");
  const recent = data.journals.slice(0, 3);

  if (!recent.length) {
    list.innerHTML = '<div class="empty-state">Belum ada cerita. Yuk, tulis cerita pertamamu! 🌷</div>';
    return;
  }

  list.innerHTML = recent.map(item => `
    <div class="recent-item">
      <span>📖</span>
      <div>
        <h4>${escapeHTML(item.title)}</h4>
        <small>${escapeHTML(item.date)}</small>
      </div>
    </div>
  `).join("");
}

function renderMoods() {
  const list = document.getElementById("moodList");

  if (!data.moods.length) {
    list.innerHTML = '<div class="empty-state">Catatan perasaanmu akan muncul di sini ☁</div>';
    return;
  }

  list.innerHTML = data.moods.map(item => `
    <article class="record-card">
      <div class="record-top">
        <h3>${escapeHTML(item.emoji)} ${escapeHTML(item.name)}</h3>
        <small>${escapeHTML(item.date)}</small>
      </div>
      <p>${escapeHTML(item.note || "Tidak ada catatan tambahan.")}</p>
      <button class="delete-button" onclick="deleteItem('moods',${item.id})">Hapus catatan</button>
    </article>
  `).join("");
}

function saveReflection() {
  const answers = [
    document.getElementById("ref1").value.trim(),
    document.getElementById("ref2").value.trim(),
    document.getElementById("ref3").value.trim(),
    document.getElementById("ref4").value.trim()
  ];

  if (!answers.some(Boolean)) {
    showToast("Isi setidaknya satu jawaban 🌷");
    return;
  }

  data.reflections.unshift({
    id: Date.now(),
    answers,
    date: getDate()
  });

  if (saveData()) {
    answers.forEach((_, index) => {
      document.getElementById(`ref${index + 1}`).value = "";
    });

    showToast("Refleksi berhasil disimpan ♡");
  }
}

function renderReflections() {
  const list = document.getElementById("reflectionList");

  if (!data.reflections.length) {
    list.innerHTML = '<div class="empty-state">Refleksi dirimu akan tersimpan di sini ✿</div>';
    return;
  }

  const questions = [
    "Hal kecil yang membuatku bahagia",
    "Hal yang cukup sulit akhir-akhir ini",
    "Pesan untuk diriku sendiri",
    "Hal yang aku syukuri"
  ];

  list.innerHTML = data.reflections.map(item => `
    <article class="record-card">
      <div class="record-top">
        <h3>♡ My reflection</h3>
        <small>${escapeHTML(item.date)}</small>
      </div>
      ${item.answers.map((answer, index) => answer ? `
        <p><strong>${questions[index]}</strong><br>${escapeHTML(answer)}</p>
        <br>
      ` : "").join("")}
      <button class="delete-button" onclick="deleteItem('reflections',${item.id})">Hapus refleksi</button>
    </article>
  `).join("");
}

function saveThought() {
  const text = document.getElementById("thoughtText").value.trim();

  if (!text) {
    showToast("Tulis sesuatu terlebih dahulu ✎");
    return;
  }

  data.thoughts.unshift({
    id: Date.now(),
    text,
    date: getDate()
  });

  if (saveData()) {
    document.getElementById("thoughtText").value = "";
    showToast("Catatan berhasil disimpan ♡");
  }
}

function renderThoughts() {
  const list = document.getElementById("thoughtList");

  if (!data.thoughts.length) {
    list.innerHTML = '<div class="empty-state">Pikiran yang kamu tulis akan muncul di sini 🌷</div>';
    return;
  }

  list.innerHTML = data.thoughts.map(item => `
    <article class="record-card">
      <div class="record-top">
        <h3>✎ Little thought</h3>
        <small>${escapeHTML(item.date)}</small>
      </div>
      <p>${escapeHTML(item.text)}</p>
      <button class="delete-button" onclick="deleteItem('thoughts',${item.id})">Hapus catatan</button>
    </article>
  `).join("");
}

function deleteItem(category, id) {
  if (!confirm("Yakin ingin menghapus catatan ini?")) return;

  data[category] = data[category].filter(item => item.id !== id);

  if (saveData()) {
    showToast("Catatan berhasil dihapus.");
  }
}

function exportData() {
  const file = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
  link.download = "berry-matcha-backup.json";
  link.click();

  URL.revokeObjectURL(url);
  showToast("Data berhasil diunduh ♡");
}

loadData();
updateDate();
updateAll();
