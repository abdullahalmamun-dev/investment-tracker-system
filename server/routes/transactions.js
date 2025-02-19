const express = require('express');
const router = express.Router();
const Investment = require('../models/Transaction');

// Create a new investment
router.post('/', async (req, res) => {
  try {
    const { name, profitOrLoss, description, date, amount } = req.body;
    const investment = new Investment({ name, profitOrLoss, description, date, amount });
    await investment.save();
    res.status(201).json(investment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating investment', error });
  }
});

// Fetch all investments
router.get('/', async (req, res) => {
  try {
    const investments = await Investment.find().sort({ date: -1 });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching investments', error });
  }
});

module.exports = router;
