
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbName: string = process.env.DB_NAME || "postgres";
const dbUser: string = process.env.DB_USER || "postgres";
const dbPass: string = process.env.DB_PASSWORD || "";
const dbHost: string = process.env.DB_HOST || "localhost";
const dbPort: number = Number(process.env.DB_PORT || 5432);

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: "postgres",
    logging: false, // set to true to see SQL queries in console
});

export default sequelize;
