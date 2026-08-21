import { RolesDto } from "./RolesDto";

export interface UserDto {
    id: string;
    name: string;
    email: string;
}

export interface UserDataDto {
    id: number;
    full_name: string;
    email: string;
    username: string;
    is_active: boolean;
    roles: RolesDto[];
}