export interface RepositoryDto {
  id: number;
  name: string;
  description: string;
  services: string;
  downloads: number;
  favourites: number;
  is_favourite: boolean;
  state: 'pending' | 'approved' | 'rejected';
  is_voted_positive: boolean;
  is_voted_negative: boolean;
  votes: number;
  user_id: number;
  app_id: number;
  created_at?: string | Date;
  updated_at?: string | Date; 
  deleted_at?: string | Date;
}

export interface onHoldRepositoryDto {
  id: number;
  name: string;
  description: string;
  services: string;
  state: 'pending' | 'approved' | 'rejected';
  votes: number;
  user_id: number;
  app_id: number;
  created_at?: string | Date;
  updated_at?: string | Date; 
  deleted_at?: string | Date;
}


export interface CreateRepositoryDto {
  name: string;
  description: string;
  services: string;
  user_id: number;
  app_id: number;
}