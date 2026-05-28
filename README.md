# CodingAgentTradingApp

A static web-based trading dashboard that shows next-day buy/sell recommendations for **Equity** stocks and **F&O** (Futures & Options) instruments, tailored to a daily investment budget of **₹100–₹500**.

## Features

- **Investment Slider** – Set your daily budget between ₹100 and ₹500. Card quantities and P&L figures update live.
- **Recommendation Cards** – Each card shows the instrument, BUY/SELL signal, entry price, target, stop loss, suggested quantity, expected gain, and maximum loss.
- **Why This Recommendation popup** – Click *"💡 Why this recommendation?"* on any card to open a modal with a detailed technical-analysis summary and a numbered list of reasons behind the call.
- **Filters** – Filter by type (All / Equity / F&O) and action (All / Buy / Sell).
- **Summary Bar** – At-a-glance count of total picks, buy signals, and sell signals.

## Running Locally

```bash
# From the repository root:
python3 -m http.server 8000
```

Then open **http://localhost:8000** in your browser.

> No build step or dependencies required – it is a pure HTML/CSS/JavaScript app.

## Disclaimer

All data shown is **simulated and for educational purposes only**. This is not financial advice. Please consult a SEBI-registered investment advisor before making any trades.
