export default function Portfolio({ portfolio }) {
  const { cash, holdings, totalValue } = portfolio;
  const holdingsList = Object.values(holdings);

  return (
    <div className="card">
      <h2>Portfolio</h2>
      <div className="portfolio-summary">
        <div className="summary-item">
          <span>Cash</span>
          <span className="amount">${cash.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span>Total Value</span>
          <span className="amount total">${totalValue.toFixed(2)}</span>
        </div>
      </div>
      {holdingsList.length === 0 ? (
        <p className="empty-message">No holdings yet. Place a buy order to get started.</p>
      ) : (
        <table className="stock-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Shares</th>
              <th>Avg Cost</th>
              <th>Current</th>
              <th>Value</th>
              <th>Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {holdingsList.map((h) => (
              <tr key={h.symbol}>
                <td className="symbol">{h.symbol}</td>
                <td>{h.quantity}</td>
                <td>${h.averageCost.toFixed(2)}</td>
                <td>${h.currentPrice.toFixed(2)}</td>
                <td>${h.marketValue.toFixed(2)}</td>
                <td className={h.gainLoss >= 0 ? 'positive' : 'negative'}>
                  {h.gainLoss >= 0 ? '+' : ''}${h.gainLoss.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
