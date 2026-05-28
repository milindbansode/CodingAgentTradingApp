// ─── Mock Market Data & Recommendation Engine ──────────────────────────────

const STOCKS = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    type: "Equity",
    price: 2942.55,
    action: "BUY",
    target: 3080.00,
    stopLoss: 2870.00,
    riskLevel: "Low",
    sector: "Energy / Conglomerate",
    analysis: {
      rsi: 58,
      macdSignal: "Bullish crossover",
      movingAvg: "Trading above 20-DMA and 50-DMA",
      volume: "Volume surge of 40% above 10-day average",
      support: 2870,
      resistance: 3080,
      trend: "Uptrend",
    },
    reasons: [
      "RSI at 58 indicates bullish momentum without being overbought.",
      "MACD bullish crossover on daily chart signals potential upward move.",
      "Price is trading above 20-DMA (₹2,890) and 50-DMA (₹2,825), confirming uptrend.",
      "Volume spike of 40% above average suggests strong buying interest.",
      "Strong support at ₹2,870; a break above ₹2,960 resistance opens the way to ₹3,080 target.",
      "Quarterly results beat expectations with 12% YoY revenue growth.",
    ],
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    type: "Equity",
    price: 1548.30,
    action: "BUY",
    target: 1640.00,
    stopLoss: 1500.00,
    riskLevel: "Low",
    sector: "IT Services",
    analysis: {
      rsi: 54,
      macdSignal: "Positive divergence",
      movingAvg: "Above 50-DMA; consolidating near 20-DMA",
      volume: "Steady accumulation over 5 sessions",
      support: 1500,
      resistance: 1640,
      trend: "Sideways to uptrend",
    },
    reasons: [
      "RSI at 54 shows moderate bullish bias with room to grow.",
      "Positive MACD divergence on the daily chart hints at upcoming price rise.",
      "Price is consolidating near the 20-DMA (₹1,540), a classic pre-breakout pattern.",
      "Consistent institutional buying (FII/DII) over the past 5 trading sessions.",
      "IT sector tailwinds: USD/INR weakness benefits export-oriented companies.",
      "Strong deal pipeline announcements support a near-term catalyst for upside.",
    ],
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    type: "Equity",
    price: 1721.45,
    action: "SELL",
    target: 1650.00,
    stopLoss: 1760.00,
    riskLevel: "Medium",
    sector: "Banking",
    analysis: {
      rsi: 72,
      macdSignal: "Bearish divergence",
      movingAvg: "Extended above 20-DMA; possible mean reversion",
      volume: "Declining volume on up-days",
      support: 1650,
      resistance: 1760,
      trend: "Overbought short-term",
    },
    reasons: [
      "RSI at 72 is in overbought territory, signalling a potential pullback.",
      "Bearish MACD divergence: price making higher highs while MACD makes lower highs.",
      "Price extended ~4% above 20-DMA; historical mean-reversion suggests a correction.",
      "Declining volume on up-days shows weakening buying conviction.",
      "Profit-booking expected after a 14% rally in the past 30 days.",
      "Short-term target of ₹1,650 aligns with the previous breakout level (now support).",
    ],
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors Ltd",
    type: "Equity",
    price: 812.60,
    action: "BUY",
    target: 875.00,
    stopLoss: 782.00,
    riskLevel: "Medium",
    sector: "Automobile",
    analysis: {
      rsi: 62,
      macdSignal: "Bullish crossover",
      movingAvg: "Just crossed above 200-DMA",
      volume: "Above-average volume on breakout day",
      support: 782,
      resistance: 875,
      trend: "Breakout",
    },
    reasons: [
      "Price just crossed above the crucial 200-DMA (₹805), a strong long-term bullish signal.",
      "RSI at 62 – bullish with more upside potential before overbought zone.",
      "MACD bullish crossover confirms fresh buying momentum.",
      "JLR (Jaguar Land Rover) EV order book growing, acting as a fundamental catalyst.",
      "Volume confirmation on breakout day adds credibility to the move.",
      "Risk/reward ratio of 1:2 (risk ₹30, reward ₹62) makes it an attractive trade.",
    ],
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    type: "Equity",
    price: 1132.80,
    action: "BUY",
    target: 1200.00,
    stopLoss: 1095.00,
    riskLevel: "Low",
    sector: "Banking",
    analysis: {
      rsi: 56,
      macdSignal: "Positive crossover",
      movingAvg: "Above all major moving averages",
      volume: "Consistent FII buying",
      support: 1095,
      resistance: 1200,
      trend: "Strong uptrend",
    },
    reasons: [
      "Strong uptrend; price is above 20-DMA, 50-DMA, and 200-DMA simultaneously.",
      "RSI at 56 – healthy momentum with room for further upside.",
      "MACD positive crossover on daily chart signals continuation of bullish trend.",
      "FII net buyers for 8 consecutive sessions, indicating strong foreign confidence.",
      "Net NPA at multi-year lows; improving asset quality is a strong fundamental driver.",
      "Target of ₹1,200 aligns with the upper channel resistance.",
    ],
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    type: "Equity",
    price: 789.15,
    action: "SELL",
    target: 745.00,
    stopLoss: 810.00,
    riskLevel: "Medium",
    sector: "PSU Banking",
    analysis: {
      rsi: 68,
      macdSignal: "Histogram declining",
      movingAvg: "Resistance at 20-DMA",
      volume: "Sell-off with high volume",
      support: 745,
      resistance: 810,
      trend: "Short-term bearish",
    },
    reasons: [
      "RSI at 68 – approaching overbought; risk of reversal is elevated.",
      "MACD histogram declining, showing weakening bullish momentum.",
      "Price facing stiff resistance at the 20-DMA level (₹795).",
      "High-volume sell-off in the previous session signals distribution by large players.",
      "PSU bank sector under pressure due to concerns about credit growth slowdown.",
      "Short-term bearish setup; target ₹745 provides a well-defined risk/reward.",
    ],
  },
];

const FNO = [
  {
    symbol: "NIFTY",
    name: "NIFTY 50 Call Option",
    type: "F&O",
    strikePrice: 23000,
    optionType: "CE",
    expiry: getNextThursday(),
    price: 185.50,
    action: "BUY",
    target: 280.00,
    stopLoss: 110.00,
    riskLevel: "High",
    sector: "Index Option",
    analysis: {
      indexLevel: 22985,
      ivRank: "Low (35%)",
      deltaBias: "Bullish above 22,900",
      pcr: "0.85 (Bullish bias)",
      keyLevel: "23,000 Call writing unwinding",
      trend: "Directional BUY",
    },
    reasons: [
      "NIFTY formed a bullish engulfing candle on the daily chart, signalling reversal.",
      "Put-Call Ratio (PCR) at 0.85 indicates bullish market sentiment.",
      "Max pain for the expiry is at 23,000; price likely to gravitate upward.",
      "IV Rank at 35% – relatively low implied volatility means cheaper option premium.",
      "Strong Call OI unwinding at 23,000 strike removes overhead resistance.",
      "FII index futures long positions increased, supporting bullish bias.",
    ],
  },
  {
    symbol: "BANKNIFTY",
    name: "BANKNIFTY Put Option",
    type: "F&O",
    strikePrice: 49500,
    optionType: "PE",
    expiry: getNextWednesday(),
    price: 220.00,
    action: "BUY",
    target: 380.00,
    stopLoss: 130.00,
    riskLevel: "High",
    sector: "Index Option",
    analysis: {
      indexLevel: 49620,
      ivRank: "Moderate (48%)",
      deltaBias: "Bearish below 49,700",
      pcr: "1.2 (Slightly bearish)",
      keyLevel: "49,500 support at risk",
      trend: "Directional SELL via PE",
    },
    reasons: [
      "BANKNIFTY showing signs of distribution near 49,700-49,800 supply zone.",
      "PCR at 1.2 suggests moderate bearish tilt in the market for this expiry.",
      "Key support at 49,500 under pressure; a breakdown targets 49,200.",
      "IV at 48% rank – premium is fairly priced for a directional bet.",
      "Banking index underperforming broader NIFTY 50 – relative weakness signal.",
      "Heavy Put writing at 49,000 indicates market makers see downside risk.",
    ],
  },
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Futures",
    type: "F&O",
    strikePrice: null,
    optionType: "Futures",
    expiry: getLastThursdayOfMonth(),
    price: 2944.00,
    action: "BUY",
    target: 3080.00,
    stopLoss: 2870.00,
    riskLevel: "Medium",
    sector: "Futures",
    analysis: {
      rsi: 58,
      basis: "Slight premium (₹1.45) – neutral",
      openInterest: "OI addition with price rise (Long Buildup)",
      deliveryPct: "High delivery percentage",
      trend: "Long Buildup",
    },
    reasons: [
      "Strong long buildup in Reliance futures – open interest rising with price.",
      "Basis is at a slight premium, indicating market confidence in further upside.",
      "High delivery percentage in cash segment suggests genuine buying intent.",
      "Futures give leverage to capitalize on the ₹138 upside target with margin efficiency.",
      "Stop loss at ₹2,870 (below key support) provides a well-defined risk level.",
      "Sector: energy sector rotation favoured by FIIs this week.",
    ],
  },
];

function getNextThursday() {
  const d = new Date();
  const day = d.getDay();
  const diff = (4 - day + 7) % 7 || 7;
  d.setDate(d.getDate() + diff);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function getNextWednesday() {
  const d = new Date();
  const day = d.getDay();
  const diff = (3 - day + 7) % 7 || 7;
  d.setDate(d.getDate() + diff);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function getLastThursdayOfMonth() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  d.setDate(0); // last day of current month
  while (d.getDay() !== 4) d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Calculate how many units can be bought with the given budget.
 * For F&O options, 1 lot is the minimum and lotSize is applied.
 */
function calcQuantity(item, budget) {
  if (item.type === "F&O") {
    if (item.optionType === "Futures") {
      // Futures margin is typically ~15% of contract value
      const lotSize = 250; // RELIANCE lot size
      const marginPerLot = item.price * lotSize * 0.15;
      const lots = Math.max(1, Math.floor(budget / marginPerLot));
      return { qty: lots, unit: "lot(s)", lotSize };
    }
    // Options: premium × lot size
    const LOT_SIZES = { NIFTY: 50, BANKNIFTY: 15 };
    const lotSize = LOT_SIZES[item.symbol] ?? 250;
    const costPerLot = item.price * lotSize;
    const lots = Math.max(1, Math.floor(budget / costPerLot));
    return { qty: lots, unit: "lot(s)", lotSize };
  }
  // Equity: simple share count
  const shares = Math.max(1, Math.floor(budget / item.price));
  return { qty: shares, unit: "share(s)", lotSize: 1 };
}

/**
 * Calculate potential P&L.
 */
function calcPnL(item, qtyInfo) {
  const { qty, lotSize } = qtyInfo;
  const units = qty * lotSize;
  const gain = (item.target - item.price) * (item.action === "SELL" ? -1 : 1) * units;
  const loss = (item.price - item.stopLoss) * (item.action === "SELL" ? -1 : 1) * units;
  const pct = (((item.target - item.price) / item.price) * (item.action === "SELL" ? -1 : 1) * 100).toFixed(2);
  return { gain: gain.toFixed(0), loss: Math.abs(loss).toFixed(0), pct };
}

// Exported data and helpers
window.AppData = { STOCKS, FNO, calcQuantity, calcPnL };
