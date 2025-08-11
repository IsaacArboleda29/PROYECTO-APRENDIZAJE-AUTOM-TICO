const equipos = [
  "CS Emelec", "Mushuc Runa", "LDU de Quito", "Delfín", "Orense",
  "Guayaquil City", "Cumbayá", "Técnico Univ.", "Deportivo Cuenca", "SD Aucas",
  "Univ Católica", "Barcelona", "Independiente", "Gualaceo Sporting Club",
  "Club 9 de Octubre", "Macará", "Libertad", "El Nacional", "Imbabura",
  "Manta Fútbol Club", "Vinotinto"
];

const mapaEscudos = {
  "CS Emelec": "EscudoCSEmelec.png",
  "Mushuc Runa": "MushucRuna.png",
  "LDU de Quito": "Liga_Deportiva_Universitaria_de_Quito.png",
  "Delfín": "Delfín_SC_logo.png",
  "Orense": "Orense_SC_logo.png",
  "Guayaquil City": "Guayaquil_City.png",
  "Cumbayá": "Cumbayá_FC.png",
  "Técnico Univ.": "Técnico_Universitario.png",
  "Deportivo Cuenca": "Depcuenca.png",
  "SD Aucas": "SD_Aucas_logo.png",
  "Univ Católica": "Ucatólica.png",
  "Barcelona": "Barcelona_Sporting_Club_Logo.png",
  "Independiente": "Independiente_del_Valle_Logo_2022.png",
  "Gualaceo Sporting Club": "Escudo_Gualaceo_Sporting_Club.png",
  "Club 9 de Octubre": "9_de_Octubre_FC_escudo.png",
  "Macará": "Macara_6.png",
  "Libertad": "Libertad_FC_Ecuador.png",
  "El Nacional": "Nacional.png",
  "Imbabura": "Imbabura.png",
  "Manta Fútbol Club": "Manta_F.C.png",
  "Vinotinto": "Vinotinto.png"
};

const team1Select = document.getElementById('team1');
const team2Select = document.getElementById('team2');

const escudo1Container = document.getElementById('container1');
const escudo2Container = document.getElementById('container2');

const escudo1Img = document.getElementById('escudo1');
const escudo2Img = document.getElementById('escudo2');

const nombre1 = document.getElementById('nombre1');
const nombre2 = document.getElementById('nombre2');

const modal = document.getElementById('predictionModal');
const modalResult = document.getElementById('modalResult');
const modalGoles = document.getElementById('modalGoles');
const modalTiros = document.getElementById('modalTiros');
const modalTarjetas = document.getElementById('modalTarjetas');
const closeBtn = document.querySelector('.close');

equipos.forEach(equipo => {
  const option1 = document.createElement('option');
  option1.value = equipo;
  option1.textContent = equipo;
  team1Select.appendChild(option1);

  const option2 = document.createElement('option');
  option2.value = equipo;
  option2.textContent = equipo;
  team2Select.appendChild(option2);
});

function mostrarEscudoYNombre(equipo, imgElement, nombreElement, containerElement, lado) {
  if (equipo && mapaEscudos[equipo]) {
    imgElement.src = `../img/${mapaEscudos[equipo]}`;
    imgElement.style.display = 'block';
    nombreElement.textContent = equipo;
    nombreElement.style.display = 'block';

    containerElement.classList.remove('show-left', 'show-right');
    void containerElement.offsetWidth; // restart animation

    if (lado === 'left') {
      containerElement.classList.add('show-left');
    } else {
      containerElement.classList.add('show-right');
    }
  } else {
    imgElement.src = '';
    imgElement.style.display = 'none';
    nombreElement.textContent = '';
    nombreElement.style.display = 'none';
    containerElement.classList.remove('show-left', 'show-right');
  }
}

team1Select.addEventListener('change', () => {
  mostrarEscudoYNombre(team1Select.value, escudo1Img, nombre1, escudo1Container, 'left');
});

team2Select.addEventListener('change', () => {
  mostrarEscudoYNombre(team2Select.value, escudo2Img, nombre2, escudo2Container, 'right');
});

document.getElementById('predictBtn').addEventListener('click', function (e) {
  e.preventDefault();

  const team1 = team1Select.value;
  const team2 = team2Select.value;

  if (team1 === "" || team2 === "") {
    alert("Selecciona ambos equipos.");  // Evitar abrir modal si no está todo
    return;
  }

  if (team1 === team2) {
    alert("Por favor, selecciona equipos diferentes.");
    return;
  }

  // Simula datos de predicción
  const randomPercentage = (Math.random() * 100).toFixed(2);
  const goles1 = Math.floor(Math.random() * 5);
  const goles2 = Math.floor(Math.random() * 5);
  const tirosEsquina1 = Math.floor(Math.random() * 10);
  const tirosEsquina2 = Math.floor(Math.random() * 10);
  const tarjetas1 = Math.floor(Math.random() * 4);
  const tarjetas2 = Math.floor(Math.random() * 4);

  // Actualiza texto del modal
  modalResult.textContent = `${team1} tiene ${randomPercentage}% de probabilidad de ganar contra ${team2}.`;
  modalGoles.textContent = `Goles: ${team1} ${goles1} - ${goles2} ${team2}`;
  modalTiros.textContent = `Tiros de esquina: ${team1} ${tirosEsquina1} - ${tirosEsquina2} ${team2}`;
  modalTarjetas.textContent = `Tarjetas amarillas: ${team1} ${tarjetas1} - ${tarjetas2} ${team2}`;

  // Mostrar modal
  modal.style.display = 'flex';
});

// Cerrar modal con botón X
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Cerrar modal haciendo clic fuera del contenido
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

const modalContent = document.querySelector('#predictionModal > div');

modalContent.addEventListener('mousemove', (e) => {
  // Obtener posición relativa del mouse dentro del div
  const rect = modalContent.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Actualizar variables CSS --x y --y
  modalContent.style.setProperty('--x', x + 'px');
  modalContent.style.setProperty('--y', y + 'px');
});

// SLIDER INFINITO FLUIDO
const logosContainer = document.getElementById("logos");
const slide = document.getElementById("slide");

// Clonamos el contenido para dar la ilusión de infinito
const clone = slide.cloneNode(true);
logosContainer.appendChild(clone);

let scrollSpeed = 1.5; // Velocidad (px/frame)
let position = 0;

function animateSlider() {
  position -= scrollSpeed;
  
  // Cuando haya pasado la mitad del contenido, reiniciamos
  if (Math.abs(position) >= slide.offsetWidth) {
    position = 0;
  }
  
  // Aplicamos el desplazamiento a todo el contenedor
  logosContainer.style.transform = `translateX(${position}px)`;
  
  requestAnimationFrame(animateSlider);
}

// Inicia animación
logosContainer.style.display = "flex";
logosContainer.style.whiteSpace = "nowrap";
logosContainer.style.overflow = "hidden";
logosContainer.style.willChange = "transform";

animateSlider();

