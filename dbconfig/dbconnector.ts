import { Pool } from "pg";

const pool = new Pool({
  max: 20,
});

export default pool;
