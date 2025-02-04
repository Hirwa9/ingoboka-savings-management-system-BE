import express from "express";
import upload from "../config/multerConfig.js";
import { getUsers, Register, Login, Logout, SendUserOPT, VerifyUserOTP, ResetUserPassword, editCotisation, editShares, editSocial, editWifeInfo, editHusbandInfo, editWifePhoto, editHusbandPhoto, clearAllAnnualRecordsWithDistribution, clearAllAnnualSharesOnly, addMultipleShares, RemoveMember } from "../controllers/Users.js";
import { addCreditPenalty, addExpense, getRecords } from "../controllers/Records.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../middleware/RefreshToken.js";
import { approveCreditRequest, createCredit, deleteCredit, getCreditById, getCredits, updateCreditPayment, updateCreditStatus } from "../controllers/Credits.js";
import { createLoanEntry, editLoanDetails, getLoans, payLoan } from "../controllers/Loans.js";
import { getSystemSettings, saveCreditSettings, saveExpenseTypes, saveRoles, saveSavingsSettings, saveShareSettings, saveSystemSettings } from "../controllers/Settings.js";
import { getAnnualInterestRecords } from "../controllers/AnnualInterests.js";
import { getBalance, getFigureById, getFigures, getLoanDelivered, getPaidCapital, getPenalties, resetFigures, updateFigure, updateSingleColumn } from "../controllers/Figures.js";

const router = express.Router();

/**
 * Users routes
 */
// router.get('/users', verifyToken, getUsers);             // Get users
router.get('/users', getUsers);                             // Get users
router.post('/users/register', Register);                   // Register a user
router.post('/login', Login);                               // Login a user
router.get('/token', refreshToken);                         // Get token
router.get('/verifyToken', verifyToken);                    // Verify token
router.delete('/logout', Logout);                           // Logout a user

// Edit user info
router.post('/user/:id/edit-husband-photo',
    upload.single('husbandAvatar'),
    editHusbandPhoto
);  // Edit husband photo
router.post('/user/:id/edit-wife-photo',
    upload.single('wifeAvatar'),
    editWifePhoto
);  // Edit wife photo
router.post('/user/:id/edit-wife-photo', editWifePhoto);                // Edit wife photo
router.post('/user/:id/edit-husband-info', editHusbandInfo);            // Edit husband info
router.post('/user/:id/edit-wife-info', editWifeInfo);                  // Edit wife info
router.post('/user/remove', RemoveMember);                              // Remove a user

// Savings
router.post('/member/:id/shares', editShares);              // Edit user's shares
router.post('/member/:id/cotisation', editCotisation);      // Edit user's cotisation amount
router.post('/member/:id/social', editSocial);              // Edit user's social amount
router.post('/member/:id/multiple-shares', addMultipleShares);              // Edit user's social amount

/**
 * Records
 */
router.get('/records', getRecords);                         // Get records
router.post('/records/recordExpense', addExpense);           // Add expense record
router.post('/user/:id/credit-penalty', addCreditPenalty);

/**
 * Credits routes
 */
router.get('/credits', getCredits);                         // Get credits
router.get('/credit/:id', getCreditById);                   // Get a credit by ID
router.post('/credit/create', createCredit);                // Create a credit
router.patch('/credit/:id/payment', updateCreditPayment);   // Update a credit's payment
router.patch('/credit/:id/reject', updateCreditStatus);     // Reject a credit
router.patch('/credit/:id/restore', updateCreditStatus);    // Restore a rejected credit
router.patch('/credit/:id/approve', approveCreditRequest);    // Approve a rejected credit
router.delete('/credit/:id/delete', deleteCredit);          // Delete a credit (Rarely used for records integrity)
router.post('/api/distribute-interest', clearAllAnnualRecordsWithDistribution);
router.post('/api/withdraw-interest', clearAllAnnualSharesOnly);

/**
 * Annual interest routes
 */
router.get('/api/annualInterests', getAnnualInterestRecords);                         // Get annual interest records

/**
 * Loans routes
 */

// Create a loan entry for a new member
router.get('/loans', getLoans);
router.post('/loan/create', createLoanEntry);

// Edit loan details for a specific member
router.put('/loan/:id/edit', editLoanDetails);
router.put('/loan/:id/pay', payLoan);

/**
 * Figures routes
 */
router.get("/figures", getFigures);                                 // Get all figures
router.get("/figures/:id", getFigureById);                          // Get specific figure
router.get("/figures/:id/balance", getBalance);                     // Get balance
router.get("/figures/:id/paid-capital", getPaidCapital);            // Get paid capital
router.get("/figures/:id/loan-delivered", getLoanDelivered);        // Get loan delivered
router.get("/figures/:id/penalties", getPenalties);                 // Get penalties
router.put("/figures/:id", updateFigure);                           // Update figures
router.patch("/figures/:id/reset", resetFigures);                   // Reset all figures
router.patch("/figures/:id/update", updateSingleColumn);            // Update a single column figures

/**
 * Settings routes
 */

router.get('/api/settings', getSystemSettings);        // Save system settings
router.post('/api/settings/system', saveSystemSettings);        // Save system settings
router.post('/api/settings/roles', saveRoles);                  // Save roles
router.post('/api/settings/credits', saveCreditSettings);       // Save credit settings
router.post('/api/settings/shares', saveShareSettings);         // Save share settings
router.post('/api/settings/expenses', saveExpenseTypes);        // Save expense types
router.post('/api/settings/savings', saveSavingsSettings);      // Save savings settings

export default router;