module.exports = {
  development: {
    username: process.env.DB_USER     || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME     || "weatherdb",
    host:     process.env.DB_HOST     || "db",
    dialect:  "postgres",
  }
};  