import { Controller, Post, Get, Body, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { AuthGuard } from "../guards/auth.guard";
import { CurrentUser } from "../decorators/current-user.decorator";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return await this.authService.register(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return await this.authService.login(dto);
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    async profile(@CurrentUser() user: any) {
        return user;
    }
}