const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Sent#2005",
  database: "taskmanager"
});

module.exports = db;