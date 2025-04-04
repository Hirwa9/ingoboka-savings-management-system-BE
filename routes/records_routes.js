import express from 'express';

import { addCreditPenalty, addExpense, deleteCreditPenalty, deleteExpense, editCreditPenalty, editExpense, getRecords } from '../controllers/records.js';

const recordsRouter = express.Router();

recordsRouter.get('/records', getRecords);                          // Get records
recordsRouter.post('/records/recordExpense', addExpense);           // Add expense record
recordsRouter.post('/expense-record/edit', editExpense);            // Edit expense record
recordsRouter.post('/expense-record/delete', deleteExpense);        // Delete expense record
recordsRouter.post('/penalty-record/edit', editCreditPenalty);            // Edit expense record
recordsRouter.post('/penalty-record/delete', deleteCreditPenalty);        // Delete expense record
recordsRouter.post('/user/:id/credit-penalty', addCreditPenalty);   // Create penalty record

export default recordsRouter;