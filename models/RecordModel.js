import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Record = db.define('records', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    memberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    recordType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    recordSecondaryType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    recordAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
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
//     await Record.sync({ alter: true });
// })();

export default Record;