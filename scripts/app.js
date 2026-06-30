const input = document.getElementById("search");
const date = document.getElementById("date");
const time = document.getElementById("time");
const linkName = document.getElementById("linkName")
const linkUrl = document.getElementById("linkUrl")
const addBtn = document.getElementById("addLinkBtn");
const linksList = document.getElementById("linksList");
const links_element =  document.getElementById("links");
const toggleAddBtn = document.getElementById("toggleAddBtn");
const tasksList = document.getElementById("tasks");
const addTaskBtn = document.getElementById("add_task");
const monthYear = document.getElementById("monthYear");
const calendarGrid = document.getElementById("calendarGrid");

const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");



const defaultLinks = [
    { name: "GitHub", url: "https://github.com/" },
    { name: "YouTube", url: "https://www.youtube.com/" },
    { name: "ChatGPT", url: "https://chatgpt.com/" },
    { name: "Gmail", url: "https://mail.google.com/mail/u/0/#inbox" }
];

let links = JSON.parse(localStorage.getItem("links"));

if (!Array.isArray(links) || links.length === 0) {
    links = defaultLinks;
}

let currentDate = new Date();

function renderLinks() {
linksList.innerHTML = "";

links.forEach((link, index) => {
    const li = document.createElement("li");
    li.innerHTML = link.name;

    li.onclick = () => {
        window.open(link.url, "_blank");
    };

    li.oncontextmenu = (e) => {
        e.preventDefault();
        links.splice(index, 1);
        saveLinks();
    };

    linksList.appendChild(li);
});
}

function saveLinks() {
localStorage.setItem("links", JSON.stringify(links));
renderLinks();
}

addBtn.onclick = () => {
if (!linkName.value || !linkUrl.value) return;

let url = linkUrl.value.trim();
if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
}

links.push({
    name: linkName.value,
    url: url
});

linkName.value = "";
linkUrl.value = "";

saveLinks();
};

renderLinks();

/* --- Tasks --- */
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
    tasksList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.text;
        if (task.done) li.classList.add("done");

        li.onclick = () => {
            tasks[index].done = !tasks[index].done;
            saveTasks();
        };

        li.oncontextmenu = (e) => {
            e.preventDefault();
            tasks.splice(index, 1);
            saveTasks();
        };

        tasksList.appendChild(li);
    });
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

addTaskBtn.onclick = () => {
    const text = prompt("New task:");
    if (!text) return;
    tasks.push({ text, done: false });
    saveTasks();
};

renderTasks();

function Search() {
    const query = input.value.trim();
    if (!query) return;

    if (query.startsWith("/git ")) {
        const gitQuery = query.replace("/git ", "");
        window.location.href =
            `https://github.com/search?q=${encodeURIComponent(gitQuery)}&type=repositories`;
        return;
    }

    else if (query.startsWith("/ytb ")){
        const ytbQuery = query.replace("/ytb ", "")
        window.location.href = 
            `https://www.youtube.com/results?search_query=${encodeURIComponent(ytbQuery)}`;
        return;
    }

    else if (query.startsWith("/r ")){
        const rQuery = query.replace("/r ", "")
        window.location.href = 
            `https://www.reddit.com/search/?q=${encodeURIComponent(rQuery)}`;
        return;
    }

    else if (query.startsWith("/mail")){
        window.location.href = 
            `https://mail.google.com/mail/u/0/#inbox`;
        return;
    }

    else if (query.startsWith("/chat ")) {
        const text = query.replace("/chat ", "");

        window.location.href =
            `https://chatgpt.com/?q=${encodeURIComponent(text)}`;
        return;
    }

    window.location.href =
        `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function updateClock() {
    const now = new Date();
    date.innerText = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    time.innerText = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function show_add(){
    links_element.hidden = !links_element.hidden;
    toggleAddBtn.innerText = links_element.hidden ? "Add link" : "Close";
}

async function getWeather() {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
            const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
            );

            if (!res.ok) {
                throw new Error("Weather request failed");
            }

            const data = await res.json();

            const temp = data.current_weather.temperature;

            document.getElementById("weather").innerText =
            `${temp}°C`;
        } catch (err) {
            document.getElementById("weather").innerText =
            "Weather unavailable";
        }
    }, () => {
        document.getElementById("weather").innerText =
        "Location permission denied";
    }

    );
}
getWeather();
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        Search();
    }
});

function renderCalendar(date) {
    calendarGrid.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();

    monthYear.innerText = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    });

    // empty slots
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        calendarGrid.appendChild(empty);
    }

    // days
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("div");
        cell.classList.add("day");
        cell.innerText = day;

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            cell.classList.add("today");
        }

        calendarGrid.appendChild(cell);
    }
}

prevMonthBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
};

nextMonthBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
};

renderCalendar(currentDate);

updateClock();
setInterval(updateClock, 1000);