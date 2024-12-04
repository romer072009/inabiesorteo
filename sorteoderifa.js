// Variables globales
let participants = [];
let remainingParticipants = [];
let departments = new Set(); // Para departamentos únicos
let winnerCount = 0;

// Elementos del DOM
const fileInput = document.getElementById("fileInput");
const departmentFilter = document.getElementById("departmentFilter");
const winnerCountInput = document.getElementById("winnerCount");
const startRaffleButton = document.getElementById("startRaffle");
const winnersList = document.getElementById("winnersList");
const participantsList = document.getElementById("participantsList");

// Función para leer el archivo y procesar los participantes
fileInput.addEventListener("change", handleFileUpload);

// Función para manejar el archivo subido (.txt, .csv o .pdf)
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    // Procesar archivo dependiendo de su tipo
    reader.onload = (e) => {
        const content = e.target.result;
        if (file.type === "application/pdf") {
            alert("El soporte para PDF aún no está implementado.");
            return;
        } else if (file.type === "text/plain" || file.type === "text/csv") {
            parseTextOrCsv(content);
        }
    };

    // Leer el archivo
    if (file.type === "text/plain" || file.type === "text/csv") {
        reader.readAsText(file);
    } else if (file.type === "application/pdf") {
        alert("Este formato aún no está soportado.");
    }
}

// Función para parsear archivo de texto o CSV
function parseTextOrCsv(content) {
    const lines = content.split("\n").map(line => line.trim()).filter(line => line !== "");

    participants = lines.map(line => {
        const [name, department] = line.split(",");
        const departmentName = department ? department.trim() : '';
        departments.add(departmentName);
        return { name: name.trim(), department: departmentName };
    });

    populateDepartmentFilter();
    startRaffleButton.disabled = false;
    winnerCountInput.disabled = false;
    updateParticipantsList();
}

// Llenar el filtro de departamentos
function populateDepartmentFilter() {
    departmentFilter.innerHTML = `<option value="">Selecciona un departamento</option>`;
    departments.forEach(department => {
        const option = document.createElement("option");
        option.value = department;
        option.textContent = department;
        departmentFilter.appendChild(option);
    });
    departmentFilter.disabled = false;
}

// Filtrar participantes según el departamento
function filterParticipants() {
    const selectedDepartment = departmentFilter.value;
    if (selectedDepartment === "") {
        remainingParticipants = [...participants];
    } else {
        remainingParticipants = participants.filter(participant => participant.department === selectedDepartment);
    }
    updateParticipantsList();
}

// Actualizar la lista de participantes en la interfaz
function updateParticipantsList() {
    participantsList.innerHTML = "";
    remainingParticipants.forEach((participant) => {
        const li = document.createElement("li");
        li.textContent = `${participant.name} (${participant.department})`;
        participantsList.appendChild(li);
    });
}

// Función para seleccionar ganadores
function pickWinners() {
    const count = parseInt(winnerCountInput.value);
    if (remainingParticipants.length < count) {
        alert("No hay suficientes participantes.");
        return;
    }

    const winners = [];
    const selectedIndices = new Set();

    while (winners.length < count) {
        const randomIndex = Math.floor(Math.random() * remainingParticipants.length);
        if (!selectedIndices.has(randomIndex)) {
            winners.push(remainingParticipants[randomIndex]);
            selectedIndices.add(randomIndex);
        }
    }

    // Mostrar ganadores
    winnersList.innerHTML = winners.map(winner => `<li>${winner.name} (${winner.department})</li>`).join('');
    remainingParticipants = remainingParticipants.filter(participant => !winners.includes(participant)); // Eliminar ganadores
    updateParticipantsList();
}

// Escuchar el evento de selección del filtro de departamentos
departmentFilter.addEventListener("change", filterParticipants);

// Escuchar el evento del botón de iniciar sorteo
startRaffleButton.addEventListener("click", pickWinners);
