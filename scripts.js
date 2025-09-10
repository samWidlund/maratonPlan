
// variables
let currentTime = ""; // full time
let showWeek = false; // if false show todays date
const CSV_STORAGE_KEY = 'csvData';

// date and time
function pad(value) {
    return String(value).padStart(2, '0');
}

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
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    // calc week start (monday)
    const dayOfWeek = now.getDay(); // 0 = söndag, 1 = måndag
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    const weekStart = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
    
    // calc week end (sunday)
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const weekEnd = `${sunday.getFullYear()}-${String(sunday.getMonth() + 1).padStart(2, '0')}-${String(sunday.getDate()).padStart(2, '0')}`;

    const filtered = Array.isArray(data)
        ? data.filter(row => {
            const raw = row?.Datum ?? row?.datum ?? row?.Date ?? row?.date;
            if (!raw) return false;
            const s = String(raw).trim();
            const key = s.slice(0, 10).replace(/\//g, '-');
            
            if (showWeek) {
                // show week: date between monday and sunday
                return key >= weekStart && key <= weekEnd;
            } else {
                // show only todays date
                return key === today;
            }
        })
        : [];

    const out = document.getElementById('output');
    if (out) out.innerText = JSON.stringify(filtered, null, 2);

    // console log filtered data
    console.log('Visad data:', filtered);
    const todaysTraining = data.find(row => row.Datum === today);

    // use this to display the current training and info
    const todayElement = document.getElementById('trainingToday');
    const dayElement = document.getElementById('dayToday')
    if (todaysTraining) {
        console.log('Dagens träning:', todaysTraining.Pass);
        if (todayElement) {
            todayElement.innerText = todaysTraining.Pass;
            dayElement.innerText = todaysTraining.Veckodag;
        } 
    }
}

// toggle function to switch between day/week
function toggleView() {
    showWeek = !showWeek;
    const saved = localStorage.getItem(CSV_STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            renderCsvData(parsed);
        } catch (e) {
            console.warn('Kunde inte läsa sparad CSV från localStorage', e);
        }
    }
    
    // update button text
    const toggleBtn = document.getElementById('toggleView');
    if (toggleBtn) {
        toggleBtn.textContent = showWeek ? 'Show today' : 'Show week';
    }
}

// load saved csv on page load
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

                // render csv data
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

const inputTerminal = document.getElementById('inputTerminal');
const outputTerminal = document.getElementById('outputTerminal');
const outputContainer = document.getElementById('outputContainer');

inputTerminal.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;

    const inputEl = e.currentTarget;
    const terminal = inputEl.value.trim().toLowerCase();

    switch (terminal) {
        case 'browse':
            outputContainer.style.display = 'inherit';
            const fileInputEl = document.getElementById('fileInput');
            if (fileInputEl) {
                fileInputEl.click();
            }
            break
        case 'help':
            outputTerminal.textContent = 'INFO\n\tInclude following columns:\n\t<Vecka,Datum,Veckodag,Pass>\n\nCOMMANDS\n\tbrowse - chooses an input file\n\tclear  - clears the output\n\texit   - exit training plan\n\thelp   - lists available commands';            
            break;
        case 'exit':
            outputContainer.style.display = 'none';
            break;
        case 'clear':
            outputTerminal.textContent = '';
            break;
        default:
            outputTerminal.textContent = `unknown command: ${terminal}`;
            break;
    }

    inputEl.value = '';
});



updateTime();
setInterval(updateTime, 1000);
