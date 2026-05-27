const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/portfolio - get current portfolio
router.get('/', (req, res) => {
  res.json(store.getPortfolio());
});

module.exports = router;
