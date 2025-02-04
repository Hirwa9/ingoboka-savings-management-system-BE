import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Settings = db.define('settings', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    // System settings
    logo: {
        type: DataTypes.STRING, // Path to the uploaded logo file
        allowNull: true,
    },
    stamp: {
        type: DataTypes.STRING, // Path to the uploaded stamp file
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    poBox: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    motto: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    izinaRyUbutore: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    manager: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    locationCountry: {
        type: DataTypes.STRING,
        defaultValue: 'Rwanda',
    },
    locationDistrict: {
        type: DataTypes.STRING,
        defaultValue: 'Kigali',
    },
    locationSector: {
        type: DataTypes.STRING,
        defaultValue: 'Kigali',
    },
    locationCell: {
        type: DataTypes.STRING,
        defaultValue: 'Nyabugogo',
    },

    // Credit settings
    creditInterest5: {
        type: DataTypes.FLOAT,
        defaultValue: 5,
    },
    creditInterest10: {
        type: DataTypes.FLOAT,
        defaultValue: 10,
    },
    creditPenalty: {
        type: DataTypes.FLOAT,
        defaultValue: 2,
    },

    // Share settings
    shareValuePerShare: {
        type: DataTypes.INTEGER,
        defaultValue: 20000,
    },

    // Savings settings
    savingsDueDate: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
    },
    savingsDelayPenalty: {
        type: DataTypes.INTEGER,
        defaultValue: 1000,
    },

    // JSON fields for flexible settings
    roleSettings: {
        type: DataTypes.JSON, // Store roles in JSON format
        defaultValue: ["President", "Accountant", "Umuhwituzi", "Member"],
    },
    expenseTypes: {
        type: DataTypes.JSON, // Store expense types in JSON format
        defaultValue: [
            "Application expenses",
            "Cheque Book",
            "Leaving Members Interest",
            "SMS Charge",
            "Social",
            "Withdraw fee",
        ],
    },
    savingsTypes: {
        type: DataTypes.JSON, // Store savings types in JSON format
        defaultValue: ["Cotisation", "Social"],
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
