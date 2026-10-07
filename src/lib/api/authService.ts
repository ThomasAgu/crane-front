import apiRequest from "./apiClient";
import { UserLoginDto } from "../dto/UserLoginDto";
import { UserCreateDto } from "../dto/UserCreateDto";
import { GoogleLoginDto } from "../dto/GoogleLoginDto";
import { AuthResponseDto } from "../dto/AuthDto";

//POST
const loginUser = (credentials: UserLoginDto) =>
  apiRequest<AuthResponseDto>("/auth/login", "POST", credentials, false);

const createUser = (newUser: UserCreateDto) =>
  apiRequest<AuthResponseDto>("/auth/register", "POST", newUser, false);

const googleLogin = (googleData: GoogleLoginDto): Promise<AuthResponseDto> => {
  return apiRequest<AuthResponseDto>("/auth/google", "POST", googleData, false);
}
  

export const AuthService = {
  login: loginUser,
  create: createUser,
  googleLogin: googleLogin,
};