import express from 'express';

import { deletePaidLoan } from "../controllers/loans.js";

const loansRouter = express.Router();

// Edit credit records
loansRouter.post('/credit-payment/delete', deletePaidLoan);          // Delete a credit payment record

export default loansRouter;