import { Injectable, Inject } from '@nestjs/common';
import { File } from "../entities/file.entity";
import { DATABASE_CONNECTION } from "../../../database/database.provider";
import { type Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

@Injectable()
export class FilesRepository {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly pool: Pool
    ) {}

    async findAll(): Promise<File[]> {
        const [rows] = await this.pool.query<RowDataPacket[]>('SELECT * FROM files ORDER BY id DESC');
        return rows as File[];
    }

    async findById(id: number): Promise<File | null> {
        const [rows] = await this.pool.execute<RowDataPacket[]>('SELECT * FROM files WHERE id = ? LIMIT 1', [id]);
        const files = rows as File[];
        return files.length > 0 ? files[0] : null;
    }

    async findByUserId(userId: number): Promise<File[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>('SELECT * FROM files WHERE id_user = ? ORDER BY id DESC', [userId]);
        return rows as File[];
    }

    async create(data: Omit<File, 'id'>): Promise<File> {
        const query = 'INSERT INTO files (title, description, url, id_user) VALUES (?, ?, ?, ?)';
        const [result] = await this.pool.query<ResultSetHeader>(query, [data.title, data.description || null, data.url, data.id_user]);
        return this.findById(result.insertId) as Promise<File>;
    }

    async update(id: number, data: Partial<Omit<File, 'id'>>): Promise<File | null> {
        const fields: string[] = [];
        const values: any[] = [];

        if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
        if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
        if (data.url !== undefined) { fields.push('url = ?'); values.push(data.url); }

        if (fields.length === 0) return this.findById(id);

        const query = `UPDATE files SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);
        await this.pool.query<ResultSetHeader>(query, values);
        return this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const [result] = await this.pool.execute<ResultSetHeader>('DELETE FROM files WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}
