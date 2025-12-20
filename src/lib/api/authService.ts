import apiRequest from "./apiClient";
import { UserLoginDto, UserLoginResponseDto } from "../dto/UserLoginDto";
import { UserCreateDto, UserCreateResponseDto } from "../dto/UserCreateDto";

//POST
const loginUser = (credentials: UserLoginDto) =>
  apiRequest<UserLoginResponseDto>("/auth/login", "POST", credentials, false);

const createUser = (newUser: UserCreateDto) =>
  apiRequest<UserCreateResponseDto>("/auth/register", "POST", newUser, false);

export const AuthService = {
  login: loginUser,
  create: createUser,
};