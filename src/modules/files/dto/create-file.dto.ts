import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";

export class CreateFileDto {
    @IsNotEmpty()
    @IsString()
    title!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    url!: string;

    @IsOptional()
    @IsNumber()
    id_user?: number;
}
