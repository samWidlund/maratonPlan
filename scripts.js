// date and time
function pad(value) {
    return String(value).padStart(2, '0');
}

const CSV_STORAGE_KEY = 'csvData'; // variable to store csv data as localStorage

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

function renderCsvData(data) {
    // compare againt todays date
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const filtered = Array.isArray(data)
        ? data.filter(row => {
            const raw = row?.Datum ?? row?.datum ?? row?.Date ?? row?.date;
            if (!raw) return false;
            const s = String(raw).trim();
            
            // take first 10 chars (YYYY-MM-DD) and normalize slashes
            const key = s.slice(0, 10).replace(/\//g, '-');
            return key === today;
        })
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
