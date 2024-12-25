import knexObj from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const DB_DBNAME = process.env.DB_DBNAME;
const DB_HOST = process.env.DB_HOST;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PORT = process.env.DB_PORT;

const knex = knexObj({
  client: 'mysql2',
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DBNAME
  },
  pool: { min: 0, max: 7 }
});

export default knex;