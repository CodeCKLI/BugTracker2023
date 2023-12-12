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
