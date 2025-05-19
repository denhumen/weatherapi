require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host:     process.env.DB_HOST,
    dialect:  "postgres",
  },

  test: {
    username: "",
    password: null,
    database: ":memory:",
    host:     "",
    dialect:  "sqlite",
    storage:  ":memory:",
    logging:  false
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host:     process.env.DB_HOST,
    dialect:  "postgres",
  }
};
