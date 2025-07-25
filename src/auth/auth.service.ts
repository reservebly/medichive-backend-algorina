import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
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
    const { email, password } = data;
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new HttpException(
        'invalid credentials or user not exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if user has LAB_ADMIN role
    if (user.roles !== 'LAB_ADMIN') {
      throw new HttpException(
        'Access denied. Only Lab Admins can login to this system.',
        HttpStatus.FORBIDDEN,
      );
    }

    // Direct password comparison (no hashing)
    if (password !== user.password) {
      throw new HttpException(
        'invalid credentials or user not exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = { sub: user.id, username: user.username, role: user.roles };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '1m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '7d',
    });

    const hash = refreshToken; // Store refresh token directly (no hashing)

    await this.prisma.user.update({
      where: { email: email },
      data: {
        refreshToken: hash,
      },
    });

    // await this.usersService.saveRefreshToken(user.id, refreshToken); // store in DB

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.roles,
        contactNo: user.contactNo,
        address: user.address,
        gender: user.gender,
        nic: user.nic,
        dob: user.dob,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        roles: true,
      },
    });
    return user;
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

      // Direct refresh token comparison (no hashing)
      if (token !== user.refreshToken) {
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
        expiresIn: '15m',
      });

      return { accessToken };
    } catch {
      throw new HttpException(
        'invalid credentials or user not exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async forgotPassword(email: string) {
    try {
      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        throw new HttpException(
          'Email address not found in our system',
          HttpStatus.NOT_FOUND,
        );
      }

      // For now, we'll just return a success message
      // In a real implementation, you would:
      // 1. Generate a reset token
      // 2. Save it to the database with expiration
      // 3. Send an email with the reset link
      return {
        message: 'Password reset email sent successfully',
        status: 'success',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Server error. Please try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
