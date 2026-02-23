# 🐾 Veterinaria Patitas Felices - API Backend

## 📝 Descripción General
Este proyecto es un sistema de gestión integral para la **Veterinaria "Patitas Felices"**. La solución permite administrar de manera segura y organizada la información de **Dueños, Mascotas, Veterinarios e Historiales Clínicos**. 

El sistema utiliza una arquitectura **MVC (Modelo-Vista-Controlador)** y aplica reglas de negocio estrictas: los dueños solo pueden ver sus propias mascotas, mientras que los veterinarios y administradores tienen acceso a la gestión clínica profesional(diferencia entre vet y admin: vet puede editar pero no eliminar).

## 🚀 Tecnologías Utilizadas
- **Lenguaje:** TypeScript
- **Entorno de ejecución:** Node.js & Express
- **Base de Datos:** MongoDB con Mongoose
- **Seguridad:** 
  - **JWT (JSON Web Tokens):** Para manejo de sesiones y rutas privadas.
  - **BcryptJS:** Para el hasheo y resguardo de contraseñas.
  - **Middlewares:** Filtros de Autenticación y Autorización por roles (`admin`, `vet`, `user`).
- **Validación:** `express-validator` para asegurar la integridad de los datos de entrada.

## ⚙️ Variables de Entorno Requeridas
El archivo .env debe contener:
PORT: Puerto de escucha del servidor (ej: 5000).
MONGODB_URI: Cadena de conexión a MongoDB Atlas o local.
JWT_SECRET: Clave secreta para la firma de tokens.
JWT_EXPIRES_IN: Tiempo de expiración del token (ej: 7d).

## 🛠️ Instrucciones de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/LudmilaMendez/TP-Final-LUDMILA-MENDEZ.git
   cd patitas-felices
   ```
2.**Instalar Dependencias**
   ```bash 
  npm i (Lee el package.json e instala las dependencies y devDependencies)
```
3.**Configurar el entorno**
```bash
Crea un archivo .env en la raíz del proyecto basándote en el archivo .env.example.
```
3.**🚀 Pasos para ejecutar el proyecto**
```bash
-Desarrollo: npm run dev
-Producccion: npm run build y luego npm start
```

## 📖 Guía de Uso del Sistema

Para garantizar la integridad de los datos y respetar las relaciones entre entidades, el flujo de trabajo recomendado es:

### 1. Registro de Dueños (Usuarios)
Antes de cargar una mascota, el **Dueño** debe estar registrado en el sistema. 
- Esto se puede hacer desde la página principal (`index.html`) en la sección **"¿Sos nuevo? Registrate"**.
- El **Email** registrado será la "llave" para vincularlo con sus futuras mascotas.

### 2. Carga de Mascotas
Una vez que el dueño existe en la base de datos:
- **Desde el Portal Clientes:** El dueño puede registrar su propia mascota (se vincula automáticamente a su cuenta).
- **Desde el Portal Staff:** El Veterinario o Admin puede registrar una mascota ingresando el **Email del Dueño**. El sistema validará que el email exista y obtendrá el ID correspondiente de forma interna.

### 3. Atención Veterinaria e Historial
- El personal de Staff busca al paciente en la tabla **"Pacientes en el Sistema"**.
- Al presionar **"Atender"**, se despliega el historial previo (motivo, diagnóstico y tratamiento) indicando qué profesional realizó cada consulta.
- El **Admin** cuenta con permisos especiales para **Editar** registros médicos previos en caso de errores de carga y **Borrar** mascotas del sistema.

### 🔐 Reglas de Negocio Implementadas
- **Privacidad:** Los dueños solo ven a sus propias mascotas.
- **Jerarquía:** Solo el rol `admin` puede eliminar registros; los `vet` solo pueden crear y editar.
- **Validación:** No se pueden crear mascotas para emails que no estén registrados previamente como usuarios.

### 🔐 Endpoints Principales (Ejemplos)
POST /api/auth/register: Registro de usuarios.
POST /api/auth/login: Login (retorna token y rol).
GET /api/mascotas/mis-mascotas: Mascotas del usuario autenticado.
GET /api/mascotas: Lista completa (Solo Staff).
PUT /api/historial/:id: Edición de registro médico (Solo Staff).
DELETE /api/mascotas/:id: Eliminación de mascota (Solo Admin).

### 🧪 Pruebas con Insomnia
Para probar los endpoints protegidos, seguí este flujo:
1. **Login:** Realizá un `POST` a `/api/auth/login` con las credenciales.
2. **Token:** Copiá el `token` recibido en la respuesta.
3. **Auth:** En la pestaña **Auth** de tu cliente REST, seleccioná **Bearer Token** y pegá el código.
4. **Roles:** Recordá que si intentás usar `DELETE` con un usuario de rol `vet`, recibirás un `403 Forbidden`.
Para verificar el funcionamiento de la API, seguí este orden lógico de peticiones:
1. **Registro de Usuarios** (`POST /api/auth/register`)
Cuerpo (JSON):
```
{
  "username": "usuario_prueba",
  "email": "test@ejemplo.com", 
  "password": "Password123!",
  "phone": "1122334455",
  "role": "user"
}
```
2. **Login** (`POST /api/auth/login`)
Cuerpo (JSON):
```
{
  "email": "luly@test.com",
  "password": "Password123!"
}
```
Copiá el token de la respuesta y pegalo en la pestaña Auth > Bearer Token de las siguientes peticiones.

3. Registro de Mascota (`POST /api/mascotas`)
(Como Staff, requiere email de dueño previo)
Cuerpo (JSON):
```
{
  "name": "Pity",
  "species": "Perro",
  "age": 3,
  "ownerId": "ID_OBTENIDO_POR_EMAIL",
  "breed": "Mestizo"
}
```
4. Crear Historial Clínico (`POST /api/historial`)
(Solo rol vet o admin)
Cuerpo (JSON):
```
{
  "petId": "ID_DE_LA_MASCOTA",
  "description": "Control de rutina",
  "diagnosis": "Sana",
  "treatment": "Ninguno"
}
```
5. Borrado de Mascota (`DELETE /api/mascotas/:id`)
Si usás el token de un user o vet -> 403 Forbidden.
Si usás el token de un admin -> 200 OK.
Debajo de la URL, buscá la pestaña Auth.
Elegí Bearer Token.
En el campo Token, pegá el token que obtuviste al hacer Login con el Admin (ej: admin@patitas.com).

### 🔑 Cuentas de Prueba Sugeridas
Para probar los distintos niveles de acceso, podés registrar o usar estas cuentas:

- **Administrador:** `admin@patitas.com` / `AdminPassword123!` 
  *(Acceso total: Borrado de mascotas y edición de historiales).*
- **Veterinario:** `vet_garcia@patitas.com` / `Garcia2024!` 
  *(Acceso staff: Atender mascotas y editar nombre, edad e historiales, pudiendo ver que compañero agregó consultas).*
- **Dueño:** `luly@test.com` / `Password123!` 
  *(Acceso cliente: Ver solo mascotas propias y sus historiales).*



### 🌐 Opción de Frontend Utilizada
Se utiliza una Arquitectura de Archivos Estáticos. El servidor Express sirve los archivos HTML, CSS y JS directamente desde la carpeta /public mediante el middleware express.static. La lógica de interacción se maneja con Vanilla JavaScript y la Fetch API para comunicarse con los endpoints RESTful del backend.

