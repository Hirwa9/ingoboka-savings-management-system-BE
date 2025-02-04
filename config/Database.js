import { Sequelize } from "sequelize";

const db = new Sequelize('alain_sm_system', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;