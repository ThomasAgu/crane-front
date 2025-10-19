export interface ServiceDto {
  name: string
  image: string
  command?: string
  ports?: string[]
  volumes?: string[]
  networks?: string[]
  labels?: string[]
}
