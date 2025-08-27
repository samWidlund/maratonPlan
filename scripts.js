// date and time
function pad(value) {
    return String(value).padStart(2, '0');
}

let currentTime = ""; // full time
let currentWeek = 1;

function updateTime() {
    const now = new Date();
    const dateString = now.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });

    const dateEl = document.getElementById("date");
    const timeEl = document.getElementById("time");

    currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    if (dateEl) dateEl.textContent = dateString;
    if (timeEl) timeEl.textContent = currentTime;
}

// user upload csv file
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: function(results) {
                let data = results.data;
                
                // filter on "vecka" or "Vecka"
                data = data.filter(row => Number(row.vecka) === currentWeek || Number(row.Vecka) === currentWeek);
                document.getElementById('output').innerText = JSON.stringify(data, null, 2);
            },
            error: function(error) {
                console.error('Error parsing CSV:', error);
                document.getElementById('output').innerText = `Error parsing CSV: ${error}`;
            }
        });
    }
});

updateTime();
setInterval(updateTime, 1000);
