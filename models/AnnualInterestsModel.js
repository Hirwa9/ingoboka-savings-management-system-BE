import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const AnnualInterest = db.define('annualinterest', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Year of record",
    },
    totalShares: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Total annual shares (All members combined)",
    },
    annualInterest: {   
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "Total interest received for the year of record, calculated as multiples of unit share value",
    },
    interestRemains: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "Total interest remained  from year of record, used as the following year's initial interest",
    },
    memberStatus: {
        type: DataTypes.JSON, // To store in JSON format
        allowNull: false,
        defaultValue: [
            {
                id: 1,
                totalShares: 0, 
                annualShares: 0,
                interestReceived: 0,
                interestRemains: 0,
            },
            {
                id: 2,
                totalShares: 0, 
                annualShares: 0,
                interestReceived: 0,
                interestRemains: 0,
            },
            {
                id: 3,
                totalShares: 0, 
                annualShares: 0,
                interestReceived: 0,
                interestRemains: 0,
            },
            {
                id: 4,
                totalShares: 0, 
                annualShares: 0,
                interestReceived: 0,
                interestRemains: 0,
            },
            {
                id: 5,
                totalShares: 0, 
                annualShares: 0,
                interestReceived: 0,
                interestRemains: 0,
            },
            {
                id: 6,
                totalShares: 0, 
                annualShares: 0,
                interestReceived: 0,
                interestRemains: 0,
            },
            {
                id: 7,
                totalShares: 0, 
                annualShares: 0,
                interestReceived: 0,
                interestRemains: 0,
            },
            {
                id: 8,
                totalShares: 0, 
                annualShares: 0,
                interestReceived: 0,
                interestRemains: 0,
            },
        ],
        comment: "Member's interest status",
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
    freezeTableName: true,
    timestamps: true,  // Adds createdAt and updatedAt fields
});

// Synchronized table with the model (Adds or adjusts columns without dropping the table)
// (async () => {
//     await AnnualInterest.sync({ alter: true });
// })();

export default AnnualInterest;