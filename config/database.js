const pgb = require('pg-promise');

const conn = {
  host: process.env.HOST || '',
  port: process.env.DB_PORT || 5432,
  database: process.env.DATABASE || '',
  user: process.env.USER || '',
  password: process.env.DB_PASSWORD || '',
};
var db = pgb()(conn);

module.exports = db;
