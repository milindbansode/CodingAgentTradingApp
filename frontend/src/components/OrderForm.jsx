import { useState } from 'react';
import { api } from '../services/api';

export default function OrderForm({ stocks, onOrderPlaced }) {
  const [symbol, setSymbol] = useState('AAPL');
  const [type, setType] = useState('BUY');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedStock = stocks.find((s) => s.symbol === symbol);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const order = await api.placeOrder(symbol, type, parseInt(quantity, 10));
      setSuccess(
        `Order filled: ${type} ${order.quantity} ${order.symbol} @ $${order.price.toFixed(2)} (Total: $${order.total.toFixed(2)})`
      );
      onOrderPlaced();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const estimatedTotal = selectedStock
    ? (selectedStock.price * parseInt(quantity || 0, 10)).toFixed(2)
    : '0.00';

  return (
    <div className="card">
      <h2>Place Order</h2>
      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-row">
          <label htmlFor="symbol">Stock</label>
          <select id="symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
            {stocks.map((s) => (
              <option key={s.symbol} value={s.symbol}>
                {s.symbol} — {s.name} (${s.price.toFixed(2)})
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="type">Order Type</label>
          <div className="btn-toggle">
            <button
              type="button"
              className={type === 'BUY' ? 'active buy' : ''}
              onClick={() => setType('BUY')}
            >
              BUY
            </button>
            <button
              type="button"
              className={type === 'SELL' ? 'active sell' : ''}
              onClick={() => setType('SELL')}
            >
              SELL
            </button>
          </div>
        </div>
        <div className="form-row">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="form-row estimated">
          <span>Estimated Total</span>
          <span className="amount">${estimatedTotal}</span>
        </div>
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}
        <button type="submit" disabled={loading} className={`submit-btn ${type.toLowerCase()}`}>
          {loading ? 'Processing…' : `${type} ${symbol}`}
        </button>
      </form>
    </div>
  );
}
