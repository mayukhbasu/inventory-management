import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST as string || 'localhost', // You might want to provide a default value
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: 5432, // You might want to provide a default value
});

export const query = (text: string, params?: any[]) => pool.query(text, params);