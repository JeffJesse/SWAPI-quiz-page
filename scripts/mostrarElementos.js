const personajesIds = [1, 2, 3, 4, 5, 10, 11, 13, 14, 20, 21, 22];
const planetasIds = [1, 2, 3, 6, 7];

async function fetchAndDisplayData(ids, type) {
  for (const id of ids) {
      const apiUrl = `https://swapi.dev/api/${type}/${id}/`;

      try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
              throw new Error(`Error al obtener los datos de ${type} ${id}.`);
          }

          const data = await response.json();
          const name = data.name;
          const imageSrc = determineImageSrc(id);

          let cardContent;
          if (type === 'people') {
              cardContent = await transformPersonaje(data);
          } else if (type === 'planets') {
              cardContent = await transformPlaneta(data);
          }

          const card = `
              <div class="card">
                <div class="card-image">
                  <img src="${imageSrc}" alt="${name}">
                </div>
                <div class="card-info">
                  <h2>${name}</h2>
                  ${cardContent}
                </div>
              </div>
          `;

          $('.cards-container').append(card);
      } catch (error) {
          console.error(error);
      }
  }
}

async function fetchData(url) {
  try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error al obtener los datos:', error);
  }
}

  function determineImageSrc(id) {
    let imageSrc;
    if (window.location.pathname.includes('/personajes.html')) {
        imageSrc = `recursos/${id}.jpg`;
    } else if (window.location.pathname.includes('/planetas.html')) {
        imageSrc = `recursos/planeta${id}.jpg`; 
    } else {
        console.log("No se puede determinar la página actual.");
        imageSrc = `recursos/${id}.jpg`;
    }
    return imageSrc;
  }
  
  async function transformPersonaje(data) {
    const hairColor = transformColor(data.hair_color);
    const skinColor = transformColor(data.skin_color);
    const eyeColor = transformColor(data.eye_color);
    const gender = transformGenero(data.gender);

    const homeworldResponse = await fetch(data.homeworld);
    const homeworldData = await homeworldResponse.json();
    const homeworld = homeworldData.name;

    const filmResponse = await fetch(data.films[0]);
    const filmData = await filmResponse.json();
    const film = filmData.title;

    return `
        <p>Color de cabello: ${hairColor}</p>
        <p>Color de piel: ${skinColor}</p>
        <p>Color de ojos: ${eyeColor}</p>
        <p>Género: ${gender}</p>
        <p>Planeta de origen: ${homeworld}</p>
        <p>Película: ${film}</p>
    `;
}

async function transformPlaneta(data) {
    const climate = transformClimate(data.climate);
    const terrain = transformTerrain(data.terrain);
    const population = formatPopulation(data.population);
    let residents = [];
    let film = '';

    if (data.residents.length === 0) {
      residents.push('Ninguno');
    } else {
      for (let i = 0; i < 3 && i < data.residents.length; i++) {
          const residentResponse = await fetch(data.residents[i]);
          const residentData = await residentResponse.json();
          residents.push(residentData.name);
      }
    }

    const filmResponse = await fetch(data.films[0]);
    const filmData = await filmResponse.json();
    film = filmData.title;

    return `
        <p>Clima: ${climate}</p>
        <p>Terreno: ${terrain}</p>
        <p>Población: ${population}</p>
        <p>Residentes: ${residents.join(', ')}</p>
        <p>Película: ${film}</p>
    `;
}

  function transformColor(color) {
    switch(color) {
        case "auburn, white":
            return "Café amarillento";
        case "blue-gray":
            return "Azul grisáceo";
        case "none":
        return "Ninguno";
        case "blond":
            return "Rubio";
        case "fair":
            return "Beige";
        case "blue":
            return "Azul";
        case "n/a":
            return "No tiene";
        case "white, blue":
            return "Azul claro";
        case "red":
            return "Rojo";
        case "brown":
            return "Café";
        case "light":
            return "Café claro";
        case "black":
            return "Negro";
        case "white":
            return "Blanco";
        case "green":
            return "Verde";
        case "yellow":
            return "Amarillo";
        case "golden":
            return "Dorado";
        case "grey":
            return "Gris";
        case "pale":
            return "Pálido";
        case "gold":
            return "Oro";
        case "unknown":
            return "Desconocido";
        default:
            return color;
    }
}

function transformClimate(climate) {
  switch(climate) {
      case "temperate":
          return "Templado";
      case "arid":
          return "Árido";
      case "temperate, tropical":
          return "Templado y tropical";
          case "unknown":
          return "Desconocido";
      default:
          return color;
  }
}

function transformTerrain(terrain) {
  switch(terrain) {
      case "forests, mountains, lakes":
          return "Bosques y montañas";
      case "grasslands, mountains":
          return "Pastizales y montañas";
      case "gas giant":
          return "Praderas";
      case "desert":
          return "Desértico";
      case "jungle, rainforests":
          return "Junglas tropicales";
      case "gas giant":
          return "Gaseoso y árido";
      case "unknown":
          return "Desconocido";
      default:
          return color;
  }
}

function transformGenero(gender){
    switch (gender) {
      case "male":
          return "Hombre";
        case "female":
          return "Mujer";
        case "n/a":
          return "Ninguno";
      default:
        break;
    }
}

function formatPopulation(population) {
  if (population === "unknown") {
      return "Desconocida";
  }

  let formattedPopulation = parseInt(population).toLocaleString() + " de Habitantes";
  return formattedPopulation;
}

if (window.location.pathname.includes('/personajes.html')) {
  fetchAndDisplayData(personajesIds, 'people', transformPersonaje);
} 
else if (window.location.pathname.includes('/planetas.html')) {
  fetchAndDisplayData(planetasIds, 'planets', transformPlaneta);
} 
else {
  console.log("Archivo HTML no reconocido");
}