// Esta libreria solo sirve para tener valores por defecto de puertos y volúmenes para ciertas imágenes de docker en el MVP en produccion le vamos a pegar a la API de docker

export const dockerDefaults: Record<string, any> = {
  "bitnami/node": {
    ports: ["3000"],
    volumes: ["/app"],
  },
  "nginx": {
    ports: ["80", "443"],
    volumes: ["/usr/share/nginx/html"],
  },
  "mysql": {
    ports: ["3306"],
    volumes: ["/var/lib/mysql"],
  },
  "redis": {
    ports: ["6379"],
  },
  "postgres": {
    ports: ["5432"],
    volumes: ["/var/lib/postgresql/data"],
  },
};
