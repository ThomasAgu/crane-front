export interface ServiceDto {
  name: string
  image: string
  command?: string
  ports?: string[]
  volumes?: string[]
  networks?: string[]
  labels?: string[]
  environment?: Record<string, string>
  startupScripts?: string[] // Array of file names or paths
}

export interface StartupScript {
  name: string
  content: string // Base64 or file content
  type: string // File type (e.g., 'sql', 'sh', 'js')
}
