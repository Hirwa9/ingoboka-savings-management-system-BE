import express from 'express';
import { getAnnualInterestRecords } from '../controllers/annual_interests.js';

const annualInterestsRouter = express.Router();

annualInterestsRouter.get('/api/annualInterests', getAnnualInterestRecords);                         // Get annual interest records

export default annualInterestsRouter;