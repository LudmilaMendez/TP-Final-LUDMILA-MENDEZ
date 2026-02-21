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
    


