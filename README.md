# maratonPlan

## Overview
A minimal ubuntu-inspired terminal-like viewer for training plans stored in CSV files. It is intended for my personal (Swedish) use and only accepts Swedish column headers.

## CSV format
Your CSV must include these headers:

- **Datum** (required): date in `YYYY-MM-DD` format.
  - Aliases supported for date only: `Datum`, `datum`, `Date`, `date`.
- **Pass** (required): description of the workout. (Swedish header required)
- **Veckodag** (required): day of week (e.g., Mån, Tis, ...). (Swedish header required)
- **Vecka** (optional): week number.

Example CSV:
```csv
Datum,Veckodag,Pass,Vecka
2025-09-12,Fre,Löpning distans 8 km,37
```

## Usage
- Visit [samuelwidlund.com/maratonPlan](https://samuelwidlund.com/maratonPlan).
- Type `browse` to select your CSV file.
- Type `help` to list available commands.

### Commands
```text
help    - list available commands
browse  - open file picker to select a CSV
clear   - clear terminal output
exit    - hide the file picker/output
```

### Examples
```bash
ubuntu@trainingplan:~$ help
ubuntu@trainingplan:~$ browse
```

## Deployment
Static site, no build step. Update the hosted files and you're done.

1) Update files locally (HTML/CSS/JS), commit changes.
2) Upload to your server path for `samuelwidlund.com/maratonPlan`.

Examples:
```bash
# rsync (recommended)
rsync -avz --delete \
  index.html style.css scripts.js img/ \
  youruser@your.server:/var/www/samuelwidlund.com/maratonPlan/

# scp (simple)
scp index.html style.css scripts.js youruser@your.server:/var/www/samuelwidlund.com/maratonPlan/
scp -r img youruser@your.server:/var/www/samuelwidlund.com/maratonPlan/
```

Cache busting tip: browsers may cache `scripts.js`/`style.css`. If needed, append a version query in `index.html`, e.g. `scripts.js?v=2` and `style.css?v=2`.

## Notes
- The app stores the parsed CSV in `localStorage` under the key `csvData`.
- Mobile Safari styling quirks are minimized with CSS adjustments.

## Backlog
- fix padding bug on iOS Safari input
- fix example of csv, wrong format with Vecka

## Icons
<a target="_blank" href="https://icons8.com/icon/9769/exercise">Exercise</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
