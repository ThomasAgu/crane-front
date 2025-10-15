export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserLoginResponseDto {
    access_token: string;
    token_type: string;
}

