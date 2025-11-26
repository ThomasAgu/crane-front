import type { ServiceDto } from './ServiceDto'

export interface AppDto {
  id: number
  name: string
  services?: ServiceDto[] | null
  hosts?: any[] | null
  min_scale?: number | null
  current_scale?: number | null
  max_scale?: number | null
  force_stop?: boolean | null
  created_at?: Date | Date
  updated_at?: string | null
  deleted_at?: string | null
  user_id?: number | null
  status: string
}

export interface CreateAppDto {
  name: string
  services?: ServiceDto[] | null
  hosts?: any[] | null
  current_scale?: number | 1
  min_scale?: number | 1
  max_scale?: number | 1
  user_id?: number | null
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
  updated_at?: string | null
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