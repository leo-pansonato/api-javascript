const pgp = require('pg-promise')({
  capSQL: true
});
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT } = process.env;

const cn = {
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: PGPORT,
  ssl: { rejectUnauthorized: false }
};

const sql = pgp(cn);

module.exports = sql;