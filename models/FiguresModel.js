import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Figures = db.define('figures', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    balance: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: "Account balance",
    },
    paidCapital: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: "Total paid capital on entry",
    },
    loanDisbursed: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: "Total loan disbursed",
    },
    paidInterest: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: "Total interest paid over years",
    },
    distributedInterest: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: "Total interest distributed over years",
    },
    penalties: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: "Total penalties applied",
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
    timestamps: true,
});

// Sync table with database
// (async () => {
//     await Figures.sync({ alter: true });
// })();

export default Figures;
