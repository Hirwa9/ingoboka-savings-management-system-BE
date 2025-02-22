import express from 'express';

import {
    getBalance,
    getFigureById,
    getFigures,
    getLoanDelivered,
    getPaidCapital,
    getPenalties,
    resetFigures,
    updateFigure,
    updateSingleColumn
} from "../controllers/figures.js";

const figuresRouter = express.Router();

figuresRouter.get("/figures", getFigures);                                 // Get all figures
figuresRouter.get("/figures/:id", getFigureById);                          // Get specific figure
figuresRouter.get("/figures/:id/balance", getBalance);                     // Get balance
figuresRouter.get("/figures/:id/paid-capital", getPaidCapital);            // Get paid capital
figuresRouter.get("/figures/:id/loan-delivered", getLoanDelivered);        // Get loan delivered
figuresRouter.get("/figures/:id/penalties", getPenalties);                 // Get penalties
figuresRouter.put("/figures/:id", updateFigure);                           // Update figures
figuresRouter.patch("/figures/:id/reset", resetFigures);                   // Reset all figures
figuresRouter.patch("/figures/:id/update", updateSingleColumn);            // Update a single column figures

export default figuresRouter;