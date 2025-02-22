const express = require("express");
const router = express.Router();
const Investment = require("../models/Transaction");
const nodemailer = require("nodemailer");
const pdfkit = require("pdfkit");
const Profile = require("../models/Profile");

// Function to calculate balance
const calculateBalance = async () => {
  try {
    const investments = await Investment.find();
    const balance = investments.reduce((sum, inv) => sum + inv.amount, 0);
    return balance;
  } catch (error) {
    console.error("Error calculating balance:", error);
    throw error;
  }
};

// Function to calculate total profit
const calculateTotalProfit = async () => {
  try {
    const investments = await Investment.find({ profitOrLoss: "profit" });
    const totalProfit = investments.reduce(
      (sum, inv) => sum + inv.profitOrLossAmount,
      0
    );
    return totalProfit;
  } catch (error) {
    console.error("Error calculating total profit:", error);
    throw error;
  }
};

// Function to calculate total loss
const calculateTotalLoss = async () => {
  try {
    const investments = await Investment.find({ profitOrLoss: "loss" });
    const totalLoss = investments.reduce(
      (sum, inv) => sum + Math.abs(inv.profitOrLossAmount),
      0
    );
    return totalLoss;
  } catch (error) {
    console.error("Error calculating total loss:", error);
    throw error;
  }
};

// Create reusable transporter object using Hostinger's SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // SMTP host for Hostinger
  port: 465, // Port 465 for SSL
  secure: true, // Use SSL/TLS
  auth: {
    user: "investmentTracker@allinfozone.tech", // Your email address
    pass: "Alif2@gmail.com", // Your email password (use an app password if 2FA is enabled)
  },
});

// Function to send email
const sendTransactionEmail = (transactionDetails) => {
  if (!transactionDetails.email) {
    console.log("No email address found, skipping email notification");
    return;
  }
  console.log("Sending email with details:", transactionDetails); // Check if this is logged

  const mailOptions = {
    from: "investmentTracker@allinfozone.tech",
    to: transactionDetails.email, // Replace with your recipient email
    subject: "New Investment Transaction",
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #004d99; text-align: center;">Investment Transaction Details</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 10px; background-color: #f9f9f9; font-weight: bold; color: #333;">Investment Name</td>
                <td style="padding: 10px; background-color: #f9f9f9; color: #333;">${
                  transactionDetails.name
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; background-color: #f9f9f9; font-weight: bold; color: #333;">Profit/Loss</td>
                <td style="padding: 10px; background-color: #f9f9f9; color: ${
                  transactionDetails.profitOrLoss === "profit" ? "green" : "red"
                };">${
      transactionDetails.profitOrLoss.charAt(0).toUpperCase() +
      transactionDetails.profitOrLoss.slice(1)
    }</td>
              </tr>
              <tr>
                <td style="padding: 10px; background-color: #f9f9f9; font-weight: bold; color: #333;">Amount</td>
                <td style="padding: 10px; background-color: #f9f9f9; color: #333;">$${
                  transactionDetails.amount
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; background-color: #f9f9f9; font-weight: bold; color: #333;">Description</td>
                <td style="padding: 10px; background-color: #f9f9f9; color: #333;">${
                  transactionDetails.description
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; background-color: #f9f9f9; font-weight: bold; color: #333;">Profit/Loss Amount</td>
                <td style="padding: 10px; background-color: #f9f9f9; color: ${
                  transactionDetails.profitOrLoss === "profit" ? "green" : "red"
                };">$${transactionDetails.profitOrLossAmount}</td>
              </tr>
              <tr>
                <td style="padding: 10px; background-color: #f9f9f9; font-weight: bold; color: #333;">Date</td>
                <td style="padding: 10px; background-color: #f9f9f9; color: #333;">${
                  transactionDetails.date
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; background-color: #f9f9f9; font-weight: bold; color: #333;">Balance</td>
                <td style="padding: 10px; background-color: #f9f9f9; color: #333;">$${
                  transactionDetails.balance
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; background-color: #f9f9f9; font-weight: bold; color: #333;">Total Profit</td>
                <td style="padding: 10px; background-color: #f9f9f9; color: green;">$${
                  transactionDetails.totalProfit
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; background-color: #f9f9f9; font-weight: bold; color: #333;">Total Loss</td>
                <td style="padding: 10px; background-color: #f9f9f9; color: red;">$${
                  transactionDetails.totalLoss
                }</td>
              </tr>
            </table>

            <hr style="margin-top: 20px; border-top: 2px solid #004d99;" />
            <p style="text-align: center; color: #555;">Investment Tracker - Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email: ", error);
    } else {
      console.log("Email sent to", transactionDetails.email);
    }
  });
};

// Create new investment
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

    // Save the investment first
    const investment = new Investment({
      name,
      profitOrLoss,
      description,
      date,
      amount,
      profitOrLossAmount,
    });
    await investment.save();

    // Get profile with email
    const profile = await Profile.findOne({ isDefault: true });
    if (!profile) {
      throw new Error("No default profile found");
    }

    // Calculate financial data
    const updatedBalance = await calculateBalance();
    const totalProfit = await calculateTotalProfit();
    const totalLoss = await calculateTotalLoss();

    // Send email to profile's email
    sendTransactionEmail({
      email: profile.email, // Add profile email to transaction details
      name: investment.name,
      profitOrLoss: investment.profitOrLoss,
      amount: investment.amount,
      description: investment.description,
      profitOrLossAmount: investment.profitOrLossAmount,
      date: investment.date,
      balance: updatedBalance,
      totalProfit: totalProfit,
      totalLoss: totalLoss,
    });

    res.status(201).json(investment);
  } catch (error) {
    console.error("Error saving investment:", error);
    res.status(500).json({
      message: error.message || "Error saving investment",
    });
  }
});

// Generate PDF of investment details
router.get("/api/investments/:id/pdf", async (req, res) => {
  const investmentId = req.params.id;

  const investment = await Investment.findById(investmentId);

  if (!investment) return res.status(404).send("Investment not found");

  const doc = new pdfkit();

  let filename = `InvestmentReport_${investmentId}.pdf`;

  res.setHeader("Content-disposition", "attachment; filename=" + filename);
  res.setHeader("Content-type", "application/pdf");

  // Adding custom fonts and setting up styles
  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .fillColor("rgb(0, 51, 102)") // Dark Blue Color
    .text("Investment Details", { align: "center" });
  doc.moveDown();

  doc.font("Helvetica").fontSize(12).fillColor("black");

  // Adding a divider line
  doc
    .moveTo(50, 120)
    .lineTo(550, 120)
    .strokeColor("rgb(0, 51, 102)") // Blue color for the line
    .lineWidth(1)
    .stroke();
  doc.moveDown();

  // Investment Data
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor("rgb(0, 51, 102)") // Heading color
    .text("Investment Name: ", { continued: true });

  doc.font("Helvetica").fontSize(14).fillColor("black").text(investment.name);

  doc.moveDown();

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor("rgb(0, 51, 102)")
    .text("Profit/Loss: ", { continued: true });

  doc
    .font("Helvetica")
    .fontSize(14)
    .fillColor(investment.profitOrLoss === "profit" ? "green" : "red")
    .text(
      investment.profitOrLoss.charAt(0).toUpperCase() +
        investment.profitOrLoss.slice(1)
    ); // Capitalize

  doc.moveDown();

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor("rgb(0, 51, 102)")
    .text("Description: ", { continued: true });

  doc
    .font("Helvetica")
    .fontSize(14)
    .fillColor("black")
    .text(investment.description);

  doc.moveDown();

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor("rgb(0, 51, 102)")
    .text("Date: ", { continued: true });

  doc
    .font("Helvetica")
    .fontSize(14)
    .fillColor("black")
    .text(new Date(investment.date).toLocaleDateString());

  doc.moveDown();

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor("rgb(0, 51, 102)")
    .text("Profit/Loss Amount: ", { continued: true });

  doc
    .font("Helvetica")
    .fontSize(14)
    .fillColor(investment.profitOrLoss === "profit" ? "green" : "red")
    .text(`$${investment.profitOrLossAmount.toFixed(2)}`);

  doc.moveDown();

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor("rgb(0, 51, 102)")
    .text("Total Amount Invested: ", { continued: true });

  doc
    .font("Helvetica")
    .fontSize(14)
    .fillColor("black")
    .text(`$${investment.amount.toFixed(2)}`);

  doc.moveDown();

  // Adding Footer with a different color
  doc
    .moveTo(50, 650)
    .lineTo(550, 650)
    .strokeColor("rgb(0, 51, 102)") // Blue color for the footer line
    .lineWidth(1)
    .stroke();

  doc.moveDown();
  doc
    .font("Helvetica-Italic")
    .fontSize(10)
    .fillColor("rgb(0, 51, 102)")
    .text("Investment Tracker - Generated on " + new Date().toLocaleString(), {
      align: "center",
    });

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
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      profitOrLoss,
      description,
      date,
      amount,
      profitOrLossAmount,
    } = req.body;

    // Find the investment by ID and update it
    const updatedInvestment = await Investment.findByIdAndUpdate(
      req.params.id, // Use the ID from the URL parameter
      { name, profitOrLoss, description, date, amount, profitOrLossAmount },
      { new: true } // Return the updated document
    );

    if (!updatedInvestment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    res.status(200).json(updatedInvestment);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating investment", error: error.message });
  }
});

// DELETE route for deleting an investment
router.delete("/:id", async (req, res) => {
  try {
    const investment = await Investment.findByIdAndDelete(req.params.id);

    if (!investment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    res.status(200).json({ message: "Investment deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting investment", error: error.message });
  }
});

module.exports = router;
