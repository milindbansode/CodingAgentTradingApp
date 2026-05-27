const { v4: uuidv4 } = require('uuid');

// Initial stock data with simulated prices
const stocks = {
  AAPL: { symbol: 'AAPL', name: 'Apple Inc.', price: 182.5, change: 1.2, changePercent: 0.66 },
  GOOGL: { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.8, change: -0.5, changePercent: -0.35 },
  MSFT: { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.9, change: 2.1, changePercent: 0.56 },
  AMZN: { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 185.3, change: -1.3, changePercent: -0.70 },
  TSLA: { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.4, change: 5.6, changePercent: 2.31 },
  NVDA: { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.2, change: 12.4, changePercent: 1.44 },
  META: { symbol: 'META', name: 'Meta Platforms Inc.', price: 503.1, change: 3.8, changePercent: 0.76 },
  NFLX: { symbol: 'NFLX', name: 'Netflix Inc.', price: 622.7, change: -4.2, changePercent: -0.67 },
};

// Portfolio: cash balance + holdings
const portfolio = {
  cash: 100000.00,
  holdings: {},
};

// Order history
const orders = [];

// Simulate slight price changes over time
function simulatePriceMovement() {
  Object.keys(stocks).forEach(symbol => {
    const stock = stocks[symbol];
    const changePercent = (Math.random() - 0.5) * 2; // -1% to +1%
    const priceChange = stock.price * (changePercent / 100);
    stock.price = Math.max(1, parseFloat((stock.price + priceChange).toFixed(2)));
    stock.change = parseFloat(priceChange.toFixed(2));
    stock.changePercent = parseFloat(changePercent.toFixed(2));
  });
}

if (process.env.NODE_ENV !== 'test') {
  setInterval(simulatePriceMovement, 5000);
}

// Store operations
const store = {
  getStocks() {
    return Object.values(stocks);
  },

  getStock(symbol) {
    return stocks[symbol.toUpperCase()] || null;
  },

  getPortfolio() {
    const holdingsWithValue = {};
    let totalValue = portfolio.cash;
    Object.keys(portfolio.holdings).forEach(symbol => {
      const quantity = portfolio.holdings[symbol];
      const stock = stocks[symbol];
      const currentPrice = stock ? stock.price : 0;
      const marketValue = currentPrice * quantity;
      holdingsWithValue[symbol] = {
        symbol,
        name: stock ? stock.name : symbol,
        quantity,
        averageCost: getAverageCost(symbol),
        currentPrice,
        marketValue,
        gainLoss: marketValue - getAverageCost(symbol) * quantity,
      };
      totalValue += marketValue;
    });
    return {
      cash: parseFloat(portfolio.cash.toFixed(2)),
      holdings: holdingsWithValue,
      totalValue: parseFloat(totalValue.toFixed(2)),
    };
  },

  placeOrder(symbol, type, quantity) {
    const sym = symbol.toUpperCase();
    const stock = stocks[sym];
    if (!stock) {
      return { success: false, error: `Stock ${sym} not found` };
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return { success: false, error: 'Quantity must be a positive integer' };
    }

    const price = stock.price;
    const total = price * quantity;

    if (type === 'BUY') {
      if (portfolio.cash < total) {
        return { success: false, error: 'Insufficient funds' };
      }
      portfolio.cash -= total;
      portfolio.holdings[sym] = (portfolio.holdings[sym] || 0) + quantity;
      recordCost(sym, price, quantity);
    } else if (type === 'SELL') {
      const currentHolding = portfolio.holdings[sym] || 0;
      if (currentHolding < quantity) {
        return { success: false, error: `Insufficient shares. You own ${currentHolding} shares of ${sym}` };
      }
      portfolio.cash += total;
      portfolio.holdings[sym] -= quantity;
      if (portfolio.holdings[sym] === 0) {
        delete portfolio.holdings[sym];
        deleteCostBasis(sym);
      } else {
        reduceCostBasis(sym, quantity);
      }
    } else {
      return { success: false, error: 'Order type must be BUY or SELL' };
    }

    const order = {
      id: uuidv4(),
      symbol: sym,
      type,
      quantity,
      price,
      total: parseFloat(total.toFixed(2)),
      status: 'FILLED',
      createdAt: new Date().toISOString(),
    };
    orders.push(order);
    return { success: true, order };
  },

  getOrders() {
    return [...orders].reverse();
  },
};

// Cost basis tracking (simple average cost method)
const costBasis = new Map();

function recordCost(symbol, price, quantity) {
  if (!costBasis.has(symbol)) {
    costBasis.set(symbol, { totalCost: 0, totalShares: 0 });
  }
  const entry = costBasis.get(symbol);
  entry.totalCost += price * quantity;
  entry.totalShares += quantity;
}

function reduceCostBasis(symbol, quantity) {
  if (costBasis.has(symbol)) {
    const entry = costBasis.get(symbol);
    const avgCost = entry.totalCost / entry.totalShares;
    entry.totalShares -= quantity;
    entry.totalCost = avgCost * entry.totalShares;
  }
}

function deleteCostBasis(symbol) {
  costBasis.delete(symbol);
}

function getAverageCost(symbol) {
  const entry = costBasis.get(symbol);
  if (!entry || entry.totalShares === 0) return 0;
  return parseFloat((entry.totalCost / entry.totalShares).toFixed(2));
}

module.exports = store;
