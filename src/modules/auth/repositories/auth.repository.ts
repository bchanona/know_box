import {Injectable, Inject} from '@nestjs/common';
import {User} from "../entities/user.entity";
import {DATABASE_CONNECTION} from "../../../database/database.provider";
import { type Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

@Injectable()
export class AuthRepository{
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly pool: Pool
    ){}
    async findById(id: number): Promise<User | null>{
        const [rows] = await this.pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
        const users = rows as User[];
        return users.length > 0 ? users[0]: null;
    }

    async create(user: Omit<User, 'id'>): Promise<User>{
        const query = 'INSERT INTO users (fullname, email, password) VALUES (?,?,?)';
        const [result] = await this.pool.query<ResultSetHeader>(query, [user.fullname, user.email, user.password]);
        return this.findById(result.insertId) as Promise<User>;

    }

    async findByEmail(email: string): Promise<User | null>{
        const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
        const [rows] = await this.pool.query<RowDataPacket[]>(query, [email]);
        const users = rows as User[];
        return users.length > 0 ? users[0]: null;
    }
}