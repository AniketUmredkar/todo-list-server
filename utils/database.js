const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("to_do_list", "root", "bDBfo5$Alh", {
    dialect: "mysql",
    host: "localhost",
});

module.exports = sequelize;
