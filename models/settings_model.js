import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Settings = db.define('settings', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    settingsData: {
        type: DataTypes.JSON, // Store all settings as a single JSON object
        allowNull: false,
        defaultValue: {
            system: {
                name: "Ikimina Ingoboka",
                abrev: "Ingoboka",
                email: "",
                phone: "",
                pobox: "",
                motto: "",
                website: "",
                izinaRyUbutore: "",
                manager: "",
                address: {
                    country: 'Rwanda',
                    district: 'Nyarugenge',
                    sector: 'Kigali',
                    cell: 'Nyabugogo',
                },
            },
            members: {
                types: ['admin', 'member'],
                roles: ['president', 'accountant', 'umuhwituzi', 'member'],
            },
            savings: {
                monthlyDueDay: 10,
                types: [
                    { type: 'cotisation', amount: 20000, delayPenaltyAmount: 1000 },
                    { type: 'social', amount: 1000 },
                ],
            },
            expenses: {
                types: [
                    'Application expenses', 'Cheque Book', 'Leaving Members Interest',
                    'SMS Charge', 'Social', 'Withdraw fee'
                ],
            },
            credits: {
                interests: [
                    { type: 'primary', rate: 5 },
                    { type: 'secondary', rate: 10 },
                ],
            },
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    timestamps: true,
    tableName: 'settings',
});

// Uncomment this section to sync your model with the database during development
// (async () => {
//     await Settings.sync({ alter: true });
// })();

export default Settings;