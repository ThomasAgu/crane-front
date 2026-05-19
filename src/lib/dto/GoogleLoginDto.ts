export interface GoogleLoginDto {
  id_token: string;
}

export interface GoogleLoginResponseDto {
  access_token: string;
  token_type: string;
  expires_in: number;
}