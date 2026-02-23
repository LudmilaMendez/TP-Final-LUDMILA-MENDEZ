## 📚 Descripción general del proyecto.

La veterinaria “Patitas Felices” necesita un sistema de gestión que permita administrar su información de manera segura y organizada.
El sistema contempla las siguientes entidades: 
- Dueños
- Mascotas
- Veterinarios
- Historial clínico
Flujo del sistema:
 - Usuario entra a /index.html (Portal Clientes) -> Register/Login (Auth) -> Carga de mascota(s) y vinculacion (User-Pet relacion) -> Ve su(s) mascota(s) -> Ve sus historiales.
 - Veterinario entra a /staffPage/staff.html -> Ve TODOS los pacientes -> Crea historiales (Pet-HistorialClinico relacion) -> Edita mascotas.

# Tecnologías utilizadas.

# Instrucciones de instalación.

# Pasos para ejecutar el proyecto.

# Variables de entorno requeridas.

# Ejemplos de endpoints principales.
GET /api/mascotas/mis-mascotas: Usuario ve a su(s) mascota(s).
GET /api/historial/mascota/:petId: Usuario ve las consultas médicas de una de sus mascotas.
POST /api/historial: El veterinario carga una consulta nueva

# Aclaración de la opción de frontend utilizada:
  Opción 1 – HTML, CSS y JavaScript:
- Frontend básico
- Ubicado dentro de la carpeta /public del backend
- Consumo de la API mediante fetch o similar
    
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

## 🛠️ Instrucciones de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DE_TU_REPOSITORIO>
   cd patitas-felices


