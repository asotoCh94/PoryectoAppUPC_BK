import * as mysql from 'mysql2/promise';
import { databaseConfig } from 'src/database.config';

let connection;

export async function getDatabaseConnection() {
    if (!connection) {
        connection = await mysql.createConnection(databaseConfig);
    }
    return connection;
}