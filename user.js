// Create a file for inserting sample data, e.g., `insertSampleData.js`

const mongoose = require('mongoose');
const User = require('./usermodel');  // Import User model
const Financial = require('./financialModel');  // Import Financial model

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/sample', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');

  // Step 1: Create a new Financial record
  const financialData2 = new Financial({
    income: 75000,
    loanAmount: 25000,
    creditScore: 800,
    outstandingDebt: 15000,
    totalAssets: 120000,
    totalLiabilities: 50000,
    loanHistory: [
      {
        loanType: 'Personal Loan',
        loanAmount: 20000,
        loanStatus: 'Paid',
        startDate: new Date('2020-05-01'),
        endDate: new Date('2023-05-01'),
        interestRate: 7.5
      },
      {
        loanType: 'Car Loan',
        loanAmount: 15000,
        loanStatus: 'Pending',
        startDate: new Date('2022-08-01'),
        endDate: new Date('2025-08-01'),
        interestRate: 5
      },
      {
        loanType: 'Home Loan',
        loanAmount: 100000,
        loanStatus: 'Pending',
        startDate: new Date('2021-01-01'),
        endDate: new Date('2041-01-01'),
        interestRate: 3.75
      }
    ]
  });

  const financialData = await financialData2.save();
  console.log('Financial data saved:', financialData);

  // Step 2: Create a new User and associate it with the first financial record
  const newUser = new User({
    user: 'adi',
    password: 'qwerty123',
    financialInfo: financialData._id  // Reference to the financial record
  });

  const userData = await newUser.save();
  console.log('User data saved:', userData);

}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});
