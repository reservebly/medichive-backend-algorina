import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthController } from "./auth.controller";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
  providers: [AuthService, PrismaService, JwtService, ConfigService],
  controllers: [AuthController]
})
export class AuthModule {}