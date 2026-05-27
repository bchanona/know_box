import {Provider} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import * as mysql from 'mysql2/promise';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const databaseProvider: Provider[] = [
    {
        provide: DATABASE_CONNECTION,
        useFactory: async (config: ConfigService) => {
            const pool = mysql.createPool({
                host: config.get<string>('DATABASE.DB_HOST'),
                port: config.get<number>('DATABASE.DB_PORT'),
                user: config.get<string>('DATABASE.DB_USER'),
                password: config.get<string>('DATABASE.DB_PASSWORD'),
                database: config.get<string>('DATABASE.DB_NAME'),
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
            return pool;

        },
        inject: [ConfigService],
    }
];
