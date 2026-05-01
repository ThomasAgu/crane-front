import type { ServiceDto } from './ServiceDto'

export interface AppDto {
  id: number
  name: string
  services: ServiceDto[]
  hosts?: any[] | null
  min_scale?: number | null
  current_scale?: number | null
  max_scale?: number | null
  force_stop?: boolean | null
  created_at: string 
  updated_at: string 
  deleted_at: string
  user_id: number
  status: string
}

export interface CreateAppDto {
  name: string
  services?: ServiceDto[]
  hosts?: any[] | null
  current_scale: number
  min_scale: number
  max_scale: number
  user_id: number
}

export interface StoreAppDto {
  id: number
  name: string
  services?: ServiceDto[] | null
  hosts?: any[] | null
  min_scale?: number | null
  current_scale?: number | null
  max_scale?: number | null
  created_at?: Date | Date
  updated_at?: string | Date
  user_id?: number | null
}

export interface StoreApp {
  id: number,
  app: StoreAppDto,
  description: string,
  votes_up: number,
  votes_down: number,
  favourites: number,
  isFavorite: boolean,
  downloads: number
}