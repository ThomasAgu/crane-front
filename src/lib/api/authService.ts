import apiRequest from "./apiClient";
import { UserLoginDto, UserLoginResponseDto } from "../dto/UserLoginDto";
import { UserCreateDto, UserCreateResponseDto } from "../dto/UserCreateDto";
import { GoogleLoginDto, GoogleLoginResponseDto } from "../dto/GoogleLoginDto";

//POST
const loginUser = (credentials: UserLoginDto) =>
  apiRequest<UserLoginResponseDto>("/auth/login", "POST", credentials, false);

const createUser = (newUser: UserCreateDto) =>
  apiRequest<UserCreateResponseDto>("/auth/register", "POST", newUser, false);

const googleLogin = (googleData: GoogleLoginDto): Promise<GoogleLoginResponseDto> => {
  return apiRequest<GoogleLoginResponseDto>("/auth/google", "POST", googleData, false);
}
  

export const AuthService = {
  login: loginUser,
  create: createUser,
  googleLogin: googleLogin,
};