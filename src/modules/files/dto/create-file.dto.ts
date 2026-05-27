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

    @IsNotEmpty()
    @IsNumber()
    id_user!: number;
}
