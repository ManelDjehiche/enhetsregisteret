const { Sequelize } = require("sequelize");
require("dotenv").config();
const config = require("../config/config");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => console.log("Connection established"))
  .catch((err) => console.error("Connection failed", err));

module.exports = { sequelize, Sequelize };