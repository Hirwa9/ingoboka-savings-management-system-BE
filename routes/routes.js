import express from "express";
import { backupDatabase } from "../config/Database.js";

import settingsRouter from "./settings_routes.js";
import figuresRouter from "./figures_routes.js";
import creditsRouter from "./credits_routes.js";
import recordsRouter from "./records_routes.js";
import usersRouter from "./users_routes.js";
import annualInterestsRouter from "./annual_interests_routes.js";

const router = express.Router();

router.use(figuresRouter);                              // Figures routes
router.use(usersRouter);                                // Users routes
router.use(recordsRouter);                              // Records routes
router.use(creditsRouter);                              // Credits routes
router.use(annualInterestsRouter);                      // Annual interests routes
router.use('/api/settings', settingsRouter);                // ettings routes

router.post('/api/database/backup', backupDatabase);    // Backup the database

export default router;