const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/orders - get order history
router.get('/', (req, res) => {
  res.json(store.getOrders());
});

// POST /api/orders - place a new order
router.post('/', (req, res) => {
  const { symbol, type, quantity } = req.body;

  if (!symbol || !type || quantity === undefined) {
    return res.status(400).json({ error: 'symbol, type, and quantity are required' });
  }

  const parsedQuantity = parseInt(quantity, 10);
  if (isNaN(parsedQuantity)) {
    return res.status(400).json({ error: 'quantity must be a valid integer' });
  }

  const result = store.placeOrder(symbol, type.toUpperCase(), parsedQuantity);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.status(201).json(result.order);
});

module.exports = router;
