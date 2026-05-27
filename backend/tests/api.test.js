const request = require('supertest');
const app = require('../src/index');

describe('Health Check', () => {
  test('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Stocks API', () => {
  test('GET /api/stocks returns list of stocks', async () => {
    const res = await request(app).get('/api/stocks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    const stock = res.body[0];
    expect(stock).toHaveProperty('symbol');
    expect(stock).toHaveProperty('name');
    expect(stock).toHaveProperty('price');
  });

  test('GET /api/stocks/:symbol returns a specific stock', async () => {
    const res = await request(app).get('/api/stocks/AAPL');
    expect(res.status).toBe(200);
    expect(res.body.symbol).toBe('AAPL');
    expect(res.body.name).toBe('Apple Inc.');
    expect(typeof res.body.price).toBe('number');
  });

  test('GET /api/stocks/:symbol is case-insensitive', async () => {
    const res = await request(app).get('/api/stocks/aapl');
    expect(res.status).toBe(200);
    expect(res.body.symbol).toBe('AAPL');
  });

  test('GET /api/stocks/:symbol returns 404 for unknown stock', async () => {
    const res = await request(app).get('/api/stocks/UNKNOWN');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('Portfolio API', () => {
  test('GET /api/portfolio returns portfolio data', async () => {
    const res = await request(app).get('/api/portfolio');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('cash');
    expect(res.body).toHaveProperty('holdings');
    expect(res.body).toHaveProperty('totalValue');
    expect(typeof res.body.cash).toBe('number');
  });
});

describe('Orders API', () => {
  test('GET /api/orders returns empty array initially', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/orders places a BUY order successfully', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ symbol: 'AAPL', type: 'BUY', quantity: 5 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.symbol).toBe('AAPL');
    expect(res.body.type).toBe('BUY');
    expect(res.body.quantity).toBe(5);
    expect(res.body.status).toBe('FILLED');
  });

  test('POST /api/orders places a SELL order successfully', async () => {
    // First buy some shares
    await request(app)
      .post('/api/orders')
      .send({ symbol: 'MSFT', type: 'BUY', quantity: 10 });

    // Then sell some
    const res = await request(app)
      .post('/api/orders')
      .send({ symbol: 'MSFT', type: 'SELL', quantity: 5 });
    expect(res.status).toBe(201);
    expect(res.body.type).toBe('SELL');
    expect(res.body.quantity).toBe(5);
  });

  test('POST /api/orders returns 400 for insufficient funds', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ symbol: 'AAPL', type: 'BUY', quantity: 1000000 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/orders returns 400 for selling more than owned', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ symbol: 'GOOGL', type: 'SELL', quantity: 1000 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/orders returns 400 for missing fields', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ symbol: 'AAPL' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/orders returns 400 for unknown stock', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ symbol: 'UNKNOWN', type: 'BUY', quantity: 1 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/orders returns 400 for invalid quantity', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ symbol: 'AAPL', type: 'BUY', quantity: -5 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /api/orders returns orders after placing them', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    const order = res.body[0];
    expect(order).toHaveProperty('id');
    expect(order).toHaveProperty('symbol');
    expect(order).toHaveProperty('type');
    expect(order).toHaveProperty('quantity');
    expect(order).toHaveProperty('price');
    expect(order).toHaveProperty('total');
    expect(order).toHaveProperty('status');
    expect(order).toHaveProperty('createdAt');
  });
});

describe('404 handler', () => {
  test('unknown routes return 404', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });
});
