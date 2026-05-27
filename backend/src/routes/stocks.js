const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/stocks - list all stocks
router.get('/', (req, res) => {
  res.json(store.getStocks());
});

// GET /api/stocks/:symbol - get a specific stock
router.get('/:symbol', (req, res) => {
  const stock = store.getStock(req.params.symbol);
  if (!stock) {
    return res.status(404).json({ error: `Stock ${req.params.symbol.toUpperCase()} not found` });
  }
  res.json(stock);
});

module.exports = router;
