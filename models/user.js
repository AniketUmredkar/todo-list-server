const db = require("../utils/database");

module.exports = class User {
    firstName;
    lastName;
    email;
    password;
    constructor(firstName, lastName, email, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

    save = () => {
        db.execute(
            `INSERT INTO users (first_name, last_name, email, password) VALUES (${this.firstName}, ${this.lastName}, ${this.email}, ${this.password})`
        );
    };
};
