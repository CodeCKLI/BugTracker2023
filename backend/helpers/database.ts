// import mysql from "mysql2";

// export const db = mysql
//   .createPool({
//     host: "127.0.0.1",
//     user: "root",
//     password: "password",
//     database: "ticket_app",
//   })
//   .promise();

import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const Pool = pg.Pool;
export const db = new Pool({
  connectionString: process.env.DATABASE_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});
