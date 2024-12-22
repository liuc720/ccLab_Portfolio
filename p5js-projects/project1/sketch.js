let girl;
let rooms = [];
let currentScreen = 0; 
let gameState = 0; // 0: start screen, 1: main scene/rooms

let girlImage;
let roomImage1, roomImage2, roomImage3;
let mainBg;
let scaryFont;
let room3Bg;
let room1Bg;
let room2Bg;
let horrorSound;

let gameWonRoom1 = false; 
let gameWonRoom2 = false; 
let gameWonRoom3 = false;

//Dino game
let obstacles = [];
let groundY = 300; 
let gameOver = false;
let scrollSpeed = 15;
let gravity = 1;
let jumpForce = 15;
let score = 0;

//Falling Objects game
let fallingObjects = [];
let fallingGameOver = false;
let fallingScore = 10; 
let fallingGravity = 8; 
let fallingSpawnInterval = 20; 
let fallingShapes = ["circle", "square", "triangle", "polygon", "heart"];

//Typing Game
let reactionScore = 0;
let lives = 3;
let currentLetter = '';
let letterAppearedTime = 0;
let letterInterval = 1000; 
let letterActive = false;
let letterTimeout = 800; 
let lastLetterTime = 0;

function preload() {
  girlImage = loadImage('girl.png');
  roomImage1 = loadImage('room1.png');
  roomImage2 = loadImage('room2.png');
  roomImage3 = loadImage('room3.png');
  mainBg = loadImage('mainBg.png');
  scaryFont = loadFont('scaryFont.ttf');
  room3Bg = loadImage('room3Bg.png'); 
  room1Bg = loadImage('room1Bg.png');
  room2Bg = loadImage('room2Bg.png');
  
  // horror music
  horrorSound = loadSound('horror.mp3'); 
}

function setup() {
  createCanvas(600, 400);
  girl = new Girl(width/2, height - 50, 50);
  rooms.push(new Room(83, 133, 133, 133, roomImage1, "The First Room"));
  rooms.push(new Room(233, 133, 133, 133, roomImage2, "The Second Room"));
  rooms.push(new Room(383, 133, 133, 133, roomImage3, "The Third Room"));
}

function draw() {
  background(0);

  if (gameState === 0) {
    imageMode(CORNER);
    image(mainBg, 0, 0, width, height);
    imageMode(CENTER);
    image(girlImage, width/2, height/2, 200, 400);

    textFont(scaryFont);
    textSize(48);
    fill(255);
    textAlign(LEFT, BOTTOM);
    text("START", 50, height - 50);

  } else if (gameState === 1) {
    if (currentScreen === 0) {
      // main room
      imageMode(CORNER);
      image(mainBg, 0, 0, width, height);
      for (let i = 0; i < rooms.length; i++) {
        let room = rooms[i];
        room.display();
        if (room.contains(girl.x, girl.y)) {
          fill(255);
          textFont(scaryFont);
          textSize(16);
          textAlign(CENTER, BOTTOM);
          if (i === 0 && gameWonRoom1) {
            text("You already won. Can't play again.", room.x + room.w / 2, room.y - 20);
          } else if (i === 1 && gameWonRoom2) {
            text("You already won. Can't play again.", room.x + room.w / 2, room.y - 20);
          } else if (i === 2 && gameWonRoom3) {
            text("You already won. Can't play again.", room.x + room.w / 2, room.y - 20);
          } else {
            text(room.message, room.x + room.w / 2, room.y - 20);
          }
        }
      }

      imageMode(CENTER);
      image(girlImage, girl.x, girl.y, girl.size, girl.size);
      girl.moveMainScene();

    } else if (currentScreen === 1) {
      // room1
      runDinoGame();

    } else if (currentScreen === 2) {
      // room2
      runFallingGame();

    } else if (currentScreen === 3) {
      // room3
      runReactionGame();
    }
  }
}

function mousePressed() {
  if (gameState === 0) {
    let startX = 50;
    let startY = height - 50;
    let startW = 200; 
    let startH = 60;  
    if (
      mouseX > startX && 
      mouseX < startX + startW && 
      mouseY > (startY - startH) && 
      mouseY < startY
    ) {
      gameState = 1;
      girl.x = width/2;
      girl.y = height - 50;

      // loop horror music
      if (!horrorSound.isPlaying()) {
        horrorSound.loop();
      }
    }
  }
}

function keyPressed() {
  if (gameState === 1 && currentScreen === 0 && keyCode === ENTER) {
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].contains(girl.x, girl.y)) {
        if (i === 0 && !gameWonRoom1) {
          currentScreen = 1;
          resetDinoGame();
        }
        if (i === 1 && !gameWonRoom2) {
          currentScreen = 2;
          resetFallingGame();
        }
        if (i === 2 && !gameWonRoom3) {
          currentScreen = 3;
          resetReactionGame();
        }
      }
    }
  }

  // Dino
  if (currentScreen === 1) {
    if (!gameOver && !gameWonRoom1 && (key === ' ' || keyCode === UP_ARROW)) {
      girl.jumpDinoGame(groundY, jumpForce);
    }
    if (gameOver && keyCode === ENTER && !gameWonRoom1) {
      resetDinoGame();
    }
    if ((gameOver || gameWonRoom1) && keyCode === ESCAPE) {
      currentScreen = 0;
      girl.x = width/2;
      girl.y = height - 50;
      girl.vy = 0;
    }
  }

  // Falling
  if (currentScreen === 2) {
    if ((fallingGameOver || gameWonRoom2) && keyCode === ESCAPE) {
      currentScreen = 0;
      girl.x = width/2;
      girl.y = height - 50;
      girl.vy = 0;
    }
    if (fallingGameOver && keyCode === ENTER && !gameWonRoom2) {
      resetFallingGame();
    }
  }

  // Typing
  if (currentScreen === 3) {
    if (!gameWonRoom3 && lives > 0 && currentLetter !== '' && letterActive) {
      let pressedKey = key.toUpperCase();
      if (pressedKey === currentLetter) {
        reactionScore++;
        currentLetter = '';
        letterActive = false;
      } else if (pressedKey.match(/[A-Z]/)) {
        lives--;
        currentLetter = '';
        letterActive = false;
      }
    }

    if ((lives <= 0 || gameWonRoom3) && keyCode === ESCAPE) {
      currentScreen = 0;
      girl.x = width/2;
      girl.y = height - 50;
      girl.vy = 0;
    }

    if (lives <= 0 && keyCode === ENTER && !gameWonRoom3) {
      resetReactionGame();
    }
  }
}

// dino
function runDinoGame() {
  imageMode(CORNER);
  image(room1Bg, 0, 0, width, height);
  stroke(255,0,0);
  strokeWeight(4);
  line(0, groundY, width, groundY);
  noStroke();

  if (!gameOver && !gameWonRoom1) {
    girl.updateDinoGame(groundY, gravity);

    if (frameCount % 90 === 0) {
      let w = random(20, 50);
      let h = random(20, 50);
      obstacles.push(new Obstacle(width, groundY - h, w, h));
    }

    for (let obs of obstacles) {
      obs.x -= scrollSpeed;
      fill(50);
      rect(obs.x, obs.y, obs.w, obs.h);

      if (collideRectRect(obs.x, obs.y, obs.w, obs.h, girl.x - girl.size/2, girl.y - girl.size, girl.size, girl.size)) {
        gameOver = true;
      }
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
      if (obstacles[i].x + obstacles[i].w < 0) {
        score += 1;
        obstacles.splice(i, 1);
      }
    }

    if (score > 30) {
      gameWonRoom1 = true;
    }
  }

  imageMode(CENTER);
  image(girlImage, girl.x, girl.y - girl.size/2, girl.size, girl.size);

  textFont(scaryFont);
  textSize(24);
  fill(0);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 10);

  if (gameOver) {
    textFont(scaryFont);
    textSize(48);
    fill(255,0,0);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width/2, height/2);
    textSize(24);
    text("Press ENTER to restart", width/2, height/2 + 50);
    text("Press ESC to exit", width/2, height/2 + 80);
  }

  if (gameWonRoom1) {
    textFont(scaryFont);
    textSize(48);
    fill(0,0,255);
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width/2, height/2);
    textSize(24);
    text("Press ESC to return", width/2, height/2 + 50);
  }
}

function resetDinoGame() {
  gameOver = false;
  obstacles = [];
  score = 0;
  girl.x = 100; 
  girl.y = groundY;
  girl.vy = 0;
}

// Falling
function runFallingGame() {
  imageMode(CORNER);
  image(room2Bg, 0, 0, width, height);

  moveGirlInFallingGame();

  if (!fallingGameOver && !gameWonRoom2) {
    if (frameCount % fallingSpawnInterval === 0) {
      let shapeType = random(fallingShapes);
      let xPos = random(50, width - 50);
      let newObj = new FallingObject(xPos, -20, shapeType);
      fallingObjects.push(newObj);
    }

    for (let obj of fallingObjects) {
      obj.y += fallingGravity;
      obj.display();

      if (collideRectRect(obj.x - obj.size/2, obj.y - obj.size/2, obj.size, obj.size,
                          girl.x - girl.size/2, girl.y - girl.size/2, girl.size, girl.size)) {
        if (obj.shape === "heart") {
          fallingScore += 1; 
        } else {
          fallingScore -= 1; 
        }
        obj.caught = true;
      }

      if (obj.y > height + obj.size) {
        obj.caught = true;
      }
    }

    fallingObjects = fallingObjects.filter(o => !o.caught);

    if (fallingScore <= 0) {
      fallingGameOver = true;
    }
    if (fallingScore >= 30) {
      gameWonRoom2 = true;
    }
  }

  imageMode(CENTER);
  image(girlImage, girl.x, girl.y, girl.size, girl.size);

  textFont(scaryFont);
  textSize(24);
  fill(255); 
  textAlign(LEFT, TOP);
  text("Score: " + fallingScore, 10, 10);

  textAlign(RIGHT, TOP);
  textSize(16);
  fill(255);
  text("Collect hearts, avoid other objects", width - 10, 10);

  if (fallingGameOver) {
    textFont(scaryFont);
    textSize(48);
    fill(255,0,0);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width/2, height/2);
    textSize(24);
    text("Press ENTER to restart", width/2, height/2 + 50);
    text("Press ESC to exit", width/2, height/2 + 80);
  }

  if (gameWonRoom2) {
    textFont(scaryFont);
    textSize(48);
    fill(0,0,255);
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width/2, height/2);
    textSize(24);
    text("Press ESC to return", width/2, height/2 + 50);
  }
}

function resetFallingGame() {
  fallingGameOver = false;
  fallingObjects = [];
  fallingScore = 10;
  girl.x = width/2;
  girl.y = height - 50;
  girl.vy = 0;
}

function moveGirlInFallingGame() {
  let moveDist = 8; 
  if (keyIsDown(LEFT_ARROW)) {
    girl.x -= moveDist;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    girl.x += moveDist;
  }
  if (keyIsDown(UP_ARROW)) {
    girl.y -= moveDist;
  }
  if (keyIsDown(DOWN_ARROW)) {
    girl.y += moveDist;
  }

  if (girl.x < girl.size/2) girl.x = girl.size/2;
  if (girl.x > width - girl.size/2) girl.x = width - girl.size/2;
  if (girl.y < girl.size/2) girl.y = girl.size/2;
  if (girl.y > height - girl.size/2) girl.y = height - girl.size/2;
}

// Typing
function runReactionGame() {
  imageMode(CORNER);
  image(room3Bg, 0, 0, width, height);

  if (lives > 0 && !gameWonRoom3) {
    let now = millis();
    if (!letterActive && now - lastLetterTime > letterInterval) {
      spawnLetter();
      lastLetterTime = now;
    }

    if (letterActive && now - letterAppearedTime > letterTimeout) {
      lives--;
      currentLetter = '';
      letterActive = false;
    }

    if (reactionScore >= 10) {
      gameWonRoom3 = true;
    }
  }

  textFont(scaryFont);
  textSize(24);
  fill(255);
  textAlign(LEFT, TOP);
  text("Score: " + reactionScore, 10, 10);
  text("Lives: " + lives, 10, 40);

  textAlign(RIGHT, TOP);
  textSize(16);
  fill(255);
  text("Type the displayed letter quickly!", width - 10, 10);

  if (currentLetter !== '' && letterActive) {
    textSize(64);
    textAlign(CENTER, CENTER);
    fill(255,0,0);
    text(currentLetter, width/2, height/2);
  }

  if (lives <= 0) {
    textFont(scaryFont);
    textSize(48);
    fill(255,0,0);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width/2, height/2);
    textSize(24);
    text("Press ENTER to restart", width/2, height/2 + 50);
    text("Press ESC to exit", width/2, height/2 + 80);
  }

  if (gameWonRoom3) {
    textFont(scaryFont);
    textSize(48);
    fill(0,0,255);
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width/2, height/2);
    textSize(24);
    text("Press ESC to return", width/2, height/2 + 50);
  }
}

function resetReactionGame() {
  reactionScore = 0;
  lives = 3;
  currentLetter = '';
  letterActive = false;
  gameWonRoom3 = false; 
  lastLetterTime = millis();
}

function spawnLetter() {
  let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  currentLetter = letters.charAt(floor(random(letters.length)));
  letterActive = true;
  letterAppearedTime = millis();
}

function collideRectRect(x1, y1, w1, h1, x2, y2, w2, h2) {
  return (x1 < x2 + w2 &&
          x1 + w1 > x2 &&
          y1 < y2 + h2 &&
          y1 + h1 > y2);
}

class Girl {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.vy = 0;
  }

  moveMainScene() {
    let moveDist = 8; 
    if (keyIsDown(LEFT_ARROW)) this.x -= moveDist;
    if (keyIsDown(RIGHT_ARROW)) this.x += moveDist;
    if (keyIsDown(UP_ARROW)) this.y -= moveDist;
    if (keyIsDown(DOWN_ARROW)) this.y += moveDist;
  }

  updateDinoGame(groundY, gravity) {
    this.vy += gravity;
    this.y += this.vy;
    if (this.y > groundY) {
      this.y = groundY;
      this.vy = 0;
    }
  }

  jumpDinoGame(groundY, jumpForce) {
    if (this.y === groundY) {
      this.vy = -jumpForce;
    }
  }
}

class Room {
  constructor(x, y, w, h, img, message) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = img;
    this.message = message;
  }

  display() {
    imageMode(CORNER);
    image(this.img, this.x, this.y, this.w, this.h);
  }

  contains(px, py) {
    return px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h;
  }
}

class Obstacle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

class FallingObject {
  constructor(x, y, shape) {
    this.x = x;
    this.y = y;
    this.shape = shape;
    this.size = 30; 
    this.caught = false; 
  }

  display() {
    fill(255);
    noStroke();
    if (this.shape === "circle") {
      ellipse(this.x, this.y, this.size);
    } else if (this.shape === "square") {
      rectMode(CENTER);
      rect(this.x, this.y, this.size, this.size);
    } else if (this.shape === "triangle") {
      triangle(this.x, this.y - this.size/2, this.x - this.size/2, this.y + this.size/2, this.x + this.size/2, this.y + this.size/2);
    } else if (this.shape === "polygon") {
      beginShape();
      for (let i = 0; i < 5; i++) {
        let angle = TWO_PI * i / 5 - PI/2;
        let vx = this.x + cos(angle) * (this.size/2);
        let vy = this.y + sin(angle) * (this.size/2);
        vertex(vx, vy);
      }
      endShape(CLOSE);
    } else if (this.shape === "heart") {
      push();
      translate(this.x, this.y);
      beginShape();
      vertex(0, -this.size/4);
      bezierVertex(-this.size/2, -this.size/2, -this.size/2, this.size/4, 0, this.size/2);
      bezierVertex(this.size/2, this.size/4, this.size/2, -this.size/2, 0, -this.size/4);
      endShape(CLOSE);
      pop();
    }
  }
}