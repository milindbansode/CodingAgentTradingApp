# CodingAgentTradingApp

A full-stack simulated stock trading application built with Node.js/Express (backend) and React/Vite (frontend).

## Features

- 📊 **Market View** — Real-time simulated stock prices for 8 major stocks (AAPL, GOOGL, MSFT, AMZN, TSLA, NVDA, META, NFLX)
- 💼 **Portfolio** — Track your holdings, average cost, market value, and gain/loss
- 📝 **Trade** — Place buy and sell market orders instantly
- 🕐 **Order History** — Review all past trades
- 💰 **Starting cash** — $100,000 virtual dollars to trade with

## Project Structure

```
CodingAgentTradingApp/
├── backend/           # Node.js + Express REST API
│   ├── src/
│   │   ├── index.js         # App entry point
│   │   ├── data/store.js    # In-memory data store
│   │   └── routes/          # API route handlers
│   └── tests/api.test.js    # Jest tests
└── frontend/          # React + Vite SPA
    └── src/
        ├── App.jsx
        ├── services/api.js  # API client
        └── components/      # UI components
```

## Getting Started

### Prerequisites

- Node.js v18+
- npm

### Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Run the application

**Start the backend** (in one terminal):

```bash
cd backend
npm start
# Runs on http://localhost:3001
```

**Start the frontend** (in another terminal):

```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run tests

```bash
cd backend
npm test
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/stocks` | List all stocks |
| GET | `/api/stocks/:symbol` | Get a specific stock |
| GET | `/api/portfolio` | Get portfolio |
| GET | `/api/orders` | Get order history |
| POST | `/api/orders` | Place an order |

### Place Order Request Body

```json
{
  "symbol": "AAPL",
  "type": "BUY",
  "quantity": 10
}
```
