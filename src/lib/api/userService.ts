import apiRequest from "./apiClient";
import { UserDataDto, UserDataDtoDetails} from "../dto/UserDto";

//GET
const getUsers = () => 
  apiRequest<UserDataDto[]>("/users");

// Esta no se usa asi que podemos modificarla
const getUser = (id: string) =>
  apiRequest<UserDataDtoDetails>(`/users/${id}`);

const enableUser = (userID: number) => 
  apiRequest<void>(`/users/enable/${userID}`, "POST");

const disableUser = (userID: number) => 
  apiRequest<void>(`/users/disable/${userID}`, "POST");

export const UserService = {
  getAll: getUsers,
  get: getUser,
  enable: enableUser,
  disable: disableUser
}