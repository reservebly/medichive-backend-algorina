import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class GetRefreshTokenDto {
  @IsNotEmpty()
  refreshToken: string;
}
