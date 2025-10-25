import apiRequest from "./baseService";
import { UserLoginDto, UserLoginResponseDto } from "../dto/UserLoginDto";
import { UserCreateDto, UserCreateResponseDto } from "../dto/UserCreateDto";

//POST
export const loginUser = (credentials: UserLoginDto) =>
  apiRequest<UserLoginResponseDto>("/auth/login", "POST", credentials, false);

export const createUser = (newUser: UserCreateDto) =>
  apiRequest<UserCreateResponseDto>("/auth/register", "POST", newUser, false);
