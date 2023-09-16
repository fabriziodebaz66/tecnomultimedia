let x, y, px, py;
let ang, dire; // ángulo de giro y dirección del disparo
let vel; // velocidad del disparo
let disparo = false;
let crecimiento = false; // Estado de crecimiento del proyectil
let proyectilSize = 10; // Tamaño inicial del proyectil
let proyectilColor = 255; // Cambia el color del proyectil a blanco
let misiles = []; // arreglo de misiles enemigos
let cantMisiles = 10;
let misilSpeed = 1; // Velocidad lenta de los misiles
let puntos = 0;
let objetivoX, objetivoY; // Punto de destino para el proyectil
let misilSize = 10; // Tamaño de los misiles
let crecimientoRate = 1; // Tasa de crecimiento del proyectil
let enemigosTocaronSuelo = 0; // Variable para contar enemigos que tocan el suelo
let enemigosDetenidos = false; // Variable para detener la generación de enemigos
let reiniciarButton; // Botón de reinicio
let estado = 'juego'; // Inicializa la variable estado con el valor 'juego'

function setup() {
  createCanvas(450, 450);
  x = width / 2;
  y = height;
  vel = 5;
  ang = -90;
  px = x;
  py = y;
  for (let i = 0; i < cantMisiles; i++) {
    misiles[i] = crearMisil();
  }
  textSize(30);
  enemigosDetenidos = false; // Asegúrate de que la variable esté definida aquí
}

function draw() {
  if (estado === 'juego') {
    // Lógica del juego
    background(0); // Fondo negro

    push();
    translate(x, y);
    ang = atan2(mouseY - y, mouseX - x); // captura el ángulo de giro del cañón
    rotate(ang);
    fill(100); // Cambia el color del cañón a gris oscuro
    rectMode(CENTER);
    rect(0, 0, 100, 30);
    pop();

    stroke(200); // Cambia el color de la rayita a gris claro
    line(mouseX, mouseY, x, y);

    if (!enemigosDetenidos) {
      for (let i = 0; i < cantMisiles; i++) {
        actualizarMisil(misiles[i]);
        mostrarMisil(misiles[i]);

        // Verifica si un misil enemigo colisiona con el proyectil
        if (
          px + proyectilSize / 2 > misiles[i].x - misilSize / 2 &&
          px - proyectilSize / 2 < misiles[i].x + misilSize / 2 &&
          py + proyectilSize / 2 > misiles[i].y - misilSize / 2 &&
          py - proyectilSize / 2 < misiles[i].y + misilSize / 2
        ) {
          reiniciarMisil(misiles[i]);
          puntos++;
        }
      }
    }

    fill(proyectilColor); // Usa el color blanco para el proyectil

    if (disparo) {
      // Calcula la distancia al objetivo
      let distancia = dist(px, py, objetivoX, objetivoY);

      // Si la distancia es mayor que la velocidad, avanza hacia el objetivo
      if (distancia > vel) {
        px += cos(dire) * vel;
        py += sin(dire) * vel;
      } else {
        // Si la distancia es menor o igual a la velocidad, llegamos al objetivo y detenemos el disparo
        px = objetivoX;
        py = objetivoY;
        disparo = false;
        crecimiento = true; // Inicia el crecimiento
      }
    }

    if (crecimiento) {
      // El proyectil sigue creciendo mientras no alcance un cierto tamaño
      if (proyectilSize < 75) {
        proyectilSize += crecimientoRate;
      } else {
        // El proyectil ha crecido lo suficiente, lo hacemos desaparecer
        crecimiento = false;
        px = -100; // Mueve el proyectil fuera de la pantalla
        py = -100; // Mueve el proyectil fuera de la pantalla
      }
    }

    // Ajusta el tamaño y la opacidad del proyectil
    fill(proyectilColor); // Usa el color blanco para el proyectil
    circle(px, py, proyectilSize);

    // Verifica si el proyectil ha alcanzado un tamaño suficiente para disparar otro
    if (proyectilSize >= 30) {
      proyectilListo = true;
    }

    if (!enemigosDetenidos) {
      // reiniciamos la posición de la bala si sale de la pantalla
      if (px > width || px < 0 || py > height || py < 0) {
        px = x;
        py = y;
        disparo = false;
        proyectilSize = 10; // Reinicia el tamaño del proyectil
      }
    }

    fill(0, 255, 0); // Cambia el color del puntaje a verde
    text(puntos, 50, 400);
    fill(255, 0, 0); // Cambia el color del contador a rojo
    text(enemigosTocaronSuelo, width - 100, 400);

    // Verifica si el contador rojo llega a 15
    if (enemigosTocaronSuelo >= 15) {
      enemigosDetenidos = true; // Detiene la generación de enemigos
      estado = 'perdiste'; // Cambia al estado "perdiste"
    }

    // Verifica si el contador verde llega a 15
    if (puntos >= 15) {
      enemigosDetenidos = true; // Detiene la generación de enemigos
      estado = 'ganaste'; // Cambia al estado "ganaste"
    }
  } else if (estado === 'perdiste') {
    // Pantalla de "perdiste"
    background(0); // Fondo negro
    fill(255);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("¡Perdiste!", width / 2, height / 2);

    // Muestra el botón de reinicio
    mostrarBotonReinicio();
    
  } else if (estado === 'ganaste') {
    // Pantalla de "ganaste"
    background(0); // Fondo negro
    fill(255);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("¡Ganaste!", width / 2, height / 2);

    // Muestra el botón de reinicio
    mostrarBotonReinicio();
  }
}

function mousePressed() {
  // Solo permite disparar si el proyectil no está en movimiento y el juego está en curso
  if (estado === 'juego' && !disparo && !crecimiento && !enemigosDetenidos) {
    disparo = true;
    dire = ang; // giro toma el ángulo del cañón
    objetivoX = mouseX; // Establece el objetivo X como la posición X del mouse
    objetivoY = mouseY; // Establece el objetivo Y como la posición Y del mouse
  }
}

function crearMisil() {
  let misil = {
    x: random(width),
    y: random(-200, -100), // Inicia arriba de la pantalla
    speedX: random(-1, 1), // Dirección aleatoria en el eje X
    speedY: misilSpeed,
    size: misilSize // Tamaño del misil
  };
  return misil;
}

function actualizarMisil(misil) {
  misil.x += misil.speedX;
  misil.y += misil.speedY;

  // Verifica si el misil toca los límites laterales de la pantalla
  if (misil.x < 0 || misil.x > width) {
    // Cambia la dirección del misil al chocar con un límite
    misil.speedX *= -1;
  }

  // Verifica si el misil toca el suelo sin ser impactado
  if (misil.y > height && dist(px, py, misil.x, height) >= 20) {
    enemigosTocaronSuelo++; // Incrementa el contador
    reiniciarMisil(misil);
  }

  // Reaparece en la parte superior cuando sale de la pantalla
  if (misil.y > height) {
    reiniciarMisil(misil);
  }
}

function reiniciarMisil(misil) {
  misil.x = random(width);
  misil.y = random(-200, -100);
  misil.speedX = random(-1, 1);
  misil.speedY = misilSpeed;
}

function mostrarMisil(misil) {
  fill(255, 0, 0);
  rect(misil.x, misil.y, misil.size, misil.size); // Cambia el misil a rectangular
}

function mostrarBotonReinicio() {
  // Muestra el botón de reinicio
  if (!reiniciarButton) {
    reiniciarButton = createButton('Reiniciar');
    reiniciarButton.position(width / 2 - 50, height - 50);
    reiniciarButton.size(100, 40);
    reiniciarButton.mousePressed(reiniciarJuego);
  }
}

function reiniciarJuego() {
  // Restablece todas las variables del juego a su estado inicial
  puntos = 0;
  enemigosTocaronSuelo = 0;
  enemigosDetenidos = false;
  estado = 'juego'; // Cambia al estado "juego"

  px = x;
  py = y;
  disparo = false;
  proyectilSize = 10;

  for (let i = 0; i < cantMisiles; i++) {
    misiles[i] = crearMisil();
  }

  // Oculta el botón de reinicio y elimina la referencia al botón anterior
  if (reiniciarButton) {
    reiniciarButton.remove();
    reiniciarButton = null; // Establece la referencia a null para que se pueda crear nuevamente
  }
}
