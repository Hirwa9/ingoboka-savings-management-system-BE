// Local

// import { Sequelize } from "sequelize";

// const db = new Sequelize('ingoboka_sm_system', 'root', '', {
//     host: "localhost",
//     dialect: "mysql"
// });

// export default db;

// Hosted

import { Sequelize } from "sequelize";

const db = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_ROOT_PASSWORD, {
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

export default db;
