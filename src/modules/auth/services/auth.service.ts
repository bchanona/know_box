import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthRepository } from "../repositories/auth.repository";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService,
    ){}

    async register(dto : RegisterDto ){
        const existing = await this.authRepository.findByEmail(dto.email);
        if (existing){
            throw new ConflictException('Email already in use');
        }
        const hashedPasssword = await bcrypt.hash(dto.password, 10);
   
        const user = await this.authRepository.create({...dto, password: hashedPasssword});
        const { password, ...userData } = user;

        const token = await this.jwtService.signAsync({ sub: userData.id, email: userData.email });

        return { user: userData, token };
    }

    async login(dto : LoginDto){
        const user = await this.authRepository.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const { password, ...userData } = user;

        const token = await this.jwtService.signAsync({ sub: userData.id, email: userData.email });

        return { user: userData, token };
    }
}