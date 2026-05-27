export default function OrderHistory({ orders }) {
  return (
    <div className="card">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p className="empty-message">No orders yet.</p>
      ) : (
        <table className="stock-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Symbol</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="timestamp">{new Date(order.createdAt).toLocaleTimeString()}</td>
                <td className="symbol">{order.symbol}</td>
                <td className={order.type === 'BUY' ? 'buy-type' : 'sell-type'}>{order.type}</td>
                <td>{order.quantity}</td>
                <td>${order.price.toFixed(2)}</td>
                <td>${order.total.toFixed(2)}</td>
                <td className="status filled">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
