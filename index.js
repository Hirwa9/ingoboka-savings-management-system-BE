import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/routes.js";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 5000;

// Derive __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cors
const allowedOrigins = [
    'http://localhost:3000',
    'https://ingoboka-savings-management-system.onrender.com', // Render ngrok
    'https://ingoboka-savings-management-system-be.onrender.com'  // Render ngrok
];

app.use(cors({
    credentials: true,
    origin: allowedOrigins
}));

// app.use((req, res, next) => {
//     const origin = req.headers.origin;
//     if (allowedOrigins.includes(origin)) {
//         res.setHeader("Access-Control-Allow-Origin", origin); // Set origin dynamically
//     }
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

//     // Handle preflight requests
//     if (req.method === "OPTIONS") {
//         return res.sendStatus(200);
//     }

//     next();
// });

app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(port, () => console.log(`Server running at port ${port}`));