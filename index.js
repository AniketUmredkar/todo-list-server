const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const { get404 } = require("./controllers/error");
const sequelize = require("./utils/database");

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/auth", authRoutes);

app.use("/task", taskRoutes);

app.use(get404);

sequelize
    .sync()
    .then(() => {
        app.listen(8080);
    })
    .catch((err) => {
        console.log(err);
    });
