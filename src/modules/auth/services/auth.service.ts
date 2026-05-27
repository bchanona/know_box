import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../repositories/auth.repository";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly authRepository: AuthRepository ){}

    async register(dto : RegisterDto ){
        const existing = await this.authRepository.findByEmail(dto.email);
        if (existing){
            throw new Error('Email already in use');
        }
        //Encriptar la contraseña antes de guardarla en la base de datos
        const hashedPasssword = await bcrypt.hash(dto.password, 10);
   
        const user = await this.authRepository.create({...dto, password: hashedPasssword});
        const { password, ...result } = user;
        return result;
    }

    async login(dto : LoginDto){
        const user = await this.authRepository.findByEmail(dto.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        const { password, ...result } = user;
        return result;
    }
}