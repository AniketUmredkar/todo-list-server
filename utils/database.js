const { Sequelize } = require("sequelize");

console.log("user", process.env.DATABASE_USER);

const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    dialect: "mysql",
    host: process.env.DATABASE_HOST,
});

module.exports = sequelize;