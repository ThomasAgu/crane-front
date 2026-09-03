import { RolesDto } from "./RolesDto";
import { GroupDto } from "./GroupDto";
import { RepositoryDto } from "./RepositoryDto";

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

export interface UserDataDtoDetails {
    id: number;
    full_name: string;
    email: string;
    username: string;
    is_active: boolean;
    roles: RolesDto[];
    groups: GroupDto[];
    repositories?: RepositoryDto[];
    publishedRepositories?: RepositoryDto[];
}