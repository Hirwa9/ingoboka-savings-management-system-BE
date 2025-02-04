import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Credit = db.define('credits', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    memberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    creditAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    requestDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    tranches: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
        allowNull: false,
    },
    rejectionMessage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fullyPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    creditPayment: {
        type: DataTypes.JSON, // Storing payment details as JSON
        allowNull: false,
        defaultValue: [], // Default is an empty array
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
//     await Credit.sync({ alter: true });
// })();

export default Credit;