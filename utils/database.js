const { Sequelize } = require("sequelize");

const getSequelize = () => {
    const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
        dialect: "mysql",
        host: process.env.DATABASE_HOST,
    });
    return sequelize;
};

module.exports = getSequelize;
