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
    void containerElement.offsetWidth; // Reiniciar animaciones

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

// Mostrar escudos al cambiar equipos
team1Select.addEventListener('change', () => {
  mostrarEscudoYNombre(team1Select.value, escudo1Img, nombre1, escudo1Container, 'left');
});

team2Select.addEventListener('change', () => {
  mostrarEscudoYNombre(team2Select.value, escudo2Img, nombre2, escudo2Container, 'right');
});

// Predicción con botón animado
document.getElementById('predictBtn').addEventListener('click', function (e) {
  e.preventDefault();

  const team1 = team1Select.value;
  const team2 = team2Select.value;

  if (team1 === "" || team2 === "") {
    document.getElementById('result').innerText = "Selecciona ambos equipos.";
    return;
  }

  if (team1 === team2) {
    document.getElementById('result').innerText = "Por favor, selecciona equipos diferentes.";
    return;
  }

  const randomPercentage = (Math.random() * 100).toFixed(2);
  const result = `${team1} tiene ${randomPercentage}% de probabilidad de ganar contra ${team2}`;
  document.getElementById('result').innerText = result;
});
