import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from "sequelize";

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db;

if (process.env.NODE_ENV === 'development') {
    // Local
    db = new Sequelize('ingoboka_sm_system', 'root', '', {
        host: "localhost",
        dialect: "mysql"
    });
} else {
    // Hosted
    db = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_ROOT_PASSWORD, {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: "mysql",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });
}

export default db;

export const backupDatabase = async (req, res) => {
    try {
        const dbUser = process.env.NODE_ENV === 'development' ? 'root' : process.env.MYSQL_USER;
        const dbPass = process.env.NODE_ENV === 'development' ? '' : process.env.MYSQL_ROOT_PASSWORD;
        const dbName = process.env.MYSQL_DATABASE;

        if (!dbName) {
            return res.status(400).json({ error: "Database name is missing in environment variables" });
        }

        // Define the backup directory (one step up from the current directory)
        const backupDir = path.join(__dirname, '..', 'bdBackups');

        // Create the backup directory if it doesn't exist
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true }); // `recursive: true` ensures parent directories are created if needed
        }

        // Define backup file path inside the backup directory
        const backupFile = path.join(backupDir, `databaseBackup_${Date.now()}.sql`);

        // Construct the MySQL dump command
        let command;
        if (dbPass) {
            command = `mysqldump -u ${dbUser} -p'${dbPass}' ${dbName} > ${backupFile}`;
        } else {
            command = `mysqldump -u ${dbUser} ${dbName} > ${backupFile}`;
        }

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Error creating backup:', error);
                return res.status(500).json({ error: "Error creating database backup", details: error.message });
            }

            if (stderr) {
                console.warn('mysqldump stderr:', stderr);
            }

            console.log(`Backup saved as ${backupFile}`);
            res.status(200).json({ message: `Backup created successfully`, backupFile });
        });

    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};