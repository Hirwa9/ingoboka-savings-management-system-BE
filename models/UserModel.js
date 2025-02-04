import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const User = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'removed'),
        allowNull: false,
        defaultValue: 'active',
    },
    type: {
        type: DataTypes.ENUM('member', 'admin'),
        allowNull: false,
        defaultValue: 'member',
    },
    role: {
        type: DataTypes.ENUM('member', 'accountant', 'president', 'umuhwituzi'),
        allowNull: false,
        defaultValue: 'member',
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    husbandFirstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    husbandLastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    husbandPhone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    husbandEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    husbandAvatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    wifeFirstName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    wifeLastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    wifePhone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    wifeEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    wifeAvatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shares: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    annualShares: {
        type: DataTypes.JSON, // To store in JSON format
        allowNull: false,
        defaultValue: [
            { month: 'January', paid: false, hasPenalties: false },
            { month: 'February', paid: false, hasPenalties: false },
            { month: 'March', paid: false, hasPenalties: false },
            { month: 'April', paid: false, hasPenalties: false },
            { month: 'May', paid: false, hasPenalties: false },
            { month: 'June', paid: false, hasPenalties: false },
            { month: 'July', paid: false, hasPenalties: false },
            { month: 'August', paid: false, hasPenalties: false },
            { month: 'September', paid: false, hasPenalties: false },
            { month: 'October', paid: false, hasPenalties: false },
            { month: 'November', paid: false, hasPenalties: false },
            { month: 'December', paid: false, hasPenalties: false },
        ],
    },
    cotisation: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    social: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tokenExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    otpExpiration: {
        type: DataTypes.DATE,
        allowNull: true
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
//     // await db.sync({ alter: true });
//     // await Credit.sync({ force: true, alter: true });
//     // await Credit.sync({ alter: true });
//     await User.sync({ alter: true });
// })();

export default User;