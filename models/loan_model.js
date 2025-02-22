import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Loan = db.define('loans', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    memberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: { model: 'Users', key: 'id' }, // Assuming a "Users" table exists
    },
    loanTaken: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    loanPaid: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    loanPending: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    interestTaken: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    interestPaid: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    interestPending: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    tranchesTaken: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    tranchesPaid: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    tranchesPending: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
    tableName: 'loans',
});

// Synchronized table with the model (Adds or adjusts columns without dropping the table)
// (async () => {
//     await Loan.sync({ alter: true });
// })();

export default Loan;