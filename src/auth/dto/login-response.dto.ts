export class LoginResponseDto {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    username: string;
    roles: string;
  };
}
