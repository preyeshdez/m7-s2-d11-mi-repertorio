import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    user: "node",
    password: "123456",
    host: "localhost",
    port: 5432,
    database: "repertorio",
    idleTimeoutMillis: 5000
});

export default pool;