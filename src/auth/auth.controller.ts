import { Body, Controller, Post, Put, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { FileToBodyInterceptor } from 'src/support/interceptors/file-to-body.interceptor';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { SlugifierInterceptor } from 'src/support/interceptors/slugifier.interceptor';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginAdminResponse } from './dto/login-admin-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginSellerResponseDto } from './dto/login-seller-response.dto';
import { RegisterClientDto } from './dto/register-client.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RegisterSellerResponseDto } from './dto/register-seller-response.dto';
import { RegisterSellersDto } from './dto/register-seller.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthAdminGuard } from './guards/local-auth-admin.guard';
import { LocalAuthSellerGuard } from './guards/local-auth-seller.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req): Promise<LoginResponseDto> {
        return plainToClass(LoginResponseDto, this.authService.login(req.user));
    }

    @Post('/register')
    async register(@Body() registerUserDto: RegisterClientDto): Promise<RegisterResponseDto> {
        return plainToClass(RegisterResponseDto, await this.authService.register(registerUserDto));
    }

    @Put('/password')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new JwtUserToBodyInterceptor())
    async updateClientPassword(@Body() updatePasswordDto: UpdatePasswordDto): Promise<void> {
        await this.authService.updatePassword(updatePasswordDto);
    }

    @UseGuards(LocalAuthSellerGuard)
    @Post('/login-seller')
    async loginSeller(@Request() req): Promise<LoginSellerResponseDto> {
        return plainToClass(LoginSellerResponseDto, this.authService.login(req.user));
    }

    @Post('/register-store')
    @UseInterceptors(FileInterceptor('credential', { dest: './uploads/sellers' }), new FileToBodyInterceptor('credential'), new SlugifierInterceptor({name: 'slug'}))
    async registerStore(@Body() registerSellerDto: RegisterSellersDto): Promise<RegisterSellerResponseDto> {
        return plainToClass(RegisterSellerResponseDto, await this.authService.registerStore(registerSellerDto));
    }

    @UseGuards(LocalAuthAdminGuard)
    @Post('/login-admin')
    async loginAdmin(@Request() req): Promise<LoginAdminResponse> {
        return plainToClass(LoginAdminResponse, this.authService.login(req.user));
    }

    @Post('/forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
        return await this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post('/reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
        return await this.authService.resetPassword(resetPasswordDto);
    }
}
