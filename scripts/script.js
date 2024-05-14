$(document).ready(function(){
    let intentosRestantesPersonajes = 3;
    let intentosRestantesPlanetas = 3;
    let planets = [1, 2, 3, 6, 7];
    let answeredPlanets = [];
    let characters = [2, 3, 4, 5, 10, 11, 13, 14, 20, 21, 22];
    let answeredCharacters = [];
    let corazon1 = document.getElementById('corazon1');
    let corazon2 = document.getElementById('corazon2');
    let corazon3 = document.getElementById('corazon3');
    let totalQuestionsCharacters = characters.length;
    let totalQuestionsPlanets = planets.length;
    let currentQuestionCharacters = 1;
    let currentQuestionPlanets = 1;
    

    // Cargar el quiz al entrar
    loadQuiz('personajes');
            
    function quitarVidasPersonajes(){
        if (intentosRestantesPersonajes === 2) {
            corazon3.style.display = 'none';
        } else if (intentosRestantesPersonajes === 1) {
            corazon2.style.display = 'none';
        } else if (intentosRestantesPersonajes === 0) {
            corazon1.style.display = 'none';
        }
    }

    function reiniciarVidas(){
        corazon3.style.display = 'inline-block';
        corazon2.style.display = 'inline-block';
        corazon1.style.display = 'inline-block';
    }

    function quitarVidasPlanetas(){
        if (intentosRestantesPlanetas === 2) {
            corazon3.style.display = 'none';
        } else if (intentosRestantesPlanetas === 1) {
            corazon2.style.display = 'none';
        } else if (intentosRestantesPlanetas === 0) {
            corazon1.style.display = 'none';
        }
    }

    function quizPersonajes(){
        $('h2').text('PERSONAJES');
        reiniciarVidas();
        loadQuestion();
    }

    function loadQuestion() {
        let intentosRestantesPersonajes = 3;
        if (characters.length === 0) {
            mostrarAlertaExito("Obi-Wan te ha instruido bien...");
            reiniciarVidas();
            resetPersonajesQuiz();
            return;
        }

        let randomIndex = Math.floor(Math.random() * characters.length);
        let characterId = characters[randomIndex];
        let apiUrl = "https://swapi.dev/api/people/" + characterId + "/";

        $.get(apiUrl, function(data, status){
            if(status === "success"){
                let name = data.name;
                let hairColor = transformColor(data.hair_color);
                let skinColor = transformColor(data.skin_color);
                let eyeColor = transformColor(data.eye_color);

                let randomNumber = Math.floor(Math.random() * 3);
                let question;
                let correctAnswer;
                let options = [];

                switch(randomNumber){
                    case 0:
                        question = "¿Cuál es el color de cabello de " + name + "?";
                        correctAnswer = hairColor;
                        options = [hairColor, skinColor, eyeColor];
                        break;
                    case 1:
                        question = "¿De qué color es el cuerpo de " + name + "?";
                        correctAnswer = skinColor;
                        options = [hairColor, skinColor, eyeColor];
                        break;
                    case 2:
                        question = "¿De qué color son los ojos de " + name + "?";
                        correctAnswer = eyeColor;
                        options = [hairColor, skinColor, eyeColor];
                        break;
                    default:
                        break;
                }

                $("#question").text(question);
                $("#character-image").attr("src", "recursos/" + characterId + ".jpg");

                shuffleArray(options);

                // Filtrar respuestas duplicadas
                options = options.filter(function(item, pos) {
                    return options.indexOf(item) === pos;
                });

                crearBotonesDeOpcion(options, correctAnswer);

            } else {
                console.log("Error al cargar los datos del personaje.");
            }
        });

        answeredCharacters.push(characterId);
        let index = characters.indexOf(characterId);
        if (index > -1) {
            characters.splice(index, 1);
        }

        $("#question-counter").text(`Pregunta ${currentQuestionCharacters} de ${totalQuestionsCharacters}`);
        currentQuestionCharacters++;
    }

    function crearBotonesDeOpcion(options, correctAnswer){
        $("#options").empty(); // Limpiar los botones que venian antes

        options.forEach(function(option){
            let button = $("<button>").text(option);
            button.click(function(){
                if($(this).text() === correctAnswer){
                    mostrarAlertaExito("¡Correcto eso es!");
                    loadQuestion();
                } else {
                    intentosRestantesPersonajes--;
                    quitarVidasPersonajes();
                    if (intentosRestantesPersonajes === 0) {
                        corazon1.style.display = 'none';
                        mostrarAlertaError("REVISA TUS VIDAS")
                        resetPersonajesQuiz();
                    } else {
                        mostrarAlertaAdvertencia("Respuesta incorrecta");
                        quitarVidasPersonajes();
                    }
                }
            });
            $("#options").append(button);
        });    
    }

    function transformColor(color) {
        switch(color) {
            case "auburn, white":
                return "CAFÉ AMARILLENTO";
            case "blue-gray":
                return "AZUL GRISÁCEO";
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
        $('h2').text('PLANETAS');
        reiniciarVidas();
        loadPlanetsQuestion();
    }

    function loadPlanetsQuestion() {
        let intentosRestantesPlanetas = 3;
        if (planets.length === 0) {
            mostrarAlertaExito("Obi-Wan te ha instruido bien...");
                reiniciarVidas();
                resetPlanetasQuiz();
            return;
        }

        let randomIndex = Math.floor(Math.random() * planets.length);
        let planetId = planets[randomIndex];
        let apiUrl = "https://swapi.dev/api/planets/" + planetId + "/";

        $.get(apiUrl, function(data, status) {
            if (status === "success") {
                let name = data.name;
                let climate = transformClimate(data.climate);
                let terrain = transformTerrain(data.terrain);
                let population = data.population;

                let randomNumber = Math.floor(Math.random() * 3);
                let question;
                let correctAnswer;
                let options = [];

                switch (randomNumber) {
                    case 0:
                        question = "¿Cuál es el tipo de clima del planeta " + name + "?";
                        correctAnswer = climate;
                        options = [climasIncorrectos(climate), climasIncorrectos(climate), climate];
                        break;
                    case 1:
                        question = "¿Cuál es el tipo de terreno que hay en " + name + "?";
                        correctAnswer = terrain;
                        options = [terrenosIncorrectos(terrain), terrain, terrenosIncorrectos(terrain)];
                        break;
                    case 2:
                        question = "¿Cuál es la población del planeta " + name + "?";
                        correctAnswer = formatPopulation(population);
                        options = [formatPopulation(population), formatPopulation(poblacionIncorrecta(population)), formatPopulation(poblacionIncorrecta(population))];
                        break;
                    default:
                        break;
                }

                $("#question").text(question);
                $("#character-image").attr("src", "recursos/planeta" + planetId + ".jpg");

                shuffleArray(options);

                // Filtrar las respuestas que venian antes
                options = options.filter(function(item, pos) {
                    return options.indexOf(item) === pos;
                });

                createOptionButtons(options, correctAnswer);

            } else {
                console.log("Error al cargar los datos del planeta.");
            }
        });

        answeredPlanets.push(planetId);
        let index = planets.indexOf(planetId);
        if (index >= 0) {
            planets.splice(index, 1);
        }

        $("#question-counter").text(`Pregunta ${currentQuestionPlanets} de ${totalQuestionsPlanets}`);
        currentQuestionPlanets++;

    }

    function transformClimate(climate) {
        switch(climate) {
            case "temperate":
                return "Templado";
            case "arid":
                return "árido";
            case "temperate, tropical":
                return "Templado y tropical";
                case "unknown":
                return "DESCONOCIDO";
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
                return "DESCONOCIDO";
            default:
                return color;
        }
    }

    function resetPlanetasQuiz() {
        planets = [1, 2, 3, 6, 7];
        answeredPlanets = [];
        intentosRestantesPlanetas = 3;
        reiniciarVidas(); 
        $("#options").empty();
        $("#character-image").attr("src", "");
        $("#question").text(""); 
        currentQuestionPlanets = 1;
        loadPlanetsQuestion();
    }

    function resetPersonajesQuiz() {
        characters = [2, 3, 4, 5, 10, 11, 13, 14, 20, 21, 22];
        answeredCharacters = [];
        intentosRestantesPersonajes = 3;
        reiniciarVidas(); 
        $("#options").empty(); 
        $("#character-image").attr("src", ""); 
        $("#question").text(""); 
        currentQuestionCharacters = 1; 
        loadQuestion();
    }

    function climasIncorrectos(correctAnswer) {
        let wrongOptions = [
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
                "Helado"
            ];

            let filteredOptions = wrongOptions.filter(function(option) {
            return option.toLowerCase() !== correctAnswer.toLowerCase();
        });

        return filteredOptions[Math.floor(Math.random() * filteredOptions.length)];
    }

    function terrenosIncorrectos(correctAnswer) {
        let wrongOptions = [
            "Llanura",
            "Pantano",
            "Volcánico",
        ];

        let filteredOptions = wrongOptions.filter(function(option) {
        return option.toLowerCase() !== correctAnswer.toLowerCase();
    });

    return filteredOptions[Math.floor(Math.random() * filteredOptions.length)];
}

    function poblacionIncorrecta(correctAnswer) {
        let wrongOptions = [
            "20000000",
            "3000000",
            "9000000000",
        ];

    let filteredOptions = wrongOptions.filter(function(option) {
        return option.toLowerCase() !== correctAnswer.toLowerCase();
    });

    return filteredOptions[Math.floor(Math.random() * filteredOptions.length)];
    }

    function formatPopulation(population) {
        if (population === "unknown") {
            return "Desconocida";
        }

        let formattedPopulation = parseInt(population).toLocaleString() + " de Habitantes";
        return formattedPopulation;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    function createOptionButtons(options, correctAnswer) {
        // Limpiar las respuestas que estaban antes
        $("#options").empty();
    
        options.forEach(function(option) {
            let button = $("<button>").text(option);
            button.click(function() {
                if ($(this).text() === correctAnswer) {
                    mostrarAlertaExito("¡Correcto eso es!");
                    loadPlanetsQuestion();
                } else {
                    intentosRestantesPlanetas--;
                    quitarVidasPlanetas();
                    if (intentosRestantesPlanetas === 0) {
                        corazon1.style.display = 'none';
                        mostrarAlertaError("Me ha fallado por última vez, Almirante");
                        resetPlanetasQuiz();
                    } else {
                        mostrarAlertaAdvertencia("Respuesta incorrecta.");
                    }
                }
            });
            $("#options").append(button);
        });
    }

    function loadQuiz(quizName) {

        $("#options").empty();
        $("#character-image").attr("src", "");
        $("#question").text("");

        switch (quizName) {
            case 'personajes':
                currentQuestionCharacters = 1;
                intentosRestantesPersonajes = 3;
                quizPersonajes();
                break;
            case 'planetas':
                currentQuestionPlanets = 1;
                intentosRestantesPlanetas = 3;
                quizPlanetas();
                break;
        }
    }

    // Evento para el selector del quiz
    $('nav a').click(function(e) {
        $('nav a').removeClass('active');
        $(this).addClass('active');
        let quizName = $(this).data('quiz');
        loadQuiz(quizName);
    });

    // Alerta de que salio bien la respuesta del chavalo
    function mostrarAlertaExito(mensaje) {
        const alertContainer = document.getElementById('alertContainer');
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('custom-alert');

        const mensajeParrafo = document.createElement('p');
        mensajeParrafo.textContent = mensaje;
        alertDiv.appendChild(mensajeParrafo);
        alertContainer.appendChild(alertDiv);
    
        setTimeout(function() {
            alertDiv.remove();
        }, 3000);
    }
    
// Alerta de que salio mal
function mostrarAlertaAdvertencia(mensaje) {
    const alertContainer = document.getElementById('alertContainer');
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('custom-alert-warning');

    const mensajeParrafo = document.createElement('p');
    mensajeParrafo.textContent = mensaje;
    alertDiv.appendChild(mensajeParrafo);
    alertContainer.appendChild(alertDiv);

    setTimeout(function() {
        alertDiv.remove();
    }, 1000);
}


// Alerta porque perdio
function mostrarAlertaError(mensaje) {
    const alertContainer = document.getElementById('alertContainer');
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('custom-alert-error');

    const mensajeParrafo = document.createElement('p');
    mensajeParrafo.textContent = mensaje;
    alertDiv.appendChild(mensajeParrafo);
    alertContainer.appendChild(alertDiv);

    setTimeout(function() {
        alertDiv.remove();
    }, 1000);
}
});