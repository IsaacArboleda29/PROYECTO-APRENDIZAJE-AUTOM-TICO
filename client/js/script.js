// Datos de equipos y configuración
const CONFIG = {
  equipos: [
    "CS Emelec", "Mushuc Runa", "LDU de Quito", "Delfin", "Orense",
    "Guayaquil City", "Cumbayá", "CD Tecnico Universitario", "Deportivo Cuenca", "Aucas",
    "Univ Católica", "Barcelona", "Independiente del Valle", "Gualaceo Sporting Club",
    "Club 9 de Octubre", "Macará", "Libertad", "El Nacional", "Imbabura",
    "Manta Fútbol Club", "Vinotinto"
  ],
  escudos: {
    "CS Emelec": "EscudoCSEmelec.png",
    "Mushuc Runa": "MushucRuna.png",
    "LDU de Quito": "Liga_Deportiva_Universitaria_de_Quito.png",
    "Delfin": "Delfín_SC_logo.png",
    "Orense": "Orense_SC_logo.png",
    "Guayaquil City": "Guayaquil_City.png",
    "Cumbayá": "Cumbayá_FC.png",
    "CD Tecnico Universitario": "Técnico_Universitario.png",
    "Deportivo Cuenca": "Depcuenca.png",
    "Aucas": "SD_Aucas_logo.png",
    "Univ Católica": "Ucatólica.png",
    "Barcelona": "Barcelona_Sporting_Club_Logo.png",
    "Independiente del Valle": "Independiente_del_Valle_Logo_2022.png",
    "Gualaceo Sporting Club": "Escudo_Gualaceo_Sporting_Club.png",
    "Club 9 de Octubre": "9_de_Octubre_FC_escudo.png",
    "Macará": "Macara_6.png",
    "Libertad": "Libertad_FC_Ecuador.png",
    "El Nacional": "Nacional.png",
    "Imbabura": "Imbabura.png",
    "Manta Fútbol Club": "Manta_F.C.png",
    "Vinotinto": "Vinotinto.png"
  },
  ids: {
    "Barcelona": 0,
    "CD Olmedo": 1,
    "El Nacional": 2,
    "LDU Portoviejo": 3,
    "Emelec": 4,
    "LDU de Quito": 5,
    "Mushuc Runa": 6,
    "Independiente del Valle": 7,
    "CD Tecnico Universitario": 8,
    "Delfin": 9,
    "Deportivo Cuenca": 10,
    "Guayaquil City": 11,
    "Aucas": 12,
    "Univ Católica": 13,
    "Macará": 14,
    "Orense": 15,
    "Club 9 de Octubre": 16,
    "Manta Fútbol Club": 17,
    "Gualaceo Sporting Club": 18,
    "Cumbayá": 19,
    "Libertad": 20,
    "Imbabura": 21,
    "Vinotinto": 22
  },
  apiEndpoint: "http://localhost:4000/predict",
  sliderSpeed: 2
};

// Cache de elementos del DOM
const DOM = {
  team1Select: document.getElementById('team1'),
  team2Select: document.getElementById('team2'),
  escudo1Img: document.getElementById('escudo1'),
  escudo2Img: document.getElementById('escudo2'),
  nombre1: document.getElementById('nombre1'),
  nombre2: document.getElementById('nombre2'),
  escudo1Container: document.getElementById('container1'),
  escudo2Container: document.getElementById('container2'),
  modal: document.getElementById('predictionModal'),
  modalResult: document.getElementById('modalResult'),
  modalGoles: document.getElementById('modalGoles'),
  modalTiros: document.getElementById('modalTiros'),
  modalTarjetas: document.getElementById('modalTarjetas'),
  closeBtn: document.querySelector('.close'),
  predictBtn: document.getElementById('predictBtn'),
  logosContainer: document.getElementById("logos"),
  slide: document.getElementById("slide")
};

// Inicialización de la aplicación
function init() {
  populateTeamSelects();
  setupEventListeners();
  initInfiniteSlider();
}

// Llenar los selectores de equipos
function populateTeamSelects() {
  CONFIG.equipos.forEach(equipo => {
    const option = document.createElement('option');
    option.value = equipo;
    option.textContent = equipo;
    
    DOM.team1Select.appendChild(option.cloneNode(true));
    DOM.team2Select.appendChild(option);
  });
}

// Configurar event listeners
function setupEventListeners() {
  DOM.team1Select.addEventListener('change', () => handleTeamChange('left'));
  DOM.team2Select.addEventListener('change', () => handleTeamChange('right'));
  DOM.predictBtn.addEventListener('click', handlePrediction);
  DOM.closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', handleOutsideClick);
  DOM.modal.querySelector('div').addEventListener('mousemove', handleModalMouseMove);
}

// Manejar cambio de equipo
function handleTeamChange(side) {
  const select = side === 'left' ? DOM.team1Select : DOM.team2Select;
  const img = side === 'left' ? DOM.escudo1Img : DOM.escudo2Img;
  const nombre = side === 'left' ? DOM.nombre1 : DOM.nombre2;
  const container = side === 'left' ? DOM.escudo1Container : DOM.escudo2Container;
  
  mostrarEscudoYNombre(select.value, img, nombre, container, side);
}

// Mostrar escudo y nombre con animación
function mostrarEscudoYNombre(equipo, imgElement, nombreElement, containerElement, side) {
  if (equipo && CONFIG.escudos[equipo]) {
    imgElement.src = `../img/${CONFIG.escudos[equipo]}`;
    imgElement.style.display = 'block';
    nombreElement.textContent = equipo;
    nombreElement.style.display = 'block';

    containerElement.classList.remove('show-left', 'show-right');
    void containerElement.offsetWidth; // Reiniciar animación

    containerElement.classList.add(side === 'left' ? 'show-left' : 'show-right');
  } else {
    resetTeamDisplay(imgElement, nombreElement, containerElement);
  }
}

// Resetear display del equipo
function resetTeamDisplay(imgElement, nombreElement, containerElement) {
  imgElement.src = '';
  imgElement.style.display = 'none';
  nombreElement.textContent = '';
  nombreElement.style.display = 'none';
  containerElement.classList.remove('show-left', 'show-right');
}

// Manejar la predicción
async function handlePrediction(e) {
  e.preventDefault();
  
  const team1 = DOM.team1Select.value;
  const team2 = DOM.team2Select.value;

  if (!validateTeams(team1, team2)) return;

  try {
    const prediction = await fetchPrediction(team1, team2);
    displayPredictionResults(team1, team2, prediction);
    DOM.modal.style.display = 'flex';
  } catch (error) {
    console.error("Error en la predicción:", error);
    alert("Hubo un problema al obtener la predicción. Por favor intenta nuevamente.");
  }
}

// Validar selección de equipos
function validateTeams(team1, team2) {
  if (!team1 || !team2) {
    alert("Por favor selecciona ambos equipos.");
    return false;
  }

  if (team1 === team2) {
    alert("Por favor selecciona equipos diferentes.");
    return false;
  }

  return true;
}

// Obtener predicción del backend
async function fetchPrediction(team1, team2) {
  const id1 = CONFIG.ids[team1];
  const id2 = CONFIG.ids[team2];

  const response = await fetch(`${CONFIG.apiEndpoint}/${id1}/${id2}`);
  
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  return await response.json();
}

// Mostrar resultados en el modal
function displayPredictionResults(team1, team2, data) {
  // Asegurarse de que data.prediction y data.prediction.prediction existen y son arrays
  const predObj = data.prediction;
  if (
    !predObj ||
    !Array.isArray(predObj.prediction) ||
    !Array.isArray(predObj.prediction[0])
  ) {
    DOM.modalResult.textContent = "No se recibió una predicción válida.";
    return;
  }

  const prob = (predObj.prediction[0][0] * 100).toFixed(2);
  DOM.modalResult.textContent = `${team1} tiene ${prob}% de probabilidad contra ${team2}.`;

  if (data.historico) {
    DOM.modalGoles.textContent = `Último resultado: ${data.historico.resultado || 'N/A'}`;
    DOM.modalTiros.textContent = `Últimos corners: ${data.historico.corners || 'N/A'}`;
  } else {
    DOM.modalGoles.textContent = "Último resultado: datos no disponibles";
    DOM.modalTiros.textContent = "Últimos corners: datos no disponibles";
  }

  DOM.modalTarjetas.textContent = "Tarjetas: datos no disponibles";
}


// Cerrar modal
function closeModal() {
  DOM.modal.style.display = 'none';
}

// Cerrar modal al hacer clic fuera
function handleOutsideClick(event) {
  if (event.target === DOM.modal) {
    closeModal();
  }
}

// Efecto de movimiento en el modal
function handleModalMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  e.currentTarget.style.setProperty('--x', x + 'px');
  e.currentTarget.style.setProperty('--y', y + 'px');
}

// Slider infinito
function initInfiniteSlider() {
  const clone = DOM.slide.cloneNode(true);
  DOM.logosContainer.appendChild(clone);

  DOM.logosContainer.style.display = "flex";
  DOM.logosContainer.style.whiteSpace = "nowrap";
  DOM.logosContainer.style.overflow = "hidden";
  DOM.logosContainer.style.willChange = "transform";

  let position = 0;

  function animateSlider() {
    position -= CONFIG.sliderSpeed;
    
    if (Math.abs(position) >= DOM.slide.offsetWidth) {
      position = 0;
    }
    
    DOM.logosContainer.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(animateSlider);
  }

  animateSlider();
}

// Iniciar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
