import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GetRefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() data: LoginDto) {
    return await this.authService.login(data);
  }

  @Post('refresh')
  async refreshToken(@Body() data: GetRefreshTokenDto) {
    return await this.authService.refreshToken(data.refreshToken);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return await this.authService.forgotPassword(email);
  }
}
