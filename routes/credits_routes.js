import express from 'express';

import { createLoanEntry, editLoanDetails, getLoans, payLoan } from "../controllers/loans.js";
import { approveCreditRequest, createCredit, deleteCredit, getCreditById, getCredits, updateCreditPayment, updateCreditStatus } from "../controllers/credits.js";
import { distributeAnnualInterest, withdrawAnnualInterest } from '../controllers/users.js';

const creditsRouter = express.Router();

creditsRouter.get('/loans', getLoans);                                      // Get loans
creditsRouter.post('/loan/create', createLoanEntry);                        // Create a loan entry
creditsRouter.put('/loan/:id/edit', editLoanDetails);                       // Edit loan
creditsRouter.put('/loan/:id/pay', payLoan);                                // Pay a loan

// Edit credit records
creditsRouter.get('/credits', getCredits);                                  // Get credits
creditsRouter.get('/credit/:id', getCreditById);                            // Get a credit by ID
creditsRouter.post('/credit/create', createCredit);                         // Create a credit
creditsRouter.patch('/credit/:id/payment', updateCreditPayment);            // Update a credit's payment
creditsRouter.patch('/credit/:id/reject', updateCreditStatus);              // Reject a credit
creditsRouter.patch('/credit/:id/restore', updateCreditStatus);             // Restore a rejected credit
creditsRouter.patch('/credit/:id/approve', approveCreditRequest);             // Approve a rejected credit
creditsRouter.delete('/credit/:id/delete', deleteCredit);                   // Delete a credit (Rarely used for records integrity)
creditsRouter.post('/api/distribute-interest', distributeAnnualInterest);   // Distribute interest 
creditsRouter.post('/api/withdraw-interest', withdrawAnnualInterest);       // Withdraw interest

export default creditsRouter;