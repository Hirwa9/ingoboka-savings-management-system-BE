import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/routes.js";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());

// Derive __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cors
const allowedOrigins = process.env.NODE_ENV === 'development' ?
    ['http://localhost:3000'] :
    [
        'https://ingoboka-savings-management-system.onrender.com', // Render FE URL
        'https://ingoboka-savings-management-system-be.onrender.com'  // Render BE URL
    ];

app.use(cors({
    credentials: true,
    origin: function (origin, cb) {
        if (!origin) return cb(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return cb(new Error(msg), false);
        }
        return cb(null, true);
    }
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

app.use(router);

// Handle any other requests by sending back the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => console.log(`Server running at port ${port}`));