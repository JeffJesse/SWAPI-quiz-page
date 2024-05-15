$(document).ready(function () {
  let intentosRestantesPersonajes = 3;
  let intentosRestantesPlanetas = 3;
  let totalPlanetas = [1, 2, 3, 6, 7];
  let planetasRespondidos = [];
  let totalPersonajes = [2, 3, 4, 5, 10, 11, 13, 14, 20, 21, 22];
  let personajesRespondidos = [];
  let corazon1 = document.getElementById("corazon1");
  let corazon2 = document.getElementById("corazon2");
  let corazon3 = document.getElementById("corazon3");
  let preguntasTotalesPersonajes = totalPersonajes.length;
  let preguntasTotalesPlanetas = totalPlanetas.length;
  let preguntaActualPersonajes = 1;
  let preguntaActualPlanetas = 1;

  // Cargar el quiz al entrar
  cargarQuiz("personajes");

  function quitarVidasPersonajes() {
    if (intentosRestantesPersonajes === 2) {
      corazon3.style.display = "none";
    } else if (intentosRestantesPersonajes === 1) {
      corazon2.style.display = "none";
    } else if (intentosRestantesPersonajes === 0) {
      corazon1.style.display = "none";
    }
  }

  function reiniciarVidas() {
    corazon3.style.display = "inline-block";
    corazon2.style.display = "inline-block";
    corazon1.style.display = "inline-block";
  }

  function quitarVidasPlanetas() {
    if (intentosRestantesPlanetas === 2) {
      corazon3.style.display = "none";
    } else if (intentosRestantesPlanetas === 1) {
      corazon2.style.display = "none";
    } else if (intentosRestantesPlanetas === 0) {
      corazon1.style.display = "none";
    }
  }

  function quizPersonajes() {
    $("h2").text("PERSONAJES");
    reiniciarVidas();
    cargarPreguntaPersonajes();
  }

  function cargarPreguntaPersonajes() {
    let intentosRestantesPersonajes = 3;
    if (totalPersonajes.length === 0) {
      mostrarAlertaGanar("GANASTE, Obi-Wan te ha instruido bien...");
      reiniciarVidas();
      resetPersonajesQuiz();
      return;
    }

    let randomIndex = Math.floor(Math.random() * totalPersonajes.length);
    let personajeID = totalPersonajes[randomIndex];
    let apiUrl = "https://swapi.dev/api/people/" + personajeID + "/";

    $.get(apiUrl, function (data, status) {
      if (status === "success") {
        let nombre = data.name;
        let colorPelo = transformarColor(data.hair_color);
        let colorPiel = transformarColor(data.skin_color);
        let colorOjos = transformarColor(data.eye_color);

        let numAleatorio = Math.floor(Math.random() * 3);
        let pregunta;
        let respuestaCorrecta;
        let opciones = [];

        switch (numAleatorio) {
          case 0:
            pregunta = "¿Cuál es el color de cabello de " + nombre + "?";
            respuestaCorrecta = colorPelo;
            opciones = [colorPelo, colorPiel, colorOjos];
            break;
          case 1:
            pregunta = "¿De qué color es el cuerpo de " + nombre + "?";
            respuestaCorrecta = colorPiel;
            opciones = [colorPelo, colorPiel, colorOjos];
            break;
          case 2:
            pregunta = "¿De qué color son los ojos de " + nombre + "?";
            respuestaCorrecta = colorOjos;
            opciones = [colorPelo, colorPiel, colorOjos];
            break;
          default:
            break;
        }

        $("#pregunta").text(pregunta);
        $("#imagen-personaje").attr("src", "recursos/" + personajeID + ".jpg");

        mezclarArreglo(opciones);

        // Filtrar respuestas duplicadas
        opciones = opciones.filter(function (item, pos) {
          return opciones.indexOf(item) === pos;
        });

        crearRespuestasPersonajes(opciones, respuestaCorrecta);
      } else {
        console.log("Error al cargar los datos del personaje.");
      }
    });

    personajesRespondidos.push(personajeID);
    let index = totalPersonajes.indexOf(personajeID);
    if (index > -1) {
      totalPersonajes.splice(index, 1);
    }

    $("#contador-preguntas").text(
      `Pregunta ${preguntaActualPersonajes} de ${preguntasTotalesPersonajes}`
    );
    preguntaActualPersonajes++;
  }

  function crearRespuestasPersonajes(opciones, respuestaCorrecta) {
    $("#opciones").empty(); // Limpiar los botones que venian antes

    opciones.forEach(function (option) {
      let button = $("<button>").text(option);
      button.click(function () {
        if ($(this).text() === respuestaCorrecta) {
          mostrarAlertaExito("¡Correcto eso es!");
          $(this).addClass("respuesta-correcta");
          setTimeout(
            function () {
              $(this).removeClass("respuesta-correcta");
              cargarPreguntaPersonajes();
            }.bind(this),
            1000
          );
        } else {
          intentosRestantesPersonajes--;
          quitarVidasPersonajes();
          $(this).addClass("respuesta-incorrecta");
          setTimeout(
            function () {
              $(this).removeClass("respuesta-incorrecta");
            }.bind(this),
            1000
          );
          if (intentosRestantesPersonajes === 0) {
            corazon1.style.display = "none";
            mostrarAlertaError("PERDISTE, ¡ÚNETE AL LADO OSCURO!");
            resetPersonajesQuiz();
          } else {
            mostrarAlertaAdvertencia("¡Respuesta incorrecta!");
            quitarVidasPersonajes();
          }
        }
      });
      $("#opciones").append(button);
    });
  }

  function transformarColor(color) {
    switch (color) {
      case "auburn, white":
        return "CASTAÑO";
      case "blue-gray":
        return "GRIS";
      case "none":
        return "NINGUNO";
      case "blond":
        return "DORADO";
      case "fair":
        return "BEIGE";
      case "blue":
        return "AZUL";
      case "n/a":
        return "NO TIENE";
      case "white, blue":
        return "AZUL CLARO";
      case "red":
        return "ROJO";
      case "brown":
        return "CAFÉ";
      case "light":
        return "CAFÉ CLARO";
      case "black":
        return "NEGRO";
      case "white":
        return "BLANCO";
      case "green":
        return "VERDE";
      case "yellow":
        return "AMARILLO";
      case "golden":
        return "DORADO";
      case "grey":
        return "GRIS";
      case "pale":
        return "BLANCO GRISÁCEO";
      case "gold":
        return "DORADO";
      case "unknown":
        return "DESCONOCIDO";
      default:
        return color;
    }
  }

  function quizPlanetas() {
    $("h2").text("PLANETAS");
    reiniciarVidas();
    cargarPreguntaPlanetas();
  }

  function cargarPreguntaPlanetas() {
    let intentosRestantesPlanetas = 3;
    if (totalPlanetas.length === 0) {
      mostrarAlertaGanar("GANASTE, Obi-Wan te ha instruido bien...");
      reiniciarVidas();
      resetPlanetasQuiz();
      return;
    }

    let randomIndex = Math.floor(Math.random() * totalPlanetas.length);
    let planetId = totalPlanetas[randomIndex];
    let apiUrl = "https://swapi.dev/api/planets/" + planetId + "/";

    $.get(apiUrl, function (data, status) {
      if (status === "success") {
        let nombre = data.name;
        let clima = transformarClima(data.climate);
        let terreno = transformarTerreno(data.terrain);
        let poblacion = data.population;

        let numAleatorio = Math.floor(Math.random() * 3);
        let pregunta;
        let respuestaCorrecta;
        let opciones = [];

        switch (numAleatorio) {
          case 0:
            pregunta = "¿Cuál es el tipo de clima del planeta " + nombre + "?";
            respuestaCorrecta = clima;
            opciones = [
              climasIncorrectos(clima),
              climasIncorrectos(clima),
              clima,
            ];
            break;
          case 1:
            pregunta = "¿Cuál es el tipo de terreno que hay en " + nombre + "?";
            respuestaCorrecta = terreno;
            opciones = [
              terrenosIncorrectos(terreno),
              terreno,
              terrenosIncorrectos(terreno),
            ];
            break;
          case 2:
            pregunta = "¿Cuál es la población del planeta " + nombre + "?";
            respuestaCorrecta = transformarPoblacion(poblacion);
            opciones = [
              transformarPoblacion(poblacion),
              transformarPoblacion(poblacionIncorrecta(poblacion)),
              transformarPoblacion(poblacionIncorrecta(poblacion)),
            ];
            break;
          default:
            break;
        }

        $("#pregunta").text(pregunta);
        $("#imagen-personaje").attr(
          "src",
          "recursos/planeta" + planetId + ".jpg"
        );

        mezclarArreglo(opciones);

        // Filtrar las respuestas que venian antes
        opciones = opciones.filter(function (item, pos) {
          return opciones.indexOf(item) === pos;
        });

        crearRespuestasPlanetas(opciones, respuestaCorrecta);
      } else {
        console.log("Error al cargar los datos del planeta.");
      }
    });

    planetasRespondidos.push(planetId);
    let index = totalPlanetas.indexOf(planetId);
    if (index >= 0) {
      totalPlanetas.splice(index, 1);
    }

    $("#contador-preguntas").text(
      `Pregunta ${preguntaActualPlanetas} de ${preguntasTotalesPlanetas}`
    );
    preguntaActualPlanetas++;
  }

  function transformarClima(clima) {
    switch (clima) {
      case "temperate":
        return "Templado";
      case "arid":
        return "Árido";
      case "temperate, tropical":
        return "Templado y tropical";
      case "unknown":
        return "DESCONOCIDO";
      default:
        return color;
    }
  }

  function transformarTerreno(terreno) {
    switch (terreno) {
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
        return "DESCONOCIDO";
      default:
        return color;
    }
  }

  function resetPlanetasQuiz() {
    totalPlanetas = [1, 2, 3, 6, 7];
    planetasRespondidos = [];
    intentosRestantesPlanetas = 3;
    reiniciarVidas();
    $("#opciones").empty();
    $("#imagen-personaje").attr("src", "");
    $("#pregunta").text("");
    preguntaActualPlanetas = 1;
    cargarPreguntaPlanetas();
  }

  function resetPersonajesQuiz() {
    totalPersonajes = [2, 3, 4, 5, 10, 11, 13, 14, 20, 21, 22];
    personajesRespondidos = [];
    intentosRestantesPersonajes = 3;
    reiniciarVidas();
    $("#opciones").empty();
    $("#imagen-personaje").attr("src", "");
    $("#pregunta").text("");
    preguntaActualPersonajes = 1;
    cargarPreguntaPersonajes();
  }

  function climasIncorrectos(respuestaCorrecta) {
    let respuestasIncorrectas = [
      "Desértico",
      "Ártico",
      "Húmedo",
      "Seco",
      "Cálido",
      "Frío",
      "Lluvioso",
      "Nublado",
      "Soleado",
      "Ventoso",
      "Montañoso",
      "Llano",
      "Boscoso",
      "Acuático",
      "Volcánico",
      "Rocoso",
      "Arenoso",
      "Helado",
    ];

    let opcionesDisponibles = respuestasIncorrectas.filter(function (option) {
      return option.toLowerCase() !== respuestaCorrecta.toLowerCase();
    });

    return opcionesDisponibles[Math.floor(Math.random() * opcionesDisponibles.length)];
  }

  function terrenosIncorrectos(respuestaCorrecta) {
    let respuestasIncorrectas = ["Llanura", "Pantano", "Volcánico"];

    let opcionesDisponibles = respuestasIncorrectas.filter(function (option) {
      return option.toLowerCase() !== respuestaCorrecta.toLowerCase();
    });

    return opcionesDisponibles[Math.floor(Math.random() * opcionesDisponibles.length)];
  }

  function poblacionIncorrecta(respuestaCorrecta) {
    let respuestasIncorrectas = ["20000000", "3000000", "9000000000"];

    let opcionesDisponibles = respuestasIncorrectas.filter(function (option) {
      return option.toLowerCase() !== respuestaCorrecta.toLowerCase();
    });

    return opcionesDisponibles[Math.floor(Math.random() * opcionesDisponibles.length)];
  }

  function transformarPoblacion(poblacion) {
    if (poblacion === "unknown") {
      return "Desconocida";
    }

    let formatoPoblacion =
      parseInt(poblacion).toLocaleString() + " de Habitantes";
    return formatoPoblacion;
  }

  function mezclarArreglo(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  function crearRespuestasPlanetas(opciones, respuestaCorrecta) {
    // Limpiar las respuestas que estaban antes
    $("#opciones").empty();

    opciones.forEach(function (option) {
      let button = $("<button>").text(option);
      button.click(function () {
        if ($(this).text() === respuestaCorrecta) {
          mostrarAlertaExito("¡Correcto eso es!");
          $(this).addClass("respuesta-correcta");
          setTimeout(
            function () {
              $(this).removeClass("respuesta-correcta");
              cargarPreguntaPlanetas();
            }.bind(this),
            1000
          );
        } else {
          intentosRestantesPlanetas--;
          quitarVidasPlanetas();
          $(this).addClass("respuesta-incorrecta");
          setTimeout(
            function () {
              $(this).removeClass("respuesta-incorrecta");
            }.bind(this),
            1000
          );
          if (intentosRestantesPlanetas === 0) {
            corazon1.style.display = "none";
            mostrarAlertaError("PERDISTE, ¡ENTREGATE AL LADO OSCURO!");
            resetPlanetasQuiz();
          } else {
            mostrarAlertaAdvertencia("¡Respuesta incorrecta!");
          }
        }
      });
      $("#opciones").append(button);
    });
  }

  function cargarQuiz(nombreQuiz) {
    $("#opciones").empty();
    $("#imagen-personaje").attr("src", "");
    $("#pregunta").text("");

    switch (nombreQuiz) {
      case "personajes":
        preguntaActualPersonajes = 1;
        intentosRestantesPersonajes = 3;
        quizPersonajes();
        break;
      case "planetas":
        preguntaActualPlanetas = 1;
        intentosRestantesPlanetas = 3;
        quizPlanetas();
        break;
    }
  }

  // Botón pa seleccionar del quiz
  $("nav a").click(function (e) {
    $("nav a").removeClass("active");
    $(this).addClass("active");
    let nombreQuiz = $(this).data("quiz");
    cargarQuiz(nombreQuiz);
  });

  // Alerta de que le salio bien la respuesta
  function mostrarAlertaExito(mensaje) {
    const contenedorAlerta = document.getElementById("contenedor-alerta");
    const divDeAlerta = document.createElement("div");
    divDeAlerta.classList.add("alerta-exito");

    const mensajeParrafo = document.createElement("p");
    mensajeParrafo.textContent = mensaje;
    divDeAlerta.appendChild(mensajeParrafo);
    contenedorAlerta.appendChild(divDeAlerta);

    setTimeout(function () {
      divDeAlerta.remove();
    }, 1000);
  }

  // Alerta de que salio mal
  function mostrarAlertaAdvertencia(mensaje) {
    const contenedorAlerta = document.getElementById("contenedor-alerta");
    const divDeAlerta = document.createElement("div");
    divDeAlerta.classList.add("alerta-advertencia");

    const mensajeParrafo = document.createElement("p");
    mensajeParrafo.textContent = mensaje;
    divDeAlerta.appendChild(mensajeParrafo);
    contenedorAlerta.appendChild(divDeAlerta);

    setTimeout(function () {
      divDeAlerta.remove();
    }, 1000);
  }

  // Alerta porque perdio
  function mostrarAlertaError(mensaje) {
    const contenedorAlerta = document.getElementById("contenedor-alerta");
    const divDeAlerta = document.createElement("div");
    divDeAlerta.classList.add("alerta-perder");

    const mensajeParrafo = document.createElement("p");
    mensajeParrafo.textContent = mensaje;
    divDeAlerta.appendChild(mensajeParrafo);
    contenedorAlerta.appendChild(divDeAlerta);

    setTimeout(function () {
      divDeAlerta.remove();
    }, 3000);
  }

  function mostrarAlertaGanar(mensaje) {
    const contenedorAlerta = document.getElementById("contenedor-alerta");
    const divDeAlerta = document.createElement("div");
    divDeAlerta.classList.add("alerta-ganar");

    const mensajeParrafo = document.createElement("p");
    mensajeParrafo.textContent = mensaje;
    divDeAlerta.appendChild(mensajeParrafo);
    contenedorAlerta.appendChild(divDeAlerta);

    setTimeout(function () {
      divDeAlerta.remove();
    }, 3000);
  }
});
