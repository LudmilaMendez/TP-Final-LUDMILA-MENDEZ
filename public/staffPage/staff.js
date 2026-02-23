let token = "";
let currentUser = null;

// --- LOGIN ---
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok && data.token) {
            // Decodificamos el token para saber quién es
            const payload = JSON.parse(atob(data.token.split('.')[1]));

            // 🛡️ FILTRO DE SEGURIDAD REFORZADO:
            if (payload.role !== 'vet' && payload.role !== 'admin') {
                const irAClientes = confirm(
                    "⛔ Acceso denegado: Este portal es exclusivo para el Staff.\n\n" +
                    "¿Querés ir al Portal de Clientes?"
                );
                
                if (irAClientes) {
                    window.location.href = "/index.html"; 
                }
                return; 
            }

            // Si es Staff, guardamos sesión y mostramos panel
            token = data.token;
            currentUser = payload;
            
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('mainSection').style.display = 'block';
            document.getElementById('userName').innerText = payload.username;
            document.getElementById('userRole').innerText = payload.role.toUpperCase();
            
            loadPets();
        } else {
            alert("Error: " + (data.error || "Credenciales inválidas"));
        }
    } catch (e) { 
        console.error(e);
        alert("Error de conexión con el servidor"); 
    }
}
// --- READ (Cargar Mascotas) ---
async function loadPets() {
    try {
        const res = await fetch('/api/mascotas', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const pets = await res.json();
        const tbody = document.querySelector('#petsTable tbody');
        
        // Verificamos si el usuario logueado es ADMIN, asi puede tener la funcion de borrar
        const isAdmin = currentUser.role === 'admin';

        tbody.innerHTML = pets.map(pet => `
    <tr>
        <td>${pet.name}</td>
        <td>${pet.species}</td>
        <td>${pet.age} ${pet.age === 1 ? 'año' : 'años'}</td>
        <td>${pet.ownerName}</td> 

        <td>
            <button onclick="openConsultation('${pet.id}', '${pet.name}')" style="background:#28a745">Atender</button>
            <button onclick="editPet('${pet.id}', '${pet.name}', ${pet.age})" style="background:#ffc107; color:black">Editar</button>
            ${isAdmin ? `<button onclick="deletePet('${pet.id}')" style="background:#dc3545">Borrar</button>` : ''}
        </td>
    </tr>
`).join('');

    } catch (e) { console.error("Error al cargar mascotas", e); }
}


// --- CREATE (Nueva Mascota) ---
async function createNewPet() {
    const email = document.getElementById('newOwnerEmail').value;
    const name = document.getElementById('newName').value;
    const species = document.getElementById('newSpecies').value;
    const breed = document.getElementById('newBreed').value || "Mestizo"; // Simplificado
    const age = parseInt(document.getElementById('newAge').value);

    if (!name || !email) return alert("Nombre y Email del dueño son obligatorios");

    try {
        // 1. Buscamos al dueño
        const userRes = await fetch(`/api/users/search/${email}/none`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!userRes.ok) return alert("❌ No se encontró un usuario con ese email.");

        const userData = await userRes.json();
        
        // 2. Definimos el ID (Aseguramos capturarlo del DTO o del objeto directo)
        const ownerId = userData.id || userData._id; 

        if (!ownerId) return alert("❌ Error: El servidor no envió el ID del dueño.");

        // 3. Enviamos la creación
        const res = await fetch('/api/mascotas', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ name, species, age, ownerId, breed })
        });

        if (res.ok) {
            alert("¡Nueva mascota registrada exitosamente!");
            document.getElementById('newName').value = "";
            document.getElementById('newOwnerEmail').value = "";
            loadPets();
        } else {
            alert("Error al registrar en la base de datos.");
        }
    } catch (e) {
        console.error(e);
        alert("Error de conexión.");
    }
}

// --- UPDATE (Editar Mascota) ---
async function editPet(id, currentName, currentAge) {
    const newName = prompt("Nuevo nombre:", currentName); //Si hubo un error al cargar el nombre
    const newAge = prompt("Nueva edad:", currentAge); //Para actualizarla

    if (newName !== null && newAge !== null) {
        const res = await fetch(`/api/mascotas/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ name: newName, age: parseInt(newAge) })
        });

        if (res.ok) {
            alert("Datos actualizados");
            loadPets();
        } else {
            alert("Error al actualizar datos");
        }
    }
}

// --- DELETE (Borrar Mascota) ---
//Funcion que solo puede realizar Admin, por eso no se muestra el boton de borrar a los veterinarios
async function deletePet(id) {
    if (!confirm("¿Seguro que querés borrar este paciente? No hay vuelta atrás.")) return;

    const res = await fetch(`/api/mascotas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
        alert("Mascota eliminada del sistema");
        loadPets();
    } else {
        const err = await res.json();
        alert("Error: " + (err.message || "No tenés permiso para borrar"));
    }
}

// --- HISTORIAL (Atender) ---
async function openConsultation(id, name) {
    document.getElementById('historyForm').style.display = 'block';
    document.getElementById('selectedPetId').value = id;
    document.getElementById('formTitle').innerText = "Atendiendo a: " + name;
    
    const historyDiv = document.getElementById('previousHistory');
    historyDiv.innerHTML = "<em>Buscando antecedentes...</em>";

    try {
        const res = await fetch(`/api/historial/mascota/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const history = await res.json();
        
        if (history.length > 0) {
            historyDiv.innerHTML = "<strong>Consultas anteriores:</strong><br>" + 
                history.map(h => `
                    <div style="margin-top:10px; border-bottom:1px solid #ccc; padding-bottom:5px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; margin-bottom: 5px;">
                        <small>${new Date(h.date).toLocaleDateString()}</small> 
                        <small>🩺Atendido por: <b>Vet:</b> ${h.vetId}</small> <!-- PARA VER QUE COMPANERO ATENDIO LA CONSULTA -->| 
                        <button onclick="editMedicalRecord('${h.id}', '${h.description}', '${h.diagnosis}', '${h.treatment}')" 
                            style="width:auto; padding: 2px 8px; background: #ffc107; color: black; font-size: 0.7em;">
                        Editar Registro
                    </button>
                    </div>
                        <b>📝 Motivo:</b> ${h.description}<br>
                        <b>Diag:</b> ${h.diagnosis} | <b>Trat:</b> ${h.treatment}
                    </div>
                `).join('');
        } else {
            historyDiv.innerHTML = "<em>No hay registros previos para esta mascota.</em>";
        }
    } catch (e) { historyDiv.innerHTML = "<em>Error al cargar antecedentes.</em>"; }
}

async function saveRecord() {
    const body = {
        petId: document.getElementById('selectedPetId').value,
        description: document.getElementById('description').value,
        diagnosis: document.getElementById('diagnosis').value,
        treatment: document.getElementById('treatment').value
    };

    const res = await fetch('/api/historial', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(body)
    });

    if (res.ok) {
        alert("✅ Registro médico guardado con éxito");
        document.getElementById('historyForm').style.display = 'none';
        document.getElementById('description').value = "";
        document.getElementById('diagnosis').value = "";
        document.getElementById('treatment').value = "";
    } else {
        alert("❌ Error: Verificá tus permisos de Staff");
    }
}

async function editMedicalRecord(recordId, oldDesc, oldDiag, oldTrat) {
    const newDesc = prompt("Corregir Motivo/Descripción:", oldDesc);
    const newDiag = prompt("Corregir Diagnóstico:", oldDiag);
    const newTrat = prompt("Corregir Tratamiento:", oldTrat);

    if (newDesc && newDiag && newTrat) {
        const res = await fetch(`/api/historial/${recordId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ 
                description: newDesc, 
                diagnosis: newDiag, 
                treatment: newTrat 
            })
        });

        if (res.ok) {
            alert("✅ Registro médico corregido correctamente");
            // Se refresca la consulta para mostrar los cambios, manteniendo el mismo paciente abierto
            const petId = document.getElementById('selectedPetId').value;
            const petName = document.getElementById('formTitle').innerText.replace("Atendiendo a: ", "");
            openConsultation(petId, petName);
        } else {
            alert("❌ Error al editar el registro");
        }
    }
}

function logout() { location.reload(); }
