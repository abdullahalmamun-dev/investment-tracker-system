const express = require("express");
const router = express.Router();
const Investment = require("../models/Transaction");

// Create a new investment
router.post("/", async (req, res) => {
  try {
    const {
      name,
      profitOrLoss,
      description,
      date,
      amount,
      profitOrLossAmount,
    } = req.body;

    console.log("Received investment data:", req.body); // Add this line to log the data

    const investment = new Investment({
      name,
      profitOrLoss,
      description,
      date,
      amount,
      profitOrLossAmount,
    });

    await investment.save();
    res.status(201).json(investment);
  } catch (error) {
    res.status(500).json({ message: "Error creating investment", error });
  }
});

router.get('/api/investments/:id/pdf', async (req, res) => {
  const investmentId = req.params.id;

  const investment = await Investment.findById(investmentId);
  
  if (!investment) return res.status(404).send('Investment not found');

  const doc = new pdfkit();
  
  let filename = `Investment_${investmentId}.pdf`;
  
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', 'application/pdf');

  doc.text(`Investment Name: ${investment.name}`, { align: 'left' });
  doc.text(`Date: ${new Date(investment.date).toLocaleDateString()}`, { align: 'left' });
  doc.text(`Description: ${investment.description}`, { align: 'left' });
  doc.text(`Profit/Loss Amount: $${investment.profitOrLossAmount}`, { align: 'left' });
  doc.text(`Total Amount Invested: $${investment.amount}`, { align: 'left' });

  doc.pipe(res);
  
  doc.end();
});

// Fetch all investments
router.get("/", async (req, res) => {
  try {
    const investments = await Investment.find().sort({ date: -1 });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching investments", error });
  }
});

// PUT route for updating an investment
router.put('/:id', async (req, res) => {
  try {
    const { name, profitOrLoss, description, date, amount, profitOrLossAmount } = req.body;

    // Find the investment by ID and update it
    const updatedInvestment = await Investment.findByIdAndUpdate(
      req.params.id, // Use the ID from the URL parameter
      { name, profitOrLoss, description, date, amount, profitOrLossAmount },
      { new: true } // Return the updated document
    );

    if (!updatedInvestment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    res.status(200).json(updatedInvestment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating investment', error: error.message });
  }
});



router.delete('/:id', async (req, res) => {
  try {
    const investment = await Investment.findByIdAndDelete(req.params.id);

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    res.status(200).json({ message: 'Investment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting investment', error: error.message });
  }
});



module.exports = router;
