export interface ServiceDto {
  name: string
  image: string
  command?: string
  ports?: string[]
  volumes?: string[]
  networks?: string[]
  labels?: string[]
  environment?: Record<string, string>
  restart_policy?: string;
  startupScripts?: string[]
}

export interface StartupScript {
  name: string
  content: string
  type: string
}
