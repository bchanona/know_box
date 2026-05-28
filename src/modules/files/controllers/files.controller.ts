import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { FilesService } from "../services/files.service";
import { CreateFileDto } from "../dto/create-file.dto";
import { UpdateFileDto } from "../dto/update-file.dto";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";

@Controller('files')
@UseGuards(AuthGuard)
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Get()
    async findAll() {
        return this.filesService.findAll();
    }

    @Get('user/:userId')
    async findByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.filesService.findByUser(userId);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.filesService.findOne(id);
    }

    @Post()
    async create(@Body() dto: CreateFileDto, @CurrentUser('sub') userId: number) {
        return this.filesService.create({ ...dto, id_user: userId });
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFileDto) {
        return this.filesService.update(id, dto);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.filesService.delete(id);
    }
}
