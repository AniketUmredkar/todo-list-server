const dotenv = require("dotenv");
const environment = process.env.NODE_ENV || "local";
dotenv.config({ path: `.env.${environment}` });

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const { get404 } = require("./controllers/error");
const sequelize = require("./utils/database");
const User = require("./models/user");
const Task = require("./models/task");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const { fetchSecretFromSecretsManager } = require("./utils/aws");

const logFilePath = __dirname + "/access.log";
const accessLogStream = fs.createWriteStream(logFilePath, { flags: "a" });

app.use(morgan("combined", { stream: accessLogStream }));

app.use(
    cors({
        origin: [process.env.CLIENT_DOMAIN],
    })
);

app.use(bodyParser.json());

app.use("/auth", authRoutes);

app.use("/task", taskRoutes);

app.use(get404);

User.hasMany(Task, { foreignKey: "user_id" });

sequelize
    .sync()
    .then(() => {
        fetchSecretFromSecretsManager(environment)
            .then(() => {
                app.listen(process.env.PORT || 8080);
            })
            .catch((err) => {
                console.log(err);
            });
    })
    .catch((err) => {
        console.log(err);
    });
