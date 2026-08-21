-- 1. Crear una base de datos
CREATE DATABASE Empresa;
USE Empresa;

-- 2. Crear una tabla
CREATE TABLE Usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Insertar datos
INSERT INTO Usuarios (nombre, email) 
VALUES ('Juan Perez', 'juan@example.com');
INSERT INTO Usuarios (nombre, email) 
VALUES ('Maria Lopez', 'maria@example.com');

-- 4. Consultar datos
SELECT * FROM Usuarios;
SELECT nombre FROM Usuarios WHERE id = 1;

-- 5. Actualizar datos
UPDATE Usuarios 
SET email = 'juan.perez@nuevo.com' 
WHERE id = 1;

-- 6. Eliminar datos
DELETE FROM Usuarios 
WHERE id = 2;
