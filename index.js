const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const authRoutes = require("./routes/auth");
const { get404 } = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/auth", authRoutes);

app.use(get404);

app.listen(8080);
