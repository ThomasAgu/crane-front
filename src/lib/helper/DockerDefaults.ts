// Esta libreria solo sirve para tener valores por defecto de puertos y volúmenes para ciertas imágenes de docker.
// En el MVP en producción le vamos a pegar a la API de Docker.

export const dockerDefaults: Record<string, any> = {
  node: {
    ports: ["3000"],
    volumes: ["/app"],
  },

  nginx: {
    ports: ["80", "443"],
    volumes: ["/usr/share/nginx/html"],
  },

  mysql: {
    ports: ["3306"],
    volumes: ["/var/lib/mysql"],
    environment: {
      MYSQL_ROOT_PASSWORD: "rootpass",
      MYSQL_DATABASE: "mydb",
      MYSQL_USER: "user",
      MYSQL_PASSWORD: "userpass",
    },
  },

  postgres: {
    ports: ["5432"],
    volumes: ["/var/lib/postgresql/data"],
    environment: {
      POSTGRES_USER: "postgres",
      POSTGRES_PASSWORD: "password",
      POSTGRES_DB: "mydb",
    },
  },

  redis: {
    ports: ["6379"],
  },

  mongo: {
    ports: ["27017"],
    volumes: ["/data/db"],
    environment: {
      MONGO_INITDB_ROOT_USERNAME: "root",
      MONGO_INITDB_ROOT_PASSWORD: "password",
    },
  },

  mariadb: {
    ports: ["3306"],
    volumes: ["/var/lib/mysql"],
    environment: {
      MARIADB_ROOT_PASSWORD: "rootpass",
      MARIADB_DATABASE: "mydb",
    },
  },

  rabbitmq: {
    ports: ["5672", "15672"],
    volumes: ["/var/lib/rabbitmq"],
    environment: {
      RABBITMQ_DEFAULT_USER: "admin",
      RABBITMQ_DEFAULT_PASS: "admin",
    },
  },

  kafka: {
    ports: ["9092"],
    environment: {
      KAFKA_BROKER_ID: "1",
      KAFKA_LISTENERS: "PLAINTEXT://:9092",
      KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://localhost:9092",
    },
  },

  elasticsearch: {
    ports: ["9200", "9300"],
    volumes: ["/usr/share/elasticsearch/data"],
    environment: {
      discoveryType: "single-node",
      ES_JAVA_OPTS: "-Xms512m -Xmx512m",
    },
  },

  kibana: {
    ports: ["5601"],
  },

  grafana: {
    ports: ["3000"],
    volumes: ["/var/lib/grafana"],
    environment: {
      GF_SECURITY_ADMIN_USER: "admin",
      GF_SECURITY_ADMIN_PASSWORD: "admin",
    },
  },

  prometheus: {
    ports: ["9090"],
    volumes: ["/prometheus"],
  },

  jenkins: {
    ports: ["8080", "50000"],
    volumes: [
      "/var/jenkins_home",
    ],
  },

  sonarqube: {
    ports: ["9000"],
    volumes: [
      "/opt/sonarqube/data",
      "/opt/sonarqube/extensions",
      "/opt/sonarqube/logs",
    ],
  },

  wordpress: {
    ports: ["80"],
    volumes: ["/var/www/html"],
    environment: {
      WORDPRESS_DB_HOST: "mysql",
      WORDPRESS_DB_USER: "user",
      WORDPRESS_DB_PASSWORD: "userpass",
      WORDPRESS_DB_NAME: "wordpress",
    },
  },

  phpmyadmin: {
    ports: ["80"],
    environment: {
      PMA_HOST: "mysql",
      PMA_PORT: "3306",
    },
  },

  minio: {
    ports: ["9000", "9001"],
    volumes: ["/data"],
    environment: {
      MINIO_ROOT_USER: "admin",
      MINIO_ROOT_PASSWORD: "password123",
    },
  },
};