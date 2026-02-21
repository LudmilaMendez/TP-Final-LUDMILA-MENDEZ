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

        if (data.token) {
            // Decodificamos el token (Payload)
            const payload = JSON.parse(atob(data.token.split('.')[1]));

            // BLOQUEO DE SEGURIDAD: Solo VET o ADMIN pueden pasar
            if (payload.role !== 'vet' && payload.role !== 'admin') {
                alert("⛔ Acceso denegado: Este portal es exclusivo para el Staff de la veterinaria.");
                return; // Cortamos la ejecución aquí
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
        <td>${pet.ownerId}</td>
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
    const body = {
        name: document.getElementById('newName').value,
        species: document.getElementById('newSpecies').value,
        age: parseInt(document.getElementById('newAge').value),
        ownerId: document.getElementById('newOwnerId').value
    };

    if(!body.name || !body.ownerId) return alert("Nombre y Dueño son obligatorios");

    const res = await fetch('/api/mascotas', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(body)
    });

    if (res.ok) {
        alert("¡Nueva mascota registrada!");
        document.getElementById('newName').value = "";
        document.getElementById('newSpecies').value = "";
        document.getElementById('newAge').value = "";
        document.getElementById('newOwnerId').value = "";
        loadPets();
    } else {
        alert("Error al crear. Verificá el ID del dueño.");
    }
}

// --- UPDATE (Editar Mascota) ---
async function editPet(id, currentName, currentAge) {
    const newName = prompt("Nuevo nombre:", currentName);
    const newAge = prompt("Nueva edad:", currentAge);

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
                        <small>${new Date(h.date).toLocaleDateString()}</small> | 
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

function logout() { location.reload(); }
