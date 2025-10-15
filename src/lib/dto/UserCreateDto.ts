export interface UserCreateDto {
  full_name: string;
  email: string;
  password: string;
}

export interface UserCreateResponseDto {
  access_token: string;
  token_type: string;
}
