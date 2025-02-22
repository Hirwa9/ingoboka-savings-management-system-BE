import express from 'express';

import { addCreditPenalty, addExpense, getRecords } from '../controllers/records.js';

const recordsRouter = express.Router();

recordsRouter.get('/records', getRecords);                         // Get records
recordsRouter.post('/records/recordExpense', addExpense);           // Add expense record
recordsRouter.post('/user/:id/credit-penalty', addCreditPenalty);

export default recordsRouter;