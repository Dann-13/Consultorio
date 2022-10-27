CREATE TABLE pacientes (
	id varchar(30) NOT NULL,
	nombre varchar(100) NOT NULL,
	email varchar(100) NOT NULL,
	CONSTRAINT pacientes_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

CREATE TABLE medicos (
	id varchar(30) NOT NULL,
	nombre varchar (100) NOT NULL,
	CONSTRAINT medicos_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

CREATE TABLE citas (
	id INT auto_increment NOT NULL,
	numero_identificacion varchar(30) NOT NULL,
	hora varchar(15) NOT NULL,
	fecha varchar(20) NOT NULL,
	id_medico varchar(30) NOT NULL,
	id_paciente varchar(30) NOT NULL,
	CONSTRAINT citas_PK PRIMARY KEY (id),
	CONSTRAINT citas_FK_1 FOREIGN KEY (id_medico) REFERENCES medicos(id),
	CONSTRAINT citas_FK_2 FOREIGN KEY (id_paciente) REFERENCES pacientes(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;