const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  getStocks: () => request('/api/stocks'),
  getStock: (symbol) => request(`/api/stocks/${symbol}`),
  getPortfolio: () => request('/api/portfolio'),
  getOrders: () => request('/api/orders'),
  placeOrder: (symbol, type, quantity) =>
    request('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ symbol, type, quantity }),
    }),
};
