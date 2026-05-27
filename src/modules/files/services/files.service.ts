import { Injectable, NotFoundException } from "@nestjs/common";
import { FilesRepository } from "../repositories/files.repository";
import { CreateFileDto } from "../dto/create-file.dto";
import { UpdateFileDto } from "../dto/update-file.dto";

@Injectable()
export class FilesService {
    constructor(private readonly filesRepository: FilesRepository) {}

    async findAll() {
        return this.filesRepository.findAll();
    }

    async findOne(id: number) {
        const file = await this.filesRepository.findById(id);
        if (!file) throw new NotFoundException('File not found');
        return file;
    }

    async findByUser(userId: number) {
        return this.filesRepository.findByUserId(userId);
    }

    async create(dto: CreateFileDto) {
        return this.filesRepository.create(dto);
    }

    async update(id: number, dto: UpdateFileDto) {
        const existing = await this.filesRepository.findById(id);
        if (!existing) throw new NotFoundException('File not found');
        return this.filesRepository.update(id, dto);
    }

    async delete(id: number) {
        const existing = await this.filesRepository.findById(id);
        if (!existing) throw new NotFoundException('File not found');
        return this.filesRepository.delete(id);
    }
}
