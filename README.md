# Sistema de administracion - Gestor Administrativo de Proyectos

API REST en Spring Boot para administrar proyectos y tareas. El sistema permite que un lider de proyecto cree proyectos, asigne tareas, actualice estados y consulte tareas por proyecto.

## Objetivos

- Administrar proyectos con CRUD completo.
- Administrar tareas asociadas a un proyecto.
- Persistir la informacion en MySQL con JPA/Hibernate.
- Proteger los endpoints con JWT y roles.
- Documentar pruebas API para Postman.

## Tecnologias

- Java 21
- Spring Boot 3.4.1
- Spring Web
- Spring Data JPA / Hibernate
- Spring Security
- JWT con `jjwt`
- MySQL
- Maven

## Modelo de datos resumido

- `Project`: `id`, `name`, `description`, `leaderName`, `clientName`, `startDate`, `endDate`, `status`, `priority`, `budget`, `createdAt`, `updatedAt`, `tasks`.
- `Task`: `id`, `title`, `description`, `assignedTo`, `status`, `priority`, `startDate`, `dueDate`, `createdAt`, `updatedAt`, `project`.
- `User`: `id`, `username`, `fullName`, `email`, `password`, `role`, `isActive`.
- `Role`: `id`, `name`.

Relacion principal:

```text
Project 1 --- N Task
```

La relacion se mapea con `@OneToMany` en `Project` y `@ManyToOne` en `Task`. Para evitar recursion JSON se usa `@JsonManagedReference` y `@JsonBackReference`.

## Configuracion de MySQL

La aplicacion usa la base de datos `gestor_administrativo`.

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gestor_administrativo?createDatabaseIfNotExist=true&serverTimezone=UTC&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=Samuelgm0
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Tambien puedes sobreescribir credenciales con variables de entorno:

```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="tu_password"
$env:JWT_SECRET="gestor-administrativo-secret-key-for-jwt-development-2026"
```

## Como ejecutar

```powershell
cd gestor-administrativo
.\mvnw.cmd spring-boot:run
```

La API queda disponible en:

```text
http://localhost:8082
```

## Seguridad

Endpoints publicos:

- `POST /api/auth/register`
- `POST /api/auth/login`

Endpoints de proyectos y tareas requieren token Bearer. Para crear, actualizar o eliminar proyectos/tareas bajo `/api/projects/**`, usa un usuario con rol `ADMIN` o `PROJECT_LEADER`. El rol `MEMBER` puede consultar proyectos y tareas.

## Endpoints principales

Autenticacion:

- `POST /api/auth/register`
- `POST /api/auth/login`

Proyectos:

- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/{id}`
- `PUT /api/projects/{id}`
- `DELETE /api/projects/{id}`

Tareas por proyecto:

- `POST /api/projects/{id}/tasks`
- `GET /api/projects/{id}/tasks`
- `PUT /api/projects/tasks/{taskId}`
- `PUT /api/projects/tasks/{taskId}?status=IN_PROGRESS`
- `DELETE /api/projects/tasks/{taskId}`

## Pruebas en Postman

Configura una variable de entorno:

```text
baseUrl = http://localhost:8082
```

### 1. Register user

`POST {{baseUrl}}/api/auth/register`

```json
{
  "username": "lider1",
  "fullName": "Lider de Proyecto",
  "email": "lider1@example.com",
  "password": "Password123",
  "role": "PROJECT_LEADER"
}
```

Guarda el campo `token` de la respuesta.

### 2. Login user

`POST {{baseUrl}}/api/auth/login`

```json
{
  "username": "lider1",
  "password": "Password123"
}
```

En los siguientes requests agrega:

```text
Authorization: Bearer {{token}}
```

### 3. Crear Project

`POST {{baseUrl}}/api/projects`

```json
{
  "name": "Implementacion CRM",
  "description": "Proyecto para administrar clientes y tareas internas.",
  "leaderName": "Lider de Proyecto",
  "clientName": "Cliente Demo SAC",
  "startDate": "2026-05-27",
  "endDate": "2026-07-30",
  "status": "PLANNED",
  "priority": "HIGH",
  "budget": 15000.0
}
```

Guarda el `id` como `projectId`.

### 4. Listar Projects

`GET {{baseUrl}}/api/projects`

### 5. Buscar Project por ID

`GET {{baseUrl}}/api/projects/{{projectId}}`

### 6. Actualizar Project

`PUT {{baseUrl}}/api/projects/{{projectId}}`

```json
{
  "name": "Implementacion CRM - fase 1",
  "description": "Proyecto actualizado para seguimiento administrativo.",
  "leaderName": "Lider de Proyecto",
  "clientName": "Cliente Demo SAC",
  "startDate": "2026-05-27",
  "endDate": "2026-08-15",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "budget": 18000.0
}
```

### 7. Crear Task dentro de Project

`POST {{baseUrl}}/api/projects/{{projectId}}/tasks`

```json
{
  "title": "Definir alcance funcional",
  "description": "Reunir requisitos y validar entregables.",
  "assignedTo": "Miembro del equipo",
  "status": "PENDING",
  "priority": "HIGH",
  "startDate": "2026-05-28",
  "dueDate": "2026-06-05"
}
```

Guarda el `id` como `taskId`.

### 8. Listar Tasks por Project

`GET {{baseUrl}}/api/projects/{{projectId}}/tasks`

### 9. Actualizar Task

`PUT {{baseUrl}}/api/projects/tasks/{{taskId}}`

```json
{
  "title": "Definir alcance funcional actualizado",
  "description": "Reunir requisitos, validar entregables y registrar acuerdos.",
  "assignedTo": "Miembro del equipo",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "startDate": "2026-05-28",
  "dueDate": "2026-06-08"
}
```

Para actualizar solo el estado:

```text
PUT {{baseUrl}}/api/projects/tasks/{{taskId}}?status=COMPLETED
```

### 10. Eliminar Task

`DELETE {{baseUrl}}/api/projects/tasks/{{taskId}}`

### 11. Eliminar Project

`DELETE {{baseUrl}}/api/projects/{{projectId}}`
