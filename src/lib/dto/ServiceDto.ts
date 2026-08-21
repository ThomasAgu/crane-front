export interface ServiceDto {
  name: string
  image: string
  command?: string
  ports?: string[]
  volumes?: Array<VolumeDto | string>
  networks?: Array<NetworkDto | string>
  labels?: string[]
  environment?: Record<string, string>
  restart_policy?: string;
  startupScripts?: string[]
}

export interface VolumeDto {
  path: string
  size?: number | null
}

export interface NetworkDto {
  name: string
  driver?: string | null
  address?: string | null
  mask?: number | string | null
  gateway?: string | null
}

export interface StartupScript {
  name: string
  content: string
  type: string
}
