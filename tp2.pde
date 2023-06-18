//Debaz Fabrizio
//tp2 comision 1


PImage img;

void setup() {
  size(800, 400);
  img = loadImage("imagen.jpg"); 
}

void draw() {
  background(0);
  strokeWeight(10);
  image(img, 0, 0); 
  
  for (int y = 0; y < height; y += 10) {
    if (y % 20 == 0) {
      stroke(0);
    } else {
      stroke(255);
    }
    
    line(width / 2, y, width - y, width / 2);
    line(width/2, -y, width + y, width/2);
  }
  
  strokeWeight(15);
  float cuadrado1 = 456;
  boolean dibujarNegro = true;

  for (int posCuadrado = (int)cuadrado1; posCuadrado < width && posCuadrado <= 740; posCuadrado += 12) {
    if (dibujarNegro) {
      stroke(0);
    } else {
      stroke(255);
    }
    
    line(posCuadrado, 54, posCuadrado, 340);
    
    dibujarNegro = !dibujarNegro;
  }

  strokeWeight(10);
  for (int y = 100; y < 276; y += 10) {
    if (y % 20 == 0) {
      stroke(0);
    } else {
      stroke(255);
    }
    
    line(670, y, 526, 270);
  }
  
/*  int mouseXPos = mouseX;
  int mouseYPos = mouseY;
  fill(255, 0, 0);
  text("Posición del mouse: (" + mouseXPos + ", " + mouseYPos + ")", 20, 20);

*/
}
