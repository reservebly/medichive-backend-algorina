import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(data: LoginDto) {
    const { username, password } = data;
    const user = await this.prisma.user.findUnique({
      where: { email: username },
    });

    if (!user) {
      throw new HttpException(
        'invalid credentials or user not exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new HttpException(
        'invalid credentials or user not exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = { sub: user.id, username: user.username, role: user.roles };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '10m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '7d',
    });

    const hash = await bcrypt.hash(refreshToken, 12);

    await this.prisma.user.update({
      where: { email: username },
      data: {
        refreshToken: hash,
      },
    });

    
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user || !user.refreshToken) {
        throw new HttpException(
          'invalid credentials or user not exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const isMatch = await bcrypt.compare(token, user.refreshToken);

      if (!isMatch) {
        throw new HttpException(
          'invalid credentials or user not exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const payload = {
        sub: user.id,
        username: user.username,
        role: user.roles,
      };
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '10m',
      });

      return { accessToken };
    } catch {
      throw new HttpException(
        'invalid credentials or user not exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
