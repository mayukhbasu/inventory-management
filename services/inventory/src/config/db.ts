import { Pool } from "pg";

export const pool = new Pool({
    user: 'dragunov',
    host: 'localhost',
    database: 'dragunov',
    password: 'dragunov',
    port: 5432,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);