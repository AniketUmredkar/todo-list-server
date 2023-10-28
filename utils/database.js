const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "bDBfo5$Alh",
    database: "to_do_list",
});

module.exports = pool.promise();
