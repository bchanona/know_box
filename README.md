# Know Back

API REST con NestJS + Fastify + MySQL (arquitectura modular).

## Tecnologías

- **Framework:** NestJS 11
- **Adapter:** Fastify
- **Base de datos:** MySQL 2 (pool de conexiones con mysql2/promise)
- **Validación:** class-validator + Joi (variables de entorno)
- **Auth:** bcrypt + JWT (autenticación basada en tokens con @nestjs/jwt)

## Requisitos

- Node.js >= 18
- MySQL
- Yarn

## Instalación

```bash
yarn install
```

## Variables de entorno

```env
# DATABASE
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=knowbox
DB_PORT=3306

# SERVER
PORT=3000

# AUTH
JWT_SECRET=knowbox_jwt_secret_key_2024_secure_token
JWT_EXPIRES_IN=24h
```

## Ejecutar

```bash
# desarrollo (watch mode)
yarn start:dev

# producción
yarn start:prod
```

## Base de datos

```sql
USE knowbox;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(150),
  url VARCHAR(500) NOT NULL,
  id_user INT,
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
);
```

## Endpoints

### Auth

| Método | Ruta | Auth | Descripción | Body |
|---|---|---|---|---|
| `POST` | `/auth/register` | ❌ | Registrar usuario | `{ fullname, email, password }` |
| `POST` | `/auth/login` | ❌ | Iniciar sesión | `{ email, password }` |
| `GET` | `/auth/profile` | ✅ JWT | Obtener perfil del usuario autenticado | — |

### Files (recursos/guías)

> Todos los endpoints de Files requieren autenticación JWT (`Authorization: Bearer <token>`).

| Método | Ruta | Descripción | Body |
|---|---|---|---|
| `GET` | `/files` | Listar todos los recursos | — |
| `GET` | `/files/:id` | Obtener un recurso por ID | — |
| `GET` | `/files/user/:userId` | Recursos de un usuario | — |
| `POST` | `/files` | Crear recurso | `{ title, description?, url }` (el `id_user` se obtiene del JWT) |
| `PUT` | `/files/:id` | Actualizar recurso | `{ title?, description?, url? }` |
| `DELETE` | `/files/:id` | Eliminar recurso | — |

## Arquitectura

```
src/
├── main.ts
├── app.module.ts
├── config/           # Configuración y validación de ENV
├── database/         # Pool de conexión MySQL (global)
└── modules/
    ├── auth/         # Registro y login
    │   ├── controllers/
    │   ├── services/
    │   ├── repositories/  # SQL queries
    │   ├── dto/
    │   └── entities/
    └── files/        # CRUD de recursos/guías
        ├── controllers/
        ├── services/
        ├── repositories/  # SQL queries
        ├── dto/
        └── entities/
```

Cada módulo es autocontenido: repositorio (SQL) → servicio (lógica) → controlador (rutas).
