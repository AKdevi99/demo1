const mongoose = require('mongoose');

// Define the schema for loan history
const loanHistorySchema = new mongoose.Schema({
  loanType: String,
  loanAmount: Number,
  loanStatus: String,
  startDate: { type: Date },
  endDate: { type: Date },
  interestRate: Number
});

// Define the Financial schema
const financialSchema = new mongoose.Schema({
  income: Number,
  loanAmount: Number,
  creditScore: Number,
  outstandingDebt: Number,
  totalAssets: Number,
  totalLiabilities: Number,
  loanHistory: [loanHistorySchema]  // This allows multiple loan entries
});

const Financial = mongoose.model('Financial', financialSchema);

module.exports = Financial;
