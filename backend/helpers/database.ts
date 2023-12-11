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

const Pool = pg.Pool;
export const db = new Pool({
  connectionString:
    "postgres://ticket_app_f5o4_user:7sSwpZA9J3Ws95MFddHuFNIbDutVWjtl@dpg-clajgrunt67s738ngk30-a.oregon-postgres.render.com/ticket_app_f5o4",
  ssl: {
    rejectUnauthorized: false,
  },
});
