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
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const sessionStore = new MySQLStore({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "bDBfo5$Alh",
    database: "to_do_list",
});

app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    })
);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 5000000,
        },
        store: sessionStore,
    })
);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
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
