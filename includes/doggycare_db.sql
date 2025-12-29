CREATE DATABASE doggycare_db;
USE doggycare_db;

-- Tabla de Dueños
CREATE TABLE usuarios (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ap_paterno VARCHAR(100) NOT NULL,
    ap_materno VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Direcciones (Relación 1:1 o 1:N con usuarios)
CREATE TABLE direcciones (
    id_direccion BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT,
    calle VARCHAR(100),
    no_exterior VARCHAR(20),
    no_interior VARCHAR(20),
    colonia VARCHAR(100),
    alcaldia VARCHAR(100),
    estado VARCHAR(100),
    cp VARCHAR(10),
    tipo_calle VARCHAR(50),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Tabla de Mascotas
CREATE TABLE mascotas (
    id_mascota BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_dueno BIGINT,
    nombre VARCHAR(100) NOT NULL,
    especie ENUM('Perro', 'Gato') NOT NULL,
    raza VARCHAR(100), -- Puede venir de un select
    sexo ENUM('Macho', 'Hembra'),
    tamano ENUM('Pequeño', 'Mediano', 'Grande', 'Gigante'),
    tipo_pelo ENUM('Corto', 'Largo', 'Rizado', 'Sin pelo'),
    color_pelo VARCHAR(50),
    esterilizado BOOLEAN DEFAULT FALSE,
    senas_particulares TEXT,
    ruac VARCHAR(50),
    tiene_chip BOOLEAN DEFAULT FALSE,
    tipo_chip VARCHAR(100),
    numero_chip VARCHAR(100),
    esta_extraviada BOOLEAN DEFAULT FALSE, -- Por defecto NO está perdida
    foto_url VARCHAR(255),
    FOREIGN KEY (id_dueno) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Tabla de Vacunas (Relación 1:N con Mascotas)
CREATE TABLE vacunas (
    id_vacuna BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_mascota BIGINT,
    nombre_vacuna VARCHAR(100),
    fecha_aplicacion DATE,
    duracion_meses INT, -- Cuánto dura la vacuna
    FOREIGN KEY (id_mascota) REFERENCES mascotas(id_mascota) ON DELETE CASCADE
);