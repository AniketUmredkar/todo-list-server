const { DataTypes } = require("sequelize");

const sequelize = require("../utils/database");

const Task = sequelize.define("task", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM,
        values: ["pending", "completed", "deleted"],
        allowNull: false,
        defaultValue: "pending",
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Task;
