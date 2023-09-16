// Debaz Fabrizio
// tp4 comision 1

let x, y, px, py;
let ang, dire;
let vel;
let disparo = false;
let crecimiento = false;
let proyectilSize = 10;
let proyectilColor = 255;
let enemigos = [];
let cantEnemigos = 10;
let enemigoSpeed = 1;
let puntos = 0;
let objetivoX, objetivoY;
let enemigoSize = 10;
let crecimientoRate = 1;
let enemigosTocaronSuelo = 0;
let enemigosDetenidos = false;
let botonReset;
let estado = 'juego';

function setup() {
  createCanvas(450, 450);
  x = width / 2;
  y = height;
  vel = 5;
  ang = -90;
  px = x;
  py = y;
  for (let i = 0; i < cantEnemigos; i++) {
    enemigos[i] = crearEnemigo();
  }
  textSize(30);
  enemigosDetenidos = false;
}

function draw() {
  if (estado === 'juego') {
    background(0);

    push();
    translate(x, y);
    ang = atan2(mouseY - y, mouseX - x);
    rotate(ang);
    fill(100);
    rectMode(CENTER);
    rect(0, 0, 100, 30);
    pop();

    stroke(200);
    line(mouseX, mouseY, x, y);

    if (!enemigosDetenidos) {
      for (let i = 0; i < cantEnemigos; i++) {
        actualizarEnemigo(enemigos[i]);
        mostrarEnemigo(enemigos[i]);

        if (
          px + proyectilSize / 2 > enemigos[i].x - enemigoSize / 2 &&
          px - proyectilSize / 2 < enemigos[i].x + enemigoSize / 2 &&
          py + proyectilSize / 2 > enemigos[i].y - enemigoSize / 2 &&
          py - proyectilSize / 2 < enemigos[i].y + enemigoSize / 2
        ) {
          resetEnemigo(enemigos[i]);
          puntos++;
        }
      }
    }

    fill(proyectilColor);

    if (disparo) {
      let distancia = dist(px, py, objetivoX, objetivoY);

      if (distancia > vel) {
        px += cos(dire) * vel;
        py += sin(dire) * vel;
      } else {
        px = objetivoX;
        py = objetivoY;
        disparo = false;
        crecimiento = true;
      }
    }

    if (crecimiento) {
      if (proyectilSize < 75) {
        proyectilSize += crecimientoRate;
      } else {
        crecimiento = false;
        px = -100;
        py = -100;
      }
    }

    fill(proyectilColor);
    circle(px, py, proyectilSize);

    if (proyectilSize >= 30) {
      proyectilListo = true;
    }

    if (!enemigosDetenidos) {
      if (px > width || px < 0 || py > height || py < 0) {
        px = x;
        py = y;
        disparo = false;
        proyectilSize = 10;
      }
    }

    fill(0, 255, 0);
    text(puntos, 50, 400);
    fill(255, 0, 0);
    text(enemigosTocaronSuelo, width - 100, 400);

    if (enemigosTocaronSuelo >= 15) {
      enemigosDetenidos = true;
      estado = 'perdiste';
    }

    if (puntos >= 15) {
      enemigosDetenidos = true;
      estado = 'ganaste';
    }
  } else if (estado === 'perdiste') {
    background(0);
    fill(255);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("¡Perdiste!", width / 2, height / 2);

    if (!botonReset) {
      botonReset = createButton('Reset');
      botonReset.position(width / 2 - 50, height - 50);
      botonReset.size(100, 40);
      botonReset.mousePressed(resetJuego);
    }
  } else if (estado === 'ganaste') {
    background(0);
    fill(255);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("¡Ganaste!", width / 2, height / 2);

    if (!botonReset) {
      botonReset = createButton('Reset');
      botonReset.position(width / 2 - 50, height - 50);
      botonReset.size(100, 40);
      botonReset.mousePressed(resetJuego);
    }
  }
}

function mousePressed() {
  if (estado === 'juego' && !disparo && !crecimiento && !enemigosDetenidos) {
    disparo = true;
    dire = ang;
    objetivoX = mouseX;
    objetivoY = mouseY;
  }
}

function crearEnemigo() {
  let enemigo = {
    x: random(width),
    y: random(-200, -100),
    speedX: random(-1, 1),
    speedY: enemigoSpeed,
    size: enemigoSize
  };
  return enemigo;
}

function actualizarEnemigo(enemigo) {
  enemigo.x += enemigo.speedX;
  enemigo.y += enemigo.speedY;

  if (enemigo.x < 0 || enemigo.x > width) {
    enemigo.speedX *= -1;
  }

  if (enemigo.y > height && dist(px, py, enemigo.x, height) >= 20) {
    enemigosTocaronSuelo++;
    resetEnemigo(enemigo);
  }

  if (enemigo.y > height) {
    resetEnemigo(enemigo);
  }
}

function resetEnemigo(enemigo) {
  enemigo.x = random(width);
  enemigo.y = random(-200, -100);
  enemigo.speedX = random(-1, 1);
  enemigo.speedY = enemigoSpeed;
}

function mostrarEnemigo(enemigo) {
  fill(255, 0, 0);
  rect(enemigo.x, enemigo.y, enemigo.size, enemigo.size);
}

function mostrarBotonReset() {
  if (!botonReset) {
    botonReset = createButton('Reset');
    botonReset.position(width / 2 - 50, height - 50);
    botonReset.size(100, 40);
    botonReset.mousePressed(resetJuego);
  }
}

function resetJuego() {
  puntos = 0;
  enemigosTocaronSuelo = 0;
  enemigosDetenidos = false;
  estado = 'juego';

  px = x;
  py = y;
  disparo = false;
  proyectilSize = 10;

  for (let i = 0; i < cantEnemigos; i++) {
    enemigos[i] = crearEnemigo();
  }

  if (botonReset) {
    botonReset.remove();
    botonReset = null;
  }
}
