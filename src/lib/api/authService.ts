import { UserLoginDto, UserLoginResponseDto } from "../dto/UserLoginDto";
import { UserCreateDto, UserCreateResponseDto } from "../dto/UserCreateDto";
import { API_URL } from "./baseService";

export async function loginUser(credentials: UserLoginDto): Promise<UserLoginResponseDto> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Error al iniciar sesión");
  }

  const data = await response.json();
  
  return data;
}


export async function createUser(newUser: UserCreateDto): Promise<UserCreateResponseDto> {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || "Error al iniciar sesión");
    }

    const data = await response.json();

    return data;
}