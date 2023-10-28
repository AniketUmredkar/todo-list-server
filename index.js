const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const { get404 } = require("./controllers/error");
const sequelize = require("./utils/database");
const User = require("./models/user");
const Task = require("./models/task");

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    User.findOne({
        where: {
            id: 1,
        },
    })
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => {
            console.log(err);
            res.status(403).send({ message: "Unidentified user!" });
        });
});

app.use("/auth", authRoutes);

app.use("/task", taskRoutes);

app.use(get404);

User.hasMany(Task, { foreignKey: "user_id" });

sequelize
    .sync()
    .then(() => {
        app.listen(8080);
    })
    .catch((err) => {
        console.log(err);
    });
