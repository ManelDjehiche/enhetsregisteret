

module.exports = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
}