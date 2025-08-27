// date and time
function pad(value) {
    return String(value).padStart(2, '0');
}

let currentTime = ""; // full time
let currentWeek = 1;
const CSV_STORAGE_KEY = 'csvData';

function updateTime() {
    const now = new Date();
    const dateString = now.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });

    const dateEl = document.getElementById("date");
    const timeEl = document.getElementById("time");

    currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    if (dateEl) dateEl.textContent = dateString;
    if (timeEl) timeEl.textContent = currentTime;
}

function renderCsvData(data) {

    // filter on week
    const filtered = Array.isArray(data)
        ? data.filter(row => Number(row?.vecka) === currentWeek || Number(row?.Vecka) === currentWeek)
        : [];
    
        const out = document.getElementById('output');
    if (out) out.innerText = JSON.stringify(filtered, null, 2);
}

// load saved csv file if it exists
try {
  const saved = localStorage.getItem(CSV_STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      renderCsvData(parsed);
    } else {
      console.warn('csvData är inte en array, rensar.');
      localStorage.removeItem(CSV_STORAGE_KEY);
    }
  }
} catch (e) {
  console.warn('Ogiltig JSON i csvData, rensar.', e);
  localStorage.removeItem(CSV_STORAGE_KEY);
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
                const allRows = results.data;

                // save dataset in localStorage
                try {
                    const newSerialized = JSON.stringify(allRows);
                    const existingSerialized = localStorage.getItem(CSV_STORAGE_KEY);
                    if (existingSerialized !== newSerialized) {
                        localStorage.setItem(CSV_STORAGE_KEY, newSerialized);
                    }
                }
                 catch (e) {
                    console.warn('Kunde inte spara CSV i localStorage (för stor data?)', e);
                }

                // render
                renderCsvData(allRows);
            },
            error: function(error) {
                console.error('Error parsing CSV:', error);
                const out = document.getElementById('output');
                if (out) out.innerText = `Error parsing CSV: ${error}`;
            }
        });
    }
});

updateTime();
setInterval(updateTime, 1000);
