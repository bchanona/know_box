import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { FilesController } from "./controllers/files.controller";
import { FilesService } from "./services/files.service";
import { FilesRepository } from "./repositories/files.repository";

@Module({
    imports: [AuthModule],
    controllers: [FilesController],
    providers: [FilesService, FilesRepository],
})
export class FilesModule {}
