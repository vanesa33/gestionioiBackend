DROP TABLE IF EXISTS ordenclient;
DROP TABLE IF EXISTS orden;
DROP TABLE IF EXISTS ingreso;
DROP TABLE IF EXISTS client;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;


CREATE TABLE public.roles (
    rid SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL UNIQUE CHECK (NAME IN ('admin', 'facturacion','tecnico'))
);

CREATE TABLE public.users (
ruid SERIAL PRIMARY KEY,
email VARCHAR(50) NOT NULL UNIQUE,
password VARCHAR(60) NOT NULL,
username VARCHAR(50) NOT NULL,
role_id INT NOT NULL DEFAULT 3,
FOREIGN KEY (role_id) REFERENCES roles(rid)
);

INSERT INTO roles (name) VALUES ('admin');
INSERT INTO roles (name) VALUES ('facturacion');
INSERT INTO roles (name) VALUES ('tecnico');

INSERT INTO users (email, password, username, roles) VALUES
('test@test.com', '123123', 'Ivana', '1');



SELECT * FROM users;

CREATE TABLE public.client(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(60),
    apellido VARCHAR(60),
    calle VARCHAR(50),
    numero INT,
    piso INT,
    dto VARCHAR(50),
    provincia VARCHAR(50),
    localidad VARCHAR(50),
    codpost INT,
    telefono INT,
    mail VARCHAR(50)
    
	
    
	);

CREATE TABLE public.ingreso(
    iid SERIAL PRIMARY KEY,
    equipo VARCHAR(60),
    falla VARCHAR(255),
    observa VARCHAR(255),
    fecha DATE
    nserie INTEGER,
    costo INTEGER,
    numorden TEXT,
    client_id INTEGER,
    newNumOrden INTEGER,
    imagenurl TEXT
);

CREATE TABLE public.orden(
    roid SERIAL PRIMARY KEY,
    materiales VARCHAR(255),
    repuesto INTEGER,
    recurso INTEGER,
    reparado BOOLEAN,
    observa VARCHAR(255),
    detalle VARCHAR(255),
    tecnico VARCHAR(50),
    ingreso_id INTEGER, -- columna nueva para la relación
    FOREIGN KEY (ingreso_id) REFERENCES ingreso(iid)   
);

CREATE TABLE public.ordenclient(
    vid SERIAL PRIMARY KEY,
    clienting INTEGER,
    ingresoclient INTEGER,
    ordening INTEGER,
    FOREIGN KEY (vid) REFERENCES client(id),
    FOREIGN KEY (ingresoclient) REFERENCES ingreso(iid),
    FOREIGN KEY (vid) REFERENCES orden(roid)
);





---actualizar roles admin

/*UPDATE users
SET role_id = 1
WHERE email = 'admin2@admin.com';*/