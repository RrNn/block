const pgb = require('pg-promise');

const conn = {
  host: process.env.HOST || '',
  port: process.env.DB_PORT || 5432,
  database: process.env.DATABASE || '',
  user: process.env.USER || '',
  password: process.env.DB_PASSWORD || '',
};

const testingConn = {
  host: process.env.HOST || '',
  port: process.env.DB_PORT || 5432,
  database: process.env.TESTING_DATABASE || '',
  user: process.env.USER || '',
  password: process.env.TESTING_DB_PASSWORD || '',
};

const db =
  process.env.NODE_ENV === 'testing' ? pgb()(testingConn) : pgb()(conn);

module.exports = db;
