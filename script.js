
const STORAGE_KEY = "dearDiaryEntries";

let diaries = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const form = document.getElementById("diary-form");
const titleInput = document.getElementById("diary-title");
const dateInput = document.getElementById("diary-date");
const moodInput = document.getElementById("diary-mood");
const contentInput = document.getElementById("diary-content");
const editInput = document.getElementById("edit-id");

function saveStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(diaries));
}

function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function formatDate(date) {
    if (!date) return "-";

    return new Date(date + "T00:00:00").toLocaleDateString(
        "id-ID",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}

function renderDiary(list, elementId) {
    const container = document.getElementById(elementId);

    if (list.length === 0) {
        container.innerHTML = `
            <div class="empty">
                <div style="font-size:40px">🌷</div>
                <p>Belum ada cerita di sini.</p>
                <small>Yuk, mulai tulis diary pertamamu!</small>
            </div>
        `;
        return;
    }

    container.innerHTML = list.map(diary => `
        <article class="diary-card">
            <div class="mood">${escapeHTML(diary.mood)}</div>

            <h3>${escapeHTML(diary.title)}</h3>

            <div class="diary-date">
                📅 ${formatDate(diary.date)}
            </div>

            <p class="diary-text">
                ${escapeHTML(diary.content)}
            </p>

            <div class="card-actions">
                <button class="edit-btn"
                    data-action="edit"
                    data-id="${diary.id}">
                    ✏️ Edit
                </button>

                <button class="delete-btn"
                    data-action="delete"
                    data-id="${diary.id}">
                    🗑️ Hapus
                </button>
            </div>
        </article>
    `).join("");
}

function updateDashboard() {
    const sorted = [...diaries].sort((a, b) =>
        b.date.localeCompare(a.date)
    );

    const currentMonth = new Date().toISOString().slice(0, 7);

    const monthEntries = diaries.filter(diary =>
        diary.date.startsWith(currentMonth)
    );

    document.getElementById("total-diary").textContent =
        diaries.length;

    document.getElementById("month-diary").textContent =
        monthEntries.length;

    document.getElementById("latest-diary").textContent =
        sorted.length ? formatDate(sorted[0].date) : "-";

    renderDiary(sorted.slice(0, 4), "recent-list");
    renderDiary(sorted, "all-list");
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const date = dateInput.value;
    const mood = moodInput.value;
    const content = contentInput.value.trim();

    if (!title || !date || !content) {
        showToast("Lengkapi semua data diary!");
        return;
    }

    if (editInput.value) {
        const index = diaries.findIndex(diary =>
            diary.id === Number(editInput.value)
        );

        if (index !== -1) {
            diaries[index] = {
                ...diaries[index],
                title,
                date,
                mood,
                content
            };
        }

        showToast("Diary berhasil diperbarui! ♡");

    } else {
        diaries.push({
            id: Date.now(),
            title,
            date,
            mood,
            content
        });

        showToast("Diary berhasil disimpan! 🌷");
    }

    saveStorage();
    updateDashboard();

    form.reset();
    editInput.value = "";
    document.getElementById("save-btn").textContent =
        "Simpan Diary ♡";

    location.hash = "entries";
});

function editDiary(id) {
    const diary = diaries.find(item => item.id === id);

    if (!diary) return;

    editInput.value = diary.id;
    titleInput.value = diary.title;
    dateInput.value = diary.date;
    moodInput.value = diary.mood;
    contentInput.value = diary.content;

    document.getElementById("save-btn").textContent =
        "Perbarui Diary ♡";

    location.hash = "write";
    window.scrollTo(0, 0);
}

function deleteDiary(id) {
    const confirmDelete = confirm(
        "Yakin ingin menghapus diary ini?"
    );

    if (!confirmDelete) return;

    diaries = diaries.filter(item => item.id !== id);

    saveStorage();
    updateDashboard();

    showToast("Diary berhasil dihapus!");
}

document.addEventListener("click", function(event) {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "edit") {
        editDiary(id);
    }

    if (action === "delete") {
        deleteDiary(id);
    }
});

document.getElementById("search").addEventListener(
    "input",
    function() {
        const keyword = this.value.toLowerCase();

        const results = diaries.filter(diary =>
            diary.title.toLowerCase().includes(keyword) ||
            diary.content.toLowerCase().includes(keyword)
        );

        renderDiary(results, "all-list");
    }
);

form.addEventListener("reset", function() {
    setTimeout(() => {
        editInput.value = "";
        document.getElementById("save-btn").textContent =
            "Simpan Diary ♡";
    }, 0);
});

function updateNavigation() {
    const page = location.hash.replace("#", "") || "home";

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle(
            "active",
            link.dataset.page === page
        );
    });
}

window.addEventListener("hashchange", updateNavigation);

document.getElementById("today").textContent =
    new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

dateInput.value = new Date().toISOString().slice(0, 10);

updateDashboard();
updateNavigation();
