# CodingAgentTradingApp

A lightweight trading research workspace for tracking **US** and **India** market ideas in one place.

## What this app does

- Provides separate screens for **US Market**, **India Market**, and **Reports**
- Gives you **20 equity research slots** and **20 futures/options research slots** for each market
- Lets you record your own entry ideas, capital plans, targets, stop levels, and exit notes
- Stores everything locally in your browser so you can keep a running journal
- Calculates **hypothetical next-day / paper-trade P&L** from the trades you log
- Exports research tables and journal data to **CSV** so you can open them in Excel

## Important note

This app is an **educational research and paper-trading tracker**. It does **not** provide guaranteed predictions, personalized investment advice, or loss-free trading outcomes.

## How to run

Because the project is a static web app, you can run it with any simple local web server.

### Option 1: Python

```bash
cd /tmp/workspace/milindbansode/CodingAgentTradingApp
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Option 2: Open directly

You can also open `/tmp/workspace/milindbansode/CodingAgentTradingApp/index.html` in a browser.

## Data storage

- Research boards and journal entries are stored in `localStorage` in your browser
- Use the export buttons in the app to download **CSV** files for Excel-based tracking
