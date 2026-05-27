import { useState, useEffect } from 'react';
import { api } from './services/api';
import StockList from './components/StockList';
import Portfolio from './components/Portfolio';
import OrderForm from './components/OrderForm';
import OrderHistory from './components/OrderHistory';
import './App.css';

export default function App() {
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState({ cash: 0, holdings: {}, totalValue: 0 });
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('market');
  const [error, setError] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);

  const refresh = () => setRefreshTick((t) => t + 1);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [stocksData, portfolioData, ordersData] = await Promise.all([
          api.getStocks(),
          api.getPortfolio(),
          api.getOrders(),
        ]);
        if (!cancelled) {
          setStocks(stocksData);
          setPortfolio(portfolioData);
          setOrders(ordersData);
          setError('');
        }
      } catch {
        if (!cancelled) {
          setError('Unable to connect to server. Make sure the backend is running on port 3001.');
        }
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [refreshTick]);

  const tabs = [
    { id: 'market', label: 'Market' },
    { id: 'trade', label: 'Trade' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'history', label: 'History' },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>📈 TradingApp</h1>
          <div className="header-balance">
            <span className="balance-label">Cash</span>
            <span className="balance-value">${portfolio.cash.toFixed(2)}</span>
          </div>
        </div>
        <nav className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? 'tab active' : 'tab'}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-main">
        {error && <div className="alert error global-error">{error}</div>}
        {activeTab === 'market' && <StockList stocks={stocks} />}
        {activeTab === 'trade' && (
          <OrderForm stocks={stocks} onOrderPlaced={refresh} />
        )}
        {activeTab === 'portfolio' && <Portfolio portfolio={portfolio} />}
        {activeTab === 'history' && <OrderHistory orders={orders} />}
      </main>
    </div>
  );
}
