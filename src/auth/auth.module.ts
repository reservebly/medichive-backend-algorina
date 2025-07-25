import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [PrismaModule],
  providers: [AuthService, JwtService, ConfigService],
  controllers: [AuthController]
})
export class AuthModule {}