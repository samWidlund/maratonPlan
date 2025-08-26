// date and time
function pad(value) {
    return String(value).padStart(2, '0');
}

let currentTime = ""; // full time

function updateTime() {
    const now = new Date();
    const dateString = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    const dateEl = document.getElementById("date");
    const timeEl = document.getElementById("time");

    currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    if (dateEl) dateEl.textContent = dateString;
    if (timeEl) timeEl.textContent = currentTime;
}

updateTime();
setInterval(updateTime, 1000);
